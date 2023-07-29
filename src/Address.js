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
import AppBar from "@mui/material/AppBar";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import CssBaseline from "@mui/material/CssBaseline";
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
const Swap = () => {
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

  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [resultData, setResultData] = useState(null);
  let [resultPoolBalance, setResultPoolBalance] = useState(null);
  let [showCredit, setShowCredit] = useState(0);
  let [showBalance, setShowBalance] = useState(null);
  const [maxBalance, setMaxBalance] = useState(0);
  const [showModal, setShowModal] = React.useState(false);
  let [resultWinData, setResultWinData] = useState(null);
  let [allValues, setAllValues] = useState(0);
  let [totalTicket, setTotalTicket] = useState(0);
  const [resultArrayWin, setResultArrayWin] = useState([]);
  const [minValues, setMinValues] = useState({});
  const [getSupply, setSupply] = useState(null);
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
  let getTotalTicketCount = data.getTotalTicketCount;
  let tokenURI = data.tokenURI;
  let getCredit = data.getCredit;
  let totalSupply = data.totalSupply;
  let getDataByMap = data.getDataByMap;
  let getWinAdd = data.getWinAdd;
  let getBalance = data.getBalance / 1000000000000000000;
  getBalance = getBalance.toFixed(2);
  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };
  const swapCredit = () => {
    let cost1 = 0;
    let gasLimit = 3000000;
    let totalCostWei = String(mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    blockchain.smartContract.methods
      .swapCredit(input1)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        alert("Sorry, something went wrong please try again later.");
      })
      .then((receipt) => {
        console.log(receipt);
        setShowModal(true);
        dispatch(fetchData(blockchain.account));
      });
  };
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
  useEffect(() => {
    if (resultWinData !== null) {
      const id2 = id.toLowerCase();
      const groupedData = resultWinData.reduce((acc, curr) => {
        const name = curr[0].toLowerCase(); // Wallet
        const ticketNumber = curr[1]; // Ticket Number
        const key = curr[2]; // (wonMaps)
        const colorNumber = curr[3]; // Color Number
        const value = curr[4]; // (wonTime)
        const s0 = curr[5]; // Sector 0
        const s1 = curr[6]; // Sector 1
        const s2 = curr[7]; // Sector 2
        const s3 = curr[8]; // Sector 3

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
                            className=" mr-2 inline-flex animate-pulse items-center rounded-lg bg-slate-800/50 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-slate-800/80 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
                          className=" mr-2 inline-flex animate-pulse items-center rounded-lg bg-slate-800/50 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-slate-800/80 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
                            <td className="px-6 py-3 text-gray-500">{value}</td>
                            <td className=" px-6 py-3 text-gray-500">{s0}</td>
                            <td className=" px-6 py-3 text-gray-500">{s1}</td>
                            <td className="px-6 py-3 text-gray-500">{s2}</td>
                            <td className="px-6 py-3 text-gray-500">{s3}</td>
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
    </>
  );
};
export default Swap;
