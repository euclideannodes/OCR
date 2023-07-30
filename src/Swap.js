import { useParams } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";

import * as s from "./styles/globalStyles";
import { styled } from "@mui/material/styles";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Paper from "@mui/material/Paper";

import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";

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
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [resultData, setResultData] = useState(null);
  let [resultPoolBalance, setResultPoolBalance] = useState(null);
  let [showCredit, setShowCredit] = useState(null);
  let [showBalance, setShowBalance] = useState(null);
  const [getCost1, setCost1] = useState(null);
  const [getSwapFee, setSwapFee] = useState(null);
  const [getSwapStatus, setSwapStatus] = useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  let totalSupply = data.totalSupply;
  let getDataByMap = data.getDataByMap;
  let getBalance = data.getBalance / 1000000000000000000;
  getBalance = getBalance.toFixed(2);

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
  useEffect(() => {
    if (blockchain.account !== null) {
      blockchain.smartContract.methods
        .cost_1()
        .call()
        .then((result) => {
          setCost1(result / 1000000000000000000);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [blockchain.account, getCost1]);
  useEffect(() => {
    if (blockchain.account !== null) {
      blockchain.smartContract.methods
        .cost_1()
        .call()
        .then((result) => {
          setSwapFee(result);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [blockchain.account, getSwapFee]);

  useEffect(() => {
    if (blockchain.account !== null) {
      blockchain.smartContract.methods
        .swapIsActive()
        .call()
        .then((result) => {
          setSwapStatus(result);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [blockchain.account, getSwapStatus]);
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
      })
      .then((receipt) => {
        console.log(receipt);
        setShowModal(true);
        dispatch(fetchData(blockchain.account));
      });
  };

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
      var pool = blockchain.smartContract._address;

      blockchain.smartContract.methods
        .getBalance(String(pool))
        .call()
        .then((result) => {
          setResultPoolBalance(result);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [blockchain.account, resultPoolBalance]);
  resultPoolBalance = resultPoolBalance / 1000000000000000000;
  useEffect(() => {
    if (blockchain && blockchain.account !== null) {
      blockchain.smartContract.methods
        .getBalance(String(blockchain.account))
        .call()
        .then((result) => {
          result = result / 1000000000000000000;
          result = result.toFixed(2);
          setShowBalance(result);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [blockchain.account, showBalance]);
  useEffect(() => {
    if (blockchain && blockchain.account !== null) {
      blockchain.smartContract.methods
        .getCreditAmount(String(blockchain.account))
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
    if (
      blockchain.account !== null &&
      Number(resultPoolBalance) < input1 * getCost1 * 0.5
    ) {
      setShowModal2(true);
    }
  }, [blockchain.account, resultPoolBalance, input1]);
  useEffect(() => {
    if (blockchain.account !== null && Number(showCredit) < input1) {
      setShowModal3(true);
    }
  }, [blockchain.account, resultPoolBalance, input1]);

  return (
    <>
      <div className="container my-6 mx-auto">
        <section className="relative z-20 overflow-hidden bg-transparent">
          <div className="">
            <div className="-mx-4 mt-10 flex flex-wrap justify-center p-5 lg:p-0">
              <div className=" w-full px-4 md:w-1/2 lg:w-1/3 lg:px-0">
                <div className="shadow-xs relative z-10 mb-10 overflow-hidden rounded-xl border border-solid border-teal-500 border-opacity-20 bg-[#212537]/10 py-10 px-8 text-center text-slate-200 shadow-teal-500 sm:p-6 lg:py-10 lg:px-6 xl:p-6">
                  {(() => {
                    if (blockchain.account !== null) {
                      return (
                        <>
                          <p className="mb-1 grid text-sm  text-slate-400 ">
                            <span className="text-left "> From</span>
                          </p>
                          <div className="from-bgc/50 grid  grid-cols-2 grid-rows-2 gap-1 rounded-lg border border-solid border-slate-500/20 bg-gradient-to-b shadow-2xl">
                            <div className="col-span-2 ">
                              {" "}
                              <input
                                type="number"
                                placeholder="0"
                                value={input1}
                                onChange={handleInputChange1}
                                className="block  w-full rounded-md border-0 bg-[#212537]/10 py-1 text-left text-xl placeholder-slate-400 focus:outline-none"
                              />
                            </div>
                            <div className="row-start-2 mx-3 text-start  text-sm">
                              Credit
                            </div>
                            <div className="row-start-2 text-end text-sm ">
                              Balance: {Number(showCredit)}{" "}
                              <button
                                className="  border-0 bg-transparent p-0 hover:bg-transparent focus:ring-0 "
                                type="text"
                                onClick={() => setInput1(Number(showCredit))}
                              >
                                <span className=" mx-1 mr-2 rounded-lg bg-teal-900 px-2 py-1 text-xs font-medium  text-slate-200 ">
                                  Max
                                </span>{" "}
                              </button>
                            </div>
                          </div>
                          <button
                            type="button"
                            className=" my-2  inline-flex items-center p-1 text-center text-xs"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              className="h-6 w-6"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                              />
                            </svg>
                          </button>
                          <p className="grid text-sm  text-slate-400 ">
                            <span className="text-left "> To</span>
                          </p>
                          <div className="from-bgc/50 grid  grid-cols-2 grid-rows-2 gap-1 rounded-lg border border-solid border-slate-500/20  bg-gradient-to-b shadow-2xl">
                            <div className="col-span-2">
                              <input
                                disabled
                                type="number"
                                placeholder="0"
                                value={input1 * getCost1 * 0.5}
                                onChange={handleInputChange2}
                                className="block  w-full rounded-md border-0 bg-[#212537]/10 py-1 text-left text-xl placeholder-slate-400 focus:outline-none"
                              />
                            </div>

                            <div className=" row-start-2  mx-1 inline-flex items-center text-start  text-sm   ">
                              <svg
                                className="mr-1 ml-2 h-3 w-3"
                                fill="#8247E5"
                                viewBox="0 0 38 33"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M29,10.2c-0.7-0.4-1.6-0.4-2.4,0L21,13.5l-3.8,2.1l-5.5,3.3c-0.7,0.4-1.6,0.4-2.4,0L5,16.3 c-0.7-0.4-1.2-1.2-1.2-2.1v-5c0-0.8,0.4-1.6,1.2-2.1l4.3-2.5c0.7-0.4,1.6-0.4,2.4,0L16,7.2c0.7,0.4,1.2,1.2,1.2,2.1v3.3l3.8-2.2V7 c0-0.8-0.4-1.6-1.2-2.1l-8-4.7c-0.7-0.4-1.6-0.4-2.4,0L1.2,5C0.4,5.4,0,6.2,0,7v9.4c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7 c0.7,0.4,1.6,0.4,2.4,0l5.5-3.2l3.8-2.2l5.5-3.2c0.7-0.4,1.6-0.4,2.4,0l4.3,2.5c0.7,0.4,1.2,1.2,1.2,2.1v5c0,0.8-0.4,1.6-1.2,2.1 L29,28.8c-0.7,0.4-1.6,0.4-2.4,0l-4.3-2.5c-0.7-0.4-1.2-1.2-1.2-2.1V21l-3.8,2.2v3.3c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7 c0.7,0.4,1.6,0.4,2.4,0l8.1-4.7c0.7-0.4,1.2-1.2,1.2-2.1V17c0-0.8-0.4-1.6-1.2-2.1L29,10.2z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                              MATIC
                            </div>
                            <div className="row-start-2 pr-8 text-end text-sm">
                              Balance: {Number(showBalance)}{" "}
                            </div>
                          </div>
                          {console.log(getSwapStatus)}
                          <form onSubmit={handleFormSubmit}>
                            <button
                              disabled={!getSwapStatus}
                              type="submit"
                              className="lg:text-md text-md my-3 mr-2 w-full rounded-2xl border border-solid border-slate-500/20 bg-teal-900/20 py-4 px-5 font-bold text-slate-50 shadow-2xl hover:bg-teal-500/20 "
                            >
                              Swap
                            </button>
                          </form>
                          <div>
                            <p className="grid pt-5 font-mono text-sm font-thin text-slate-400 ">
                              <span className="text-left   ">
                                <div className=" inline-flex  items-center  justify-center    ">
                                  {" "}
                                  Reward Pool Liquidity:{" "}
                                  {Number(resultPoolBalance)}{" "}
                                  <svg
                                    className="mr-1 ml-2 h-3 w-3"
                                    fill="#8247E5"
                                    viewBox="0 0 38 33"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M29,10.2c-0.7-0.4-1.6-0.4-2.4,0L21,13.5l-3.8,2.1l-5.5,3.3c-0.7,0.4-1.6,0.4-2.4,0L5,16.3 c-0.7-0.4-1.2-1.2-1.2-2.1v-5c0-0.8,0.4-1.6,1.2-2.1l4.3-2.5c0.7-0.4,1.6-0.4,2.4,0L16,7.2c0.7,0.4,1.2,1.2,1.2,2.1v3.3l3.8-2.2V7 c0-0.8-0.4-1.6-1.2-2.1l-8-4.7c-0.7-0.4-1.6-0.4-2.4,0L1.2,5C0.4,5.4,0,6.2,0,7v9.4c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7 c0.7,0.4,1.6,0.4,2.4,0l5.5-3.2l3.8-2.2l5.5-3.2c0.7-0.4,1.6-0.4,2.4,0l4.3,2.5c0.7,0.4,1.2,1.2,1.2,2.1v5c0,0.8-0.4,1.6-1.2,2.1 L29,28.8c-0.7,0.4-1.6,0.4-2.4,0l-4.3-2.5c-0.7-0.4-1.2-1.2-1.2-2.1V21l-3.8,2.2v3.3c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7 c0.7,0.4,1.6,0.4,2.4,0l8.1-4.7c0.7-0.4,1.2-1.2,1.2-2.1V17c0-0.8-0.4-1.6-1.2-2.1L29,10.2z"
                                      clipRule="evenodd"
                                    ></path>
                                  </svg>
                                  MATIC
                                </div>
                              </span>
                            </p>
                            <p className="grid pt-5 font-mono text-sm font-thin text-slate-400 ">
                              <span
                                className={`text-left ${
                                  getSwapStatus
                                    ? "text-green-700"
                                    : "text-rose-600/60"
                                }`}
                              >
                                {" "}
                                Swap Status: {getSwapStatus
                                  ? "Open"
                                  : "Closed"}{" "}
                              </span>
                            </p>
                            <span className="absolute right-0 top-7 z-[-1]">
                              <svg
                                width="77"
                                height="172"
                                viewBox="0 0 77 172"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <circle
                                  cx="86"
                                  cy="86"
                                  r="86"
                                  fill="url(#paint0_linear)"
                                />
                                <defs>
                                  <linearGradient
                                    id="paint0_linear"
                                    x1="86"
                                    y1="0"
                                    x2="86"
                                    y2="172"
                                    gradientUnits="userSpaceOnUse"
                                  >
                                    <stop
                                      stop-color="#3056D3"
                                      stop-opacity="0.09"
                                    />
                                    <stop
                                      offset="1"
                                      stop-color="#C4C4C4"
                                      stop-opacity="0"
                                    />
                                  </linearGradient>
                                </defs>
                              </svg>
                            </span>
                          </div>
                        </>
                      );
                    } else {
                      return (
                        <>
                          <p className="grid  text-2xl text-amber-300 ">
                            <span className="mb-3 animate-pulse  text-left text-xl font-bold ">
                              {" "}
                              Swap Page: Please Connect Your Wallet
                            </span>
                            <span className="mb-3 text-left text-xl font-bold ">
                              {" "}
                            </span>
                          </p>
                          <p className="mb-1 grid text-sm  text-slate-400 ">
                            <span className="text-left "> From</span>
                          </p>
                          <div className="from-bgc/50 grid  grid-cols-2 grid-rows-2 gap-1 rounded-lg border border-solid border-slate-500/20 bg-gradient-to-b shadow-2xl">
                            <div className="col-span-2 ">
                              {" "}
                              <input
                                type="number"
                                placeholder="0"
                                value={input1}
                                onChange={handleInputChange1}
                                className="block  w-full rounded-md border-0 bg-[#212537]/10 py-1 text-left text-xl placeholder-slate-400 focus:outline-none"
                              />
                            </div>
                            <div className="row-start-2 mx-3 text-start  text-sm">
                              Credit
                            </div>
                            <div className="row-start-2 text-end text-sm ">
                              Balance: {Number(showCredit)}{" "}
                              <button
                                className="  border-0 bg-transparent p-0 hover:bg-transparent focus:ring-0 "
                                type="text"
                                onClick={() => setInput1(Number(showCredit))}
                              >
                                <span className=" mx-1 mr-2 rounded-lg bg-teal-900 px-2 py-1 text-xs font-medium  text-slate-200 ">
                                  Max
                                </span>{" "}
                              </button>
                            </div>
                          </div>
                          <button
                            type="button"
                            className=" my-2  inline-flex items-center p-1 text-center text-xs"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              className="h-6 w-6"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                              />
                            </svg>
                          </button>
                          <p className="grid text-sm  text-slate-400 ">
                            <span className="text-left "> To</span>
                          </p>
                          <div className="from-bgc/50 grid  grid-cols-2 grid-rows-2 gap-1 rounded-lg border border-solid border-slate-500/20  bg-gradient-to-b shadow-2xl">
                            <div className="col-span-2">
                              <input
                                disabled
                                type="number"
                                placeholder="0"
                                value={input1 * getCost1 * 0.5}
                                onChange={handleInputChange2}
                                className="block  w-full rounded-md border-0 bg-[#212537]/10 py-1 text-left text-xl placeholder-slate-400 focus:outline-none"
                              />
                            </div>

                            <div className=" row-start-2  mx-1 inline-flex items-center text-start  text-sm   ">
                              <svg
                                className="mr-1 ml-2 h-3 w-3"
                                fill="#8247E5"
                                viewBox="0 0 38 33"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M29,10.2c-0.7-0.4-1.6-0.4-2.4,0L21,13.5l-3.8,2.1l-5.5,3.3c-0.7,0.4-1.6,0.4-2.4,0L5,16.3 c-0.7-0.4-1.2-1.2-1.2-2.1v-5c0-0.8,0.4-1.6,1.2-2.1l4.3-2.5c0.7-0.4,1.6-0.4,2.4,0L16,7.2c0.7,0.4,1.2,1.2,1.2,2.1v3.3l3.8-2.2V7 c0-0.8-0.4-1.6-1.2-2.1l-8-4.7c-0.7-0.4-1.6-0.4-2.4,0L1.2,5C0.4,5.4,0,6.2,0,7v9.4c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7 c0.7,0.4,1.6,0.4,2.4,0l5.5-3.2l3.8-2.2l5.5-3.2c0.7-0.4,1.6-0.4,2.4,0l4.3,2.5c0.7,0.4,1.2,1.2,1.2,2.1v5c0,0.8-0.4,1.6-1.2,2.1 L29,28.8c-0.7,0.4-1.6,0.4-2.4,0l-4.3-2.5c-0.7-0.4-1.2-1.2-1.2-2.1V21l-3.8,2.2v3.3c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7 c0.7,0.4,1.6,0.4,2.4,0l8.1-4.7c0.7-0.4,1.2-1.2,1.2-2.1V17c0-0.8-0.4-1.6-1.2-2.1L29,10.2z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                              MATIC
                            </div>
                            <div className="row-start-2 pr-8 text-end text-sm">
                              Balance: {Number(showBalance)}{" "}
                            </div>
                          </div>
                          <form onSubmit={handleFormSubmit}>
                            <button
                              disabled
                              type="submit"
                              className="lg:text-md text-md my-3 mr-2 w-full rounded-2xl border border-solid border-slate-500/20 bg-teal-900/20 py-4 px-5 font-bold text-slate-50 shadow-2xl"
                            >
                              Swap
                            </button>
                          </form>
                          <div>
                            <span className="absolute right-0 top-7 z-[-1]">
                              <svg
                                width="77"
                                height="172"
                                viewBox="0 0 77 172"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <circle
                                  cx="86"
                                  cy="86"
                                  r="86"
                                  fill="url(#paint0_linear)"
                                />
                                <defs>
                                  <linearGradient
                                    id="paint0_linear"
                                    x1="86"
                                    y1="0"
                                    x2="86"
                                    y2="172"
                                    gradientUnits="userSpaceOnUse"
                                  >
                                    <stop
                                      stop-color="#3056D3"
                                      stop-opacity="0.09"
                                    />
                                    <stop
                                      offset="1"
                                      stop-color="#C4C4C4"
                                      stop-opacity="0"
                                    />
                                  </linearGradient>
                                </defs>
                              </svg>
                            </span>
                          </div>
                        </>
                      );
                    }
                  })()}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="container mx-auto">
        <>
          {showModal ? (
            <>
              <div>
                <div
                  className="fixed bottom-5 right-5 z-50  max-w-sm rounded-md  bg-teal-900/40 text-sm font-bold text-white shadow-lg "
                  role="alert"
                >
                  <div className="flex p-4">
                    <div className="flex-shrink-0">
                      <svg
                        className="mt-0.5 mr-2 h-4 w-4 text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                      </svg>
                    </div>
                    Congratulations! You Swapped {input1} Credits!
                    <div className="ml-auto">
                      <button
                        onClick={() => setShowModal(false)}
                        type="button"
                        className="inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-md text-sm text-white/[.9] transition-all hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-gray-800 "
                      >
                        <span className="sr-only">Close</span>
                        <svg
                          className="h-3.5 w-3.5"
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
            <>
              <div>
                <div
                  className="fixed bottom-5 right-5 z-50  max-w-sm rounded-md  bg-rose-900/40 text-sm font-bold text-rose-200 shadow-lg "
                  role="alert"
                >
                  <div className="flex p-4">
                    <svg
                      className="mt-0.5 mr-1 h-5 w-5 text-rose-500"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
                    </svg>{" "}
                    Insufficient MATIC of the Reward Pool. Please Decrease the
                    Quantitiy.{" "}
                    <div className="ml-auto">
                      <button
                        onClick={() => setShowModal2(false)}
                        type="button"
                        className="ml-2 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-md text-sm text-white/[.9] transition-all hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-gray-800 "
                      >
                        <span className="sr-only">Close</span>
                        <svg
                          className="h-3.5 w-3.5"
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

          {showModal3 ? (
            <>
              <div>
                <div
                  className="fixed bottom-5 right-5 z-50  max-w-sm rounded-md  bg-rose-900/40 text-sm font-bold text-rose-200 shadow-lg "
                  role="alert"
                >
                  <div className="flex p-4">
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
                    Insufficient Credits for Swap
                    <div className="ml-auto">
                      <button
                        onClick={() => setShowModal3(false)}
                        type="button"
                        className="ml-2 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-md text-sm text-white/[.9] transition-all hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-gray-800 "
                      >
                        <span className="sr-only">Close</span>
                        <svg
                          className="h-3.5 w-3.5"
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
      </div>
      {showModal ? <div></div> : <div></div>}
    </>
  );
};

export default Swap;
