import { useParams } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import { Base64 } from "js-base64";
import * as s from "./styles/globalStyles";
import { styled } from "@mui/material/styles";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

import Paper from "@mui/material/Paper";
import { makeStyles } from "@mui/styles";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
const useStyles = makeStyles({});
const containerStyles = {};
const truncate = (input) => {
  const first5 = input.substring(0, 5);
  const last4 = input.substring(input.length - 4);
  return input ? `${first5}...${last4}` : input;
};
const Address = () => {
  const { id } = useParams();
  if (id.length !== 42 || id[0] !== "0") {
    return <Navigate to="/" />;
  }
  const colors = [
    "plum",
    "deeppink",
    "dodgerblue",
    "lightcoral",
    "orange",
    "red",
    "white",
    "mediumblue",
    "aquamarine",
    "forestgreen",
  ];

  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });
  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    console.log(config);
    SET_CONFIG(config);
  };
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [resultData, setResultData] = useState(null);
  let [showCredit, setShowCredit] = useState(0);
  const [showModal, setShowModal] = React.useState(false);
  const [showModal2, setShowModal2] = React.useState(false);
  const [showModal3, setShowModal3] = React.useState(false);
  let [resultWinData, setResultWinData] = useState(null);
  let [allValues, setAllValues] = useState(0);
  let [totalTicket, setTotalTicket] = useState(0);
  const [minValues, setMinValues] = useState({});
  const [getSupply, setSupply] = useState(null);
  let [claimId, setClaimId] = useState(null);
  const [xNft, setxNft] = useState(false);
  useEffect(() => {
    getConfig();
  }, []);

  const xNFTs = () => {
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalGasLimit = String(gasLimit);

    blockchain.smartContract.methods
      .claimMapid(Number(claimId))
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: 0,
      })
      .once("transactionHash", (hash) => {
        setShowModal2(true);
      })
      .once("error", (err) => {
        console.log(err);
        setxNft(false);
        setShowModal2(false);
        setShowModal3(true);
      })
      .then((receipt) => {
        console.log(receipt);
        setShowModal2(false);
        setShowModal(true);
        setxNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const handleInputChange1 = (event) => {
    const value = event.target.value;
    setInput1(value);
  };
  const handleInputChange2 = (event) => {
    const value = event.target.value;
    setInput2(value);
  };
  const handleFormSubmit = (event) => {
    event.preventDefault();
    swapCredit();
  };

  let totalSupply = data.totalSupply;
  let getDataByMap = data.getDataByMap;
  let getBalance = data.getBalance / 1000000000000000000;
  getBalance = getBalance.toFixed(2);
  let getWinAdd = data.getWinAdd;

  useEffect(() => {
    if (blockchain && blockchain.account !== null) {
      blockchain.smartContract.methods
        .totalSupply()
        .call()
        .then((result) => {
          let updatedSupply = result;
          setSupply(updatedSupply);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [blockchain.account, blockchain.smartContract]);

  useEffect(() => {
    if (blockchain.account !== null) {
      var tokenId = String(totalSupply);
      blockchain.smartContract.methods
        .getPlayerAddress(tokenId)
        .call()
        .then((result) => {
          setResultData(result);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [blockchain.account, getDataByMap]);

  useEffect(() => {
    if (blockchain.account !== null) {
      blockchain.smartContract.methods
        .getTotalTicketCount()
        .call()
        .then((result) => {
          setTotalTicket(result);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [blockchain.account, totalTicket]);

  let resultArray = [];
  useEffect(() => {
    if (resultData && resultData.length !== null) {
      for (let i = 1; i < resultData.length; i++) {
        resultArray.push(resultData[i]);
        console.log(resultArray);
      }
    }
  }, [resultData]);

  useEffect(() => {
    if (blockchain && blockchain.account !== null) {
      blockchain.smartContract.methods
        .getCreditAmount(String(id))
        .call()
        .then((result) => {
          setShowCredit(result);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [blockchain.account, showCredit]);

  useEffect(() => {
    if (blockchain.account !== null) {
      blockchain.smartContract.methods
        .viewAllData()
        .call()
        .then((result) => {
          setResultWinData(result);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [blockchain.account]);

  const getData = () => {
    dispatch(fetchData(blockchain.account));
  };
  useEffect(() => {
    getData();
  }, [blockchain.account]);
  useEffect(() => {
    if (resultWinData !== null) {
      const id2 = id.toLowerCase();
      const groupedData = resultWinData.reduce((acc, curr) => {
        const name = curr[0].toLowerCase();
        const ticketNumber = curr[1];
        const key = curr[2];
        const colorNumber = curr[3];
        const value = curr[4];
        const s0 = curr[5];
        const s1 = curr[6];
        const s2 = curr[7];
        const s3 = curr[8];

        if (!acc[key] || value < acc[key].value) {
          acc[key] = { value, name, colorNumber, s0, s1, s2, s3 };
        }
        return acc;
      }, {});

      const filteredData = Object.fromEntries(
        Object.entries(groupedData).filter(([key, { name }]) => name === id2),
      );
      const keys = Object.keys(filteredData);
      const lastKey = keys[keys.length - 1];
      if (getSupply == lastKey) {
        delete filteredData[
          Object.keys(filteredData)[Object.keys(filteredData).length - 1]
        ];
        setMinValues(filteredData);
      } else {
        setMinValues(filteredData);
      }
    }
  }, [resultWinData, id, totalTicket]);

  useEffect(() => {
    if (resultWinData !== null) {
      const id2 = id.toLowerCase();
      const filteredDatas = resultWinData.filter(
        (curr) => curr[2] !== getSupply,
      );

      const filteredData = filteredDatas.reduce((acc, curr) => {
        const name = curr[0].toLowerCase();
        const ticketNumber = curr[1];
        const key = curr[2];
        const colorNumber = curr[3];
        const value = curr[4];
        const s0 = curr[5];
        const s1 = curr[6];
        const s2 = curr[7];
        const s3 = curr[8];

        if (name === id2) {
          acc.push({ value, key, name, colorNumber, s0, s1, s2, s3 });
        }
        return acc;
      }, []);
      console.log(filteredData);
      setAllValues(filteredData);
    }
  }, [resultWinData, id, getSupply]);

  return (
    <>
      <div className="mx-auto  mb-3 mt-5 p-5 text-center">
        <p className="break-words text-base font-bold text-slate-300 sm:text-2xl  md:text-2xl">
          Racer: {id}
        </p>
      </div>
      <div className="container   mx-auto  p-5">
        <div className=" from-bgc/50 rounded-2xl border border-solid border-slate-500/20 bg-gradient-to-b py-24 shadow-2xl sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {(() => {
              if (
                blockchain.account !== null &&
                blockchain.account.toLowerCase() == id.toLowerCase()
              ) {
                return (
                  <>
                    <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
                      <div className="mx-auto flex max-w-xs flex-col gap-y-3">
                        <dt className=" leading-7  text-gray-600">
                          Total Credit
                        </dt>
                        <dd className="order-first text-3xl font-semibold tracking-tight text-teal-600  sm:text-5xl">
                          {showCredit}
                        </dd>
                        <Link to={`/Credit`}>
                          <button
                            type="button"
                            className=" mr-2 inline-flex animate-pulse items-center rounded-lg bg-slate-800/50 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-slate-800/80 focus:outline-none focus:ring-4 focus:ring-blue-300 "
                          >
                            <svg
                              className="mr-2 h-3.5 w-3.5"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 18 21"
                            >
                              <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
                            </svg>
                            Buy Credit
                          </button>
                        </Link>
                      </div>
                      <div className="mx-auto flex max-w-xs flex-col gap-y-3">
                        <dt className="text-base leading-7 text-gray-600">
                          Total Race
                        </dt>
                        <dd className="order-first text-3xl font-semibold tracking-tight text-teal-600  sm:text-5xl">
                          {String(Object.keys(allValues).length)}
                        </dd>
                      </div>
                      <div className="mx-auto flex max-w-xs flex-col gap-y-3">
                        <dt className="text-base leading-7 text-gray-600">
                          Total Win
                        </dt>
                        <dd className="order-first text-3xl font-semibold tracking-tight text-teal-600  sm:text-5xl">
                          {String(Object.keys(minValues).length)}
                        </dd>
                      </div>

                      <div className="mx-auto flex max-w-xs flex-col gap-y-3">
                        <dt className="text-base leading-7 text-gray-600">
                          W/L Ratio
                        </dt>
                        <dd className="order-first text-3xl font-semibold tracking-tight text-teal-600  sm:text-5xl">
                          {Number.isNaN(
                            Object.keys(minValues).length /
                              Object.keys(allValues).length,
                          )
                            ? 0
                            : Object.keys(minValues).length /
                              Object.keys(allValues).length}
                        </dd>
                      </div>
                    </dl>
                  </>
                );
              } else {
                return (
                  <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
                    <div className="mx-auto flex max-w-xs flex-col gap-y-3">
                      <dt className=" leading-7  text-gray-600">
                        Total Credit
                      </dt>
                      <dd className="order-first text-3xl font-semibold tracking-tight text-teal-600  sm:text-5xl">
                        {showCredit}
                      </dd>
                      <Link to={`/Credit`}>
                        <button
                          type="button"
                          className=" mr-2 inline-flex animate-pulse items-center rounded-lg bg-slate-800/50 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-slate-800/80 focus:outline-none focus:ring-4 focus:ring-blue-300 "
                        >
                          <svg
                            className="mr-2 h-3.5 w-3.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 18 21"
                          >
                            <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
                          </svg>
                          Buy Credit
                        </button>
                      </Link>
                    </div>
                    <div className="mx-auto flex max-w-xs flex-col gap-y-3">
                      <dt className="text-base leading-7 text-gray-600">
                        Total Race
                      </dt>
                      <dd className="order-first text-3xl font-semibold tracking-tight text-teal-600  sm:text-5xl">
                        {String(Object.keys(allValues).length)}
                      </dd>
                    </div>
                    <div className="mx-auto flex max-w-xs flex-col gap-y-3">
                      <dt className="text-base leading-7 text-gray-600">
                        Total Win
                      </dt>
                      <dd className="order-first text-3xl font-semibold tracking-tight text-teal-600  sm:text-5xl">
                        {String(Object.keys(minValues).length)}
                      </dd>
                    </div>

                    <div className="mx-auto flex max-w-xs flex-col gap-y-3">
                      <dt className="text-base leading-7 text-gray-600">
                        W/L Ratio
                      </dt>
                      <dd className="order-first text-3xl font-semibold tracking-tight text-teal-600  sm:text-5xl">
                        {(
                          Object.keys(minValues).length /
                          Object.keys(allValues).length
                        ).toFixed(2)}
                      </dd>
                    </div>
                  </dl>
                );
              }
            })()}
          </div>
        </div>
      </div>

      <div className="container  mx-auto   p-5">
        <div className=" from-bgc/50 rounded-2xl border border-solid border-slate-500/20 bg-gradient-to-b shadow-2xl ">
          <section className="bg-transparent  ">
            <div className="mx-auto grid  max-w-full p-2 lg:grid-cols-12 lg:gap-8 lg:p-8 lg:py-10 xl:gap-0">
              <div className="mr-auto place-self-center  lg:col-span-4">
                <h1 className=" mb-4  max-w-2xl text-4xl font-extrabold  leading-none tracking-tight text-teal-600 md:text-5xl xl:text-6xl ">
                  Won Races
                </h1>
              </div>
              <div className="  mx-x-auto from-bgc/50 max-w-full rounded-2xl  border border-solid border-slate-500/20 bg-gradient-to-b shadow-2xl lg:col-span-8 lg:mt-0">
                <div className="h-100 flex w-full  items-center justify-center">
                  <table className="w-full table-fixed border border-slate-500  text-center text-sm ">
                    <thead className="border-b border-solid  border-slate-500 text-sm text-gray-400 ">
                      <tr>
                        <th scope="col" className="px-3 py-3">
                          Color
                        </th>
                        <th scope="col" className="px-3 py-3">
                          Race ID
                        </th>
                        <th scope="col" className="px-3 py-3">
                          Total Time
                        </th>
                        <th scope="col" className="px-3 py-3">
                          Sector 0
                        </th>
                        <th scope="col" className="px-3 py-3">
                          Sector 1
                        </th>
                        <th scope="col" className="px-3 py-3">
                          Sector 2
                        </th>
                        <th scope="col" className="px-3 py-3">
                          Sector 3
                        </th>
                        <th scope="col" className="px-3 py-3">
                          Claim
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(minValues).map(
                        ([
                          key,
                          { value, name, colorNumber, s0, s1, s2, s3 },
                        ]) => (
                          <tr key={key}>
                            <td className={`text-${colors[colorNumber]}`}>
                              {" "}
                              ⬤{" "}
                            </td>
                            <td className=" px-6 py-3 text-gray-500 underline">
                              <Link to={`/Race/${key}`}> #{key} </Link>
                            </td>
                            <td className="px-3 py-1 text-gray-500">{value}</td>
                            <td className=" px-3 py-1 text-gray-500">{s0}</td>
                            <td className=" px-3 py-1 text-gray-500">{s1}</td>
                            <td className="px-3 py-1 text-gray-500">{s2}</td>
                            <td className="px-3 py-1 text-gray-500">{s3}</td>
                            <td className="px-3 py-1 text-gray-500">
                              <div class="sm:col-span-2 md:grow">
                                <button
                                  className="  rounded-lg  border border-dotted  border-teal-500/50  p-1  text-sm font-light text-teal-600/70 shadow-sm  transition-all   "
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setClaimId(Number(key));
                                    xNFTs();
                                    getData();
                                  }}
                                >
                                  {xNft ? "Sending..." : "Claim NFT"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className=" container mx-auto p-5">
        <div className=" from-bgc/50 rounded-2xl border border-solid border-slate-500/20 bg-gradient-to-b shadow-2xl ">
          <section className="bg-transparent  ">
            <div className="mx-auto grid  max-w-full p-2 lg:grid-cols-12 lg:gap-8 lg:p-8 lg:py-10 xl:gap-0">
              <div className="place-self-top mr-auto  lg:col-span-4">
                <h1 className="mb-4  max-w-2xl text-4xl font-extrabold  leading-none tracking-tight text-teal-600 md:text-5xl xl:text-6xl ">
                  All Races
                </h1>
              </div>
              <div className="  mx-x-auto from-bgc/50 max-w-full rounded-2xl  border border-solid border-slate-500/20 bg-gradient-to-b shadow-2xl lg:col-span-8 lg:mt-0">
                <div className="h-100 flex w-full  items-center justify-center">
                  <table className="w-full table-fixed border border-slate-500  text-center text-sm ">
                    <thead className="border-b border-solid  border-slate-500 text-sm text-gray-400 ">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Color
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Race ID
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Total Time
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Sector 0
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Sector 1
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Sector 2
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Sector 3
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(allValues).map(
                        ([
                          keys,
                          { value, key, name, colorNumber, s0, s1, s2, s3 },
                        ]) => (
                          <tr key={keys}>
                            <td className={`text-${colors[colorNumber]}`}>
                              {" "}
                              ⬤{" "}
                            </td>
                            <td className="px-6 py-2 text-gray-500 underline">
                              <Link to={`/Race/${key}`}> #{key} </Link>
                            </td>
                            <td className="px-6 py-2 text-gray-500">{value}</td>
                            <td className="px-6 py-2 text-gray-500">{s0}</td>
                            <td className="px-6 py-2 text-gray-500">{s1}</td>
                            <td className="px-6 py-2 text-gray-500">{s2}</td>
                            <td className="px-6 py-2 text-gray-500">{s3}</td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      {showModal ? (
        <>
          <div>
            <div
              class="fixed bottom-5 right-5 z-50  max-w-sm rounded-md  bg-teal-900/40 text-sm font-bold text-white shadow-lg"
              role="alert"
            >
              <div class="flex p-4">
                <div class="flex-shrink-0">
                  <svg
                    class="mt-0.5 mr-2 h-4 w-4 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                  </svg>
                </div>
                Successful Claimed !
                <div class="ml-auto">
                  <button
                    onClick={() => setShowModal(false)}
                    type="button"
                    class="inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-md text-sm text-white/[.9] transition-all hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-gray-800 "
                  >
                    <span class="sr-only">Close</span>
                    <svg
                      className="ml-1 h-3.5 w-3.5"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.92524 0.687069C1.126 0.486219 1.39823 0.373377 1.68209 0.373377C1.96597 0.373377 2.2382 0.486219 2.43894 0.687069L8.10514 6.35813L13.7714 0.687069C13.8701 0.584748 13.9882 0.503105 14.1188 0.446962C14.2494 0.39082 14.3899 0.361248 14.5321 0.360026C14.6742 0.358783 14.8151 0.38589 14.9468 0.439762C15.0782 0.493633 15.1977 0.573197 15.2983 0.673783C15.3987 0.774389 15.4784 0.894026 15.5321 1.02568C15.5859 1.15736 15.6131 1.29845 15.6118 1.44071C15.6105 1.58297 15.5809 1.72357 15.5248 1.85428C15.4688 1.98499 15.3872 2.10324 15.2851 2.20206L9.61883 7.87312L15.2851 13.5441C15.4801 13.7462 15.588 14.0168 15.5854 14.2977C15.5831 14.5787 15.4705 14.8474 15.272 15.046C15.0735 15.2449 14.805 15.3574 14.5244 15.3599C14.2437 15.3623 13.9733 15.2543 13.7714 15.0591L8.10514 9.38812L2.43894 15.0591C2.23704 15.2543 1.96663 15.3623 1.68594 15.3599C1.40526 15.3574 1.13677 15.2449 0.938279 15.046C0.739807 14.8474 0.627232 14.5787 0.624791 14.2977C0.62235 14.0168 0.730236 13.7462 0.92524 13.5441L6.59144 7.87312L0.92524 2.20206C0.724562 2.00115 0.611816 1.72867 0.611816 1.44457C0.611816 1.16047 0.724562 0.887983 0.92524 0.687069Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
      {showModal2 ? (
        <div>
          <div
            class="fixed bottom-5 right-5 z-50  max-w-sm rounded-md  bg-blue-700/40 text-sm font-bold text-white shadow-lg "
            role="alert"
          >
            <div class="flex p-4">
              <svg
                aria-hidden="true"
                class="mr-2 h-5 w-5 animate-spin fill-blue-500 text-gray-200 "
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              Claiming NFT...
              <div class="ml-auto">
                <button
                  onClick={() => setShowModal2(false)}
                  type="button"
                  class="ml-2 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-md text-sm text-white/[.9] transition-all hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-gray-800 "
                >
                  <span class="sr-only">Close</span>
                  <svg
                    class="h-3.5 w-3.5"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.92524 0.687069C1.126 0.486219 1.39823 0.373377 1.68209 0.373377C1.96597 0.373377 2.2382 0.486219 2.43894 0.687069L8.10514 6.35813L13.7714 0.687069C13.8701 0.584748 13.9882 0.503105 14.1188 0.446962C14.2494 0.39082 14.3899 0.361248 14.5321 0.360026C14.6742 0.358783 14.8151 0.38589 14.9468 0.439762C15.0782 0.493633 15.1977 0.573197 15.2983 0.673783C15.3987 0.774389 15.4784 0.894026 15.5321 1.02568C15.5859 1.15736 15.6131 1.29845 15.6118 1.44071C15.6105 1.58297 15.5809 1.72357 15.5248 1.85428C15.4688 1.98499 15.3872 2.10324 15.2851 2.20206L9.61883 7.87312L15.2851 13.5441C15.4801 13.7462 15.588 14.0168 15.5854 14.2977C15.5831 14.5787 15.4705 14.8474 15.272 15.046C15.0735 15.2449 14.805 15.3574 14.5244 15.3599C14.2437 15.3623 13.9733 15.2543 13.7714 15.0591L8.10514 9.38812L2.43894 15.0591C2.23704 15.2543 1.96663 15.3623 1.68594 15.3599C1.40526 15.3574 1.13677 15.2449 0.938279 15.046C0.739807 14.8474 0.627232 14.5787 0.624791 14.2977C0.62235 14.0168 0.730236 13.7462 0.92524 13.5441L6.59144 7.87312L0.92524 2.20206C0.724562 2.00115 0.611816 1.72867 0.611816 1.44457C0.611816 1.16047 0.724562 0.887983 0.92524 0.687069Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {showModal3 ? (
        <>
          <div>
            <div
              class="fixed bottom-5 right-5 z-50  max-w-sm rounded-md  bg-rose-900/40 text-sm font-bold text-rose-200 shadow-lg "
              role="alert"
            >
              <div class="flex p-4">
                <svg
                  className="mt-0.5 mr-1 h-4 w-4 text-rose-500"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
                </svg>{" "}
                Something Went Wrong!
                <div class="ml-auto">
                  <button
                    onClick={() => setShowModal3(false)}
                    type="button"
                    class="ml-2 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-md text-sm text-white/[.9] transition-all hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-gray-800 "
                  >
                    <span class="sr-only">Close</span>
                    <svg
                      class="h-3.5 w-3.5"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.92524 0.687069C1.126 0.486219 1.39823 0.373377 1.68209 0.373377C1.96597 0.373377 2.2382 0.486219 2.43894 0.687069L8.10514 6.35813L13.7714 0.687069C13.8701 0.584748 13.9882 0.503105 14.1188 0.446962C14.2494 0.39082 14.3899 0.361248 14.5321 0.360026C14.6742 0.358783 14.8151 0.38589 14.9468 0.439762C15.0782 0.493633 15.1977 0.573197 15.2983 0.673783C15.3987 0.774389 15.4784 0.894026 15.5321 1.02568C15.5859 1.15736 15.6131 1.29845 15.6118 1.44071C15.6105 1.58297 15.5809 1.72357 15.5248 1.85428C15.4688 1.98499 15.3872 2.10324 15.2851 2.20206L9.61883 7.87312L15.2851 13.5441C15.4801 13.7462 15.588 14.0168 15.5854 14.2977C15.5831 14.5787 15.4705 14.8474 15.272 15.046C15.0735 15.2449 14.805 15.3574 14.5244 15.3599C14.2437 15.3623 13.9733 15.2543 13.7714 15.0591L8.10514 9.38812L2.43894 15.0591C2.23704 15.2543 1.96663 15.3623 1.68594 15.3599C1.40526 15.3574 1.13677 15.2449 0.938279 15.046C0.739807 14.8474 0.627232 14.5787 0.624791 14.2977C0.62235 14.0168 0.730236 13.7462 0.92524 13.5441L6.59144 7.87312L0.92524 2.20206C0.724562 2.00115 0.611816 1.72867 0.611816 1.44457C0.611816 1.16047 0.724562 0.887983 0.92524 0.687069Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};
export default Address;
