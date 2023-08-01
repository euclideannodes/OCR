import { useParams } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";

import Web3 from "web3";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const truncate = (input) => {
  const first5 = input.substring(0, 5);
  const last4 = input.substring(input.length - 4);
  return input ? `${first5}...${last4}` : input;
};

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [buyCredit, setBuyCredit] = useState(false);
  const [mintAmount, setMintAmount] = useState(1);
  const [creditAmount, setCreditAmount] = useState(10);
  const [getCost1, setCost1] = useState(null);
  const [getCostWei1, setCostWei1] = useState(null);
  const [getCostWei2, setCostWei2] = useState(null);
  const [getCost2, setCost2] = useState(null);
  const [shouldRefreshCredit, setShouldRefreshCredit] = useState(false);
  const [shouldRefreshBalance, setShouldRefreshBalance] = useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [showModal2, setShowModal2] = React.useState(false);
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

  let getCredit = data.getCredit;
  let getBalance = data.getBalance / 1000000000000000000;
  getBalance = getBalance.toFixed(2);
  let [showCredit, setShowCredit] = useState(null);
  let [showBalance, setShowBalance] = useState(null);

  useEffect(() => {
    if (blockchain.account !== null) {
      blockchain.smartContract.methods
        .cost_1()
        .call()
        .then((result) => {
          setCostWei1(Number(result));
          const getCost1 = Web3.utils.fromWei(result, "ether");
          setCost1(Number(getCost1));
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [blockchain.account, getCost1]);

  useEffect(() => {
    if (blockchain.account !== null) {
      blockchain.smartContract.methods
        .cost_2()
        .call()
        .then((result) => {
          setCostWei2(Number(result));
          const getCost2 = Web3.utils.fromWei(result, "ether");
          setCost2(Number(getCost2));
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [blockchain.account, getCost2]);

  const buyCredits = () => {
    let cost2 = getCostWei2;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost2 * creditAmount);
    let totalGasLimit = String(gasLimit * creditAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setBuyCredit(true);
    blockchain.smartContract.methods
      .buyCredit(creditAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("transactionHash", (hash) => {
        setShowModal2(true);
      })
      .once("error", (err) => {
        console.log(err);
        setBuyCredit(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setShowModal2(false);
        setShowModal(true);
        setBuyCredit(false);
        setShouldRefreshCredit(true);
        setShouldRefreshBalance(true);
        dispatch(fetchData(blockchain.account));
      });
  };
  const buyCredit1 = () => {
    let cost1 = getCostWei1;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost1 * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setBuyCredit(true);
    blockchain.smartContract.methods
      .buyCredit(1)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setBuyCredit(false);
      })
      .once("transactionHash", (hash) => {
        setShowModal2(true);
      })
      .then((receipt) => {
        console.log(receipt);
        setShowModal2(false);
        setShouldRefreshCredit(true);
        setShouldRefreshBalance(true);
        setShowModal(true);
        setBuyCredit(false);
        dispatch(fetchData(blockchain.account));
      });
  };
  const buyCredits2 = () => {
    let cost2 = getCostWei2;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost2 * creditAmount);
    let totalGasLimit = String(gasLimit * creditAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);

    blockchain.smartContract.methods
      .buyCredit(5)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setBuyCredit(false);
      })
      .once("transactionHash", (hash) => {
        setShowModal2(true);
      })
      .then((receipt) => {
        console.log(receipt);
        setShowModal2(false);
        setShouldRefreshCredit(true);
        setShouldRefreshBalance(true);
        setShowModal(true);
        setBuyCredit(false);
        dispatch(fetchData(blockchain.account));
      });
  };
  const decrementCreditAmount = () => {
    let newCreditAmount = creditAmount - 1;
    if (newCreditAmount < 10) {
      newCreditAmount = 10;
    }
    setCreditAmount(newCreditAmount);
  };

  const incrementCreditAmount = () => {
    let newCreditAmount = creditAmount + 1;
    if (newCreditAmount > 50) {
      newCreditAmount = 50;
    }
    setCreditAmount(newCreditAmount);
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
    getConfig();
  }, []);

  useEffect(() => {
    dispatch(fetchData(id));
  }, [id, dispatch]);

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const navigation = [
    { name: "Product", href: "#" },
    { name: "Features", href: "#" },
    { name: "Marketplace", href: "#" },
    { name: "Company", href: "#" },
  ];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
  }, [blockchain.account, showCredit, shouldRefreshCredit]);

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
  }, [blockchain.account, showBalance, shouldRefreshBalance]);

  return (
    <>
      <div className="container my-6 mx-auto ">
        <section className="relative z-20 overflow-hidden bg-transparent">
          <div className="container">
            <div className="-mx-4 flex flex-wrap">
              <div className="w-full px-10">
                <div className="mx-auto   mb-[60px] max-w-md  text-center">
                  <div className="shadow-xs relative mt-2 overflow-x-auto rounded-2xl border border-solid border-teal-500 border-opacity-20   p-3 shadow-teal-500 ">
                    {(() => {
                      if (blockchain.account !== null) {
                        return (
                          <>
                            <p className=" text-xl text-slate-300">
                              Balance: {Number(showBalance)}
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
                                </svg>{" "}
                                MATIC
                              </div>
                            </p>
                            <p className=" text-xl text-slate-300">
                              <span className=" ">
                                {" "}
                                Credits: {Number(showCredit)}{" "}
                              </span>
                            </p>
                          </>
                        );
                      } else {
                        return (
                          <>
                            {" "}
                            <div className=" row-start-2 inline-flex animate-pulse items-center    ">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="h-5 w-5  text-amber-300"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                                />
                              </svg>
                              <p className="text-md  grid text-center text-amber-300 lg:text-xl ">
                                <span className=" ml-2   text-center font-bold ">
                                  {" "}
                                  Please Connect Your Wallet
                                </span>
                              </p>
                            </div>
                          </>
                        );
                      }
                    })()}
                  </div>
                </div>
              </div>
            </div>
            <div className="-mx-4  flex flex-wrap justify-center ">
              <div className="lg: mx-2 w-full px-10 duration-300 hover:scale-105 md:w-1/2 lg:w-1/4 lg:px-1">
                <div
                  className="
               shadow-xs
               hover:  relative z-10 
               mb-10 overflow-hidden
               rounded-xl
               border
               border-solid
               border-teal-500
               border-opacity-20
               bg-transparent
               py-10 px-8
               text-center
               text-slate-300
               shadow-teal-500
               hover:shadow-sm
               sm:p-12
               lg:py-10     
               lg:px-6 xl:p-12"
                >
                  <span className="text-primary mb-4 block  text-sm font-semibold lg:text-lg">
                    Single Credit
                  </span>
                  <h2 className="text-dark mb-6 text-[25px] font-bold lg:text-[38px]">
                    {(() => {
                      if (blockchain.account !== null) {
                        return <>{getCost1}</>;
                      } else {
                        return <>{getCost1}</>;
                      }
                    })()}

                    <span className="text-body-color text-base font-medium">
                      / MATIC
                    </span>
                  </h2>
                  {(() => {
                    if (blockchain.account !== null) {
                      return (
                        <>
                          <button
                            onClick={(e) => {
                              console.log(creditAmount);
                              e.preventDefault();
                              buyCredit1();
                            }}
                            className="
                  rounded-lg
                  p-2 pl-5
                  pr-5
                  text-center
                  text-slate-300
                  shadow
                  shadow-teal-500/50 transition  hover:text-teal-700 hover:shadow-teal-500
                  focus:ring-teal-700
                  "
                          >
                            {buyCredit ? (
                              <div
                                className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                role="status"
                              ></div>
                            ) : (
                              "Buy"
                            )}
                          </button>
                        </>
                      );
                    } else {
                      return <> </>;
                    }
                  })()}

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
                            <stop stopColor="#0d9891" stopOpacity="0.09" />
                            <stop
                              offset="1"
                              stopColor="#C4C4C4"
                              stopOpacity="0"
                            />
                          </linearGradient>
                        </defs>
                      </svg>
                    </span>
                    <span className="absolute right-4 top-4 z-[-1]">
                      <svg
                        width="41"
                        height="89"
                        viewBox="0 0 41 89"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="38.9138"
                          cy="87.4849"
                          r="1.42021"
                          transform="rotate(180 38.9138 87.4849)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="38.9138"
                          cy="74.9871"
                          r="1.42021"
                          transform="rotate(180 38.9138 74.9871)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="38.9138"
                          cy="62.4892"
                          r="1.42021"
                          transform="rotate(180 38.9138 62.4892)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="38.9138"
                          cy="38.3457"
                          r="1.42021"
                          transform="rotate(180 38.9138 38.3457)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="38.9138"
                          cy="13.634"
                          r="1.42021"
                          transform="rotate(180 38.9138 13.634)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="38.9138"
                          cy="50.2754"
                          r="1.42021"
                          transform="rotate(180 38.9138 50.2754)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="38.9138"
                          cy="26.1319"
                          r="1.42021"
                          transform="rotate(180 38.9138 26.1319)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="38.9138"
                          cy="1.42021"
                          r="1.42021"
                          transform="rotate(180 38.9138 1.42021)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="26.4157"
                          cy="87.4849"
                          r="1.42021"
                          transform="rotate(180 26.4157 87.4849)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="26.4157"
                          cy="74.9871"
                          r="1.42021"
                          transform="rotate(180 26.4157 74.9871)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="26.4157"
                          cy="62.4892"
                          r="1.42021"
                          transform="rotate(180 26.4157 62.4892)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="26.4157"
                          cy="38.3457"
                          r="1.42021"
                          transform="rotate(180 26.4157 38.3457)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="26.4157"
                          cy="13.634"
                          r="1.42021"
                          transform="rotate(180 26.4157 13.634)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="26.4157"
                          cy="50.2754"
                          r="1.42021"
                          transform="rotate(180 26.4157 50.2754)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="26.4157"
                          cy="26.1319"
                          r="1.42021"
                          transform="rotate(180 26.4157 26.1319)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="26.4157"
                          cy="1.4202"
                          r="1.42021"
                          transform="rotate(180 26.4157 1.4202)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="13.9177"
                          cy="87.4849"
                          r="1.42021"
                          transform="rotate(180 13.9177 87.4849)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="13.9177"
                          cy="74.9871"
                          r="1.42021"
                          transform="rotate(180 13.9177 74.9871)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="13.9177"
                          cy="62.4892"
                          r="1.42021"
                          transform="rotate(180 13.9177 62.4892)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="13.9177"
                          cy="38.3457"
                          r="1.42021"
                          transform="rotate(180 13.9177 38.3457)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="13.9177"
                          cy="13.634"
                          r="1.42021"
                          transform="rotate(180 13.9177 13.634)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="13.9177"
                          cy="50.2754"
                          r="1.42021"
                          transform="rotate(180 13.9177 50.2754)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="13.9177"
                          cy="26.1319"
                          r="1.42021"
                          transform="rotate(180 13.9177 26.1319)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="13.9177"
                          cy="1.42019"
                          r="1.42021"
                          transform="rotate(180 13.9177 1.42019)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="1.41963"
                          cy="87.4849"
                          r="1.42021"
                          transform="rotate(180 1.41963 87.4849)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="1.41963"
                          cy="74.9871"
                          r="1.42021"
                          transform="rotate(180 1.41963 74.9871)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="1.41963"
                          cy="62.4892"
                          r="1.42021"
                          transform="rotate(180 1.41963 62.4892)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="1.41963"
                          cy="38.3457"
                          r="1.42021"
                          transform="rotate(180 1.41963 38.3457)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="1.41963"
                          cy="13.634"
                          r="1.42021"
                          transform="rotate(180 1.41963 13.634)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="1.41963"
                          cy="50.2754"
                          r="1.42021"
                          transform="rotate(180 1.41963 50.2754)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="1.41963"
                          cy="26.1319"
                          r="1.42021"
                          transform="rotate(180 1.41963 26.1319)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="1.41963"
                          cy="1.4202"
                          r="1.42021"
                          transform="rotate(180 1.41963 1.4202)"
                          fill="#0d9891"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full px-10 duration-300 hover:scale-105 md:w-1/2 lg:w-1/3 lg:px-2">
                <div
                  className="
               relative
               z-10
               mb-10 overflow-hidden rounded-xl border 
               border-solid border-teal-500
               border-opacity-20
               bg-transparent
               py-10
               px-8
               
               text-center
               text-slate-300
               shadow-md shadow-teal-500
               sm:p-12
               lg:py-10
               lg:px-6
               xl:p-12 
               "
                >
                  <h2 className="text-dark  mb-5 text-sm   font-bold lg:text-lg ">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        decrementCreditAmount();
                      }}
                      className="
                  mx-3
                  rounded-xl
                  pl-2
                  pr-2 text-lg
            
                  font-semibold
                  text-slate-300
                  shadow
                  shadow-teal-500/50
                  transition hover:text-teal-700  
                  hover:shadow-teal-500
                  "
                    >
                      -
                    </button>
                    {creditAmount} Credits
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        incrementCreditAmount();
                      }}
                      className="
                  text-s
                  mx-3
                  rounded-xl
                  pl-2 pr-2
                  font-semibold
                  text-slate-300
                  shadow
                  shadow-teal-500/50
                  transition hover:text-teal-700  
                  hover:shadow-teal-500
                  "
                    >
                      +
                    </button>
                  </h2>
                  <h2 className="text-dark mb-6 text-[25px] font-bold lg:text-[38px]">
                    {(() => {
                      if (blockchain.account !== null) {
                        return <>{(creditAmount * getCost2).toFixed(2)}</>;
                      } else {
                        return <></>;
                      }
                    })()}

                    <span className="text-body-color text-base font-medium">
                      / MATIC
                    </span>
                  </h2>
                  {(() => {
                    if (blockchain.account !== null) {
                      return (
                        <>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              buyCredits();
                            }}
                            className="
                  rounded-lg
                  p-2
                  pl-5 pr-5
                  text-center
                  text-slate-300
                  shadow
                  shadow-teal-500/50
                  transition hover:text-teal-700  hover:shadow-teal-500 
                  focus:ring-teal-700
                  "
                          >
                            {buyCredit ? (
                              <div
                                className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] "
                                role="status"
                              ></div>
                            ) : (
                              "Buy"
                            )}
                          </button>
                        </>
                      );
                    } else {
                      return <> </>;
                    }
                  })()}

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
                            <stop stopColor="#0d9891" stopOpacity="0.09" />
                            <stop
                              offset="1"
                              stopColor="#C4C4C4"
                              stopOpacity="0"
                            />
                          </linearGradient>
                        </defs>
                      </svg>
                    </span>
                    <span className="absolute right-4 top-4 z-[-1]">
                      <svg
                        width="41"
                        height="89"
                        viewBox="0 0 41 89"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="38.9138"
                          cy="87.4849"
                          r="1.42021"
                          transform="rotate(180 38.9138 87.4849)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="38.9138"
                          cy="74.9871"
                          r="1.42021"
                          transform="rotate(180 38.9138 74.9871)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="38.9138"
                          cy="62.4892"
                          r="1.42021"
                          transform="rotate(180 38.9138 62.4892)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="38.9138"
                          cy="38.3457"
                          r="1.42021"
                          transform="rotate(180 38.9138 38.3457)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="38.9138"
                          cy="13.634"
                          r="1.42021"
                          transform="rotate(180 38.9138 13.634)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="38.9138"
                          cy="50.2754"
                          r="1.42021"
                          transform="rotate(180 38.9138 50.2754)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="38.9138"
                          cy="26.1319"
                          r="1.42021"
                          transform="rotate(180 38.9138 26.1319)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="38.9138"
                          cy="1.42021"
                          r="1.42021"
                          transform="rotate(180 38.9138 1.42021)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="26.4157"
                          cy="87.4849"
                          r="1.42021"
                          transform="rotate(180 26.4157 87.4849)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="26.4157"
                          cy="74.9871"
                          r="1.42021"
                          transform="rotate(180 26.4157 74.9871)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="26.4157"
                          cy="62.4892"
                          r="1.42021"
                          transform="rotate(180 26.4157 62.4892)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="26.4157"
                          cy="38.3457"
                          r="1.42021"
                          transform="rotate(180 26.4157 38.3457)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="26.4157"
                          cy="13.634"
                          r="1.42021"
                          transform="rotate(180 26.4157 13.634)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="26.4157"
                          cy="50.2754"
                          r="1.42021"
                          transform="rotate(180 26.4157 50.2754)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="26.4157"
                          cy="26.1319"
                          r="1.42021"
                          transform="rotate(180 26.4157 26.1319)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="26.4157"
                          cy="1.4202"
                          r="1.42021"
                          transform="rotate(180 26.4157 1.4202)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="13.9177"
                          cy="87.4849"
                          r="1.42021"
                          transform="rotate(180 13.9177 87.4849)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="13.9177"
                          cy="74.9871"
                          r="1.42021"
                          transform="rotate(180 13.9177 74.9871)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="13.9177"
                          cy="62.4892"
                          r="1.42021"
                          transform="rotate(180 13.9177 62.4892)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="13.9177"
                          cy="38.3457"
                          r="1.42021"
                          transform="rotate(180 13.9177 38.3457)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="13.9177"
                          cy="13.634"
                          r="1.42021"
                          transform="rotate(180 13.9177 13.634)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="13.9177"
                          cy="50.2754"
                          r="1.42021"
                          transform="rotate(180 13.9177 50.2754)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="13.9177"
                          cy="26.1319"
                          r="1.42021"
                          transform="rotate(180 13.9177 26.1319)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="13.9177"
                          cy="1.42019"
                          r="1.42021"
                          transform="rotate(180 13.9177 1.42019)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="1.41963"
                          cy="87.4849"
                          r="1.42021"
                          transform="rotate(180 1.41963 87.4849)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="1.41963"
                          cy="74.9871"
                          r="1.42021"
                          transform="rotate(180 1.41963 74.9871)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="1.41963"
                          cy="62.4892"
                          r="1.42021"
                          transform="rotate(180 1.41963 62.4892)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="1.41963"
                          cy="38.3457"
                          r="1.42021"
                          transform="rotate(180 1.41963 38.3457)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="1.41963"
                          cy="13.634"
                          r="1.42021"
                          transform="rotate(180 1.41963 13.634)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="1.41963"
                          cy="50.2754"
                          r="1.42021"
                          transform="rotate(180 1.41963 50.2754)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="1.41963"
                          cy="26.1319"
                          r="1.42021"
                          transform="rotate(180 1.41963 26.1319)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="1.41963"
                          cy="1.4202"
                          r="1.42021"
                          transform="rotate(180 1.41963 1.4202)"
                          fill="#0d9891"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
              <div className="mx-2 w-full px-10 duration-300 hover:scale-105 md:w-1/2 lg:w-1/4 lg:px-1">
                <div
                  className="
               shadow-xs
               hover: hover: relative z-10 
               mb-10 overflow-hidden
               rounded-xl
               border
               border-solid
               border-teal-500
               border-opacity-20
               bg-transparent
               py-10 px-8
               text-center
               text-slate-300
               shadow-teal-500 hover:shadow-sm
               sm:p-12
               lg:py-10
               lg:px-6
               xl:p-12 
               "
                >
                  <span className="text-primary mb-4 block text-sm font-semibold lg:text-lg">
                    5 Credits
                  </span>
                  <h2 className="text-dark mb-6 text-[25px] font-bold lg:text-[38px]">
                    {(() => {
                      if (blockchain.account !== null) {
                        return <> {getCost2 * 5}</>;
                      }
                    })()}

                    <span className="text-body-color text-base font-medium">
                      / MATIC
                    </span>
                  </h2>
                  {(() => {
                    if (blockchain.account !== null) {
                      return (
                        <>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              buyCredits2();
                            }}
                            className="
                  rounded-lg
                  p-2
                  pl-5 pr-5
                  text-center
                  text-slate-300
                  shadow
                  shadow-teal-500/50
                  transition hover:text-teal-700  hover:shadow-teal-500 
                  focus:ring-teal-700
                  "
                          >
                            {buyCredit ? (
                              <div
                                className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                role="status"
                              ></div>
                            ) : (
                              "Buy"
                            )}
                          </button>
                        </>
                      );
                    } else {
                      return <> </>;
                    }
                  })()}

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
                            <stop stopColor="#0d9891" stopOpacity="0.09" />
                            <stop
                              offset="1"
                              stopColor="#C4C4C4"
                              stopOpacity="0"
                            />
                          </linearGradient>
                        </defs>
                      </svg>
                    </span>
                    <span className="absolute right-4 top-4 z-[-1]">
                      <svg
                        width="41"
                        height="89"
                        viewBox="0 0 41 89"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="38.9138"
                          cy="87.4849"
                          r="1.42021"
                          transform="rotate(180 38.9138 87.4849)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="38.9138"
                          cy="74.9871"
                          r="1.42021"
                          transform="rotate(180 38.9138 74.9871)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="38.9138"
                          cy="62.4892"
                          r="1.42021"
                          transform="rotate(180 38.9138 62.4892)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="38.9138"
                          cy="38.3457"
                          r="1.42021"
                          transform="rotate(180 38.9138 38.3457)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="38.9138"
                          cy="13.634"
                          r="1.42021"
                          transform="rotate(180 38.9138 13.634)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="38.9138"
                          cy="50.2754"
                          r="1.42021"
                          transform="rotate(180 38.9138 50.2754)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="38.9138"
                          cy="26.1319"
                          r="1.42021"
                          transform="rotate(180 38.9138 26.1319)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="38.9138"
                          cy="1.42021"
                          r="1.42021"
                          transform="rotate(180 38.9138 1.42021)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="26.4157"
                          cy="87.4849"
                          r="1.42021"
                          transform="rotate(180 26.4157 87.4849)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="26.4157"
                          cy="74.9871"
                          r="1.42021"
                          transform="rotate(180 26.4157 74.9871)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="26.4157"
                          cy="62.4892"
                          r="1.42021"
                          transform="rotate(180 26.4157 62.4892)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="26.4157"
                          cy="38.3457"
                          r="1.42021"
                          transform="rotate(180 26.4157 38.3457)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="26.4157"
                          cy="13.634"
                          r="1.42021"
                          transform="rotate(180 26.4157 13.634)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="26.4157"
                          cy="50.2754"
                          r="1.42021"
                          transform="rotate(180 26.4157 50.2754)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="26.4157"
                          cy="26.1319"
                          r="1.42021"
                          transform="rotate(180 26.4157 26.1319)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="26.4157"
                          cy="1.4202"
                          r="1.42021"
                          transform="rotate(180 26.4157 1.4202)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="13.9177"
                          cy="87.4849"
                          r="1.42021"
                          transform="rotate(180 13.9177 87.4849)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="13.9177"
                          cy="74.9871"
                          r="1.42021"
                          transform="rotate(180 13.9177 74.9871)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="13.9177"
                          cy="62.4892"
                          r="1.42021"
                          transform="rotate(180 13.9177 62.4892)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="13.9177"
                          cy="38.3457"
                          r="1.42021"
                          transform="rotate(180 13.9177 38.3457)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="13.9177"
                          cy="13.634"
                          r="1.42021"
                          transform="rotate(180 13.9177 13.634)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="13.9177"
                          cy="50.2754"
                          r="1.42021"
                          transform="rotate(180 13.9177 50.2754)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="13.9177"
                          cy="26.1319"
                          r="1.42021"
                          transform="rotate(180 13.9177 26.1319)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="13.9177"
                          cy="1.42019"
                          r="1.42021"
                          transform="rotate(180 13.9177 1.42019)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="1.41963"
                          cy="87.4849"
                          r="1.42021"
                          transform="rotate(180 1.41963 87.4849)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="1.41963"
                          cy="74.9871"
                          r="1.42021"
                          transform="rotate(180 1.41963 74.9871)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="1.41963"
                          cy="62.4892"
                          r="1.42021"
                          transform="rotate(180 1.41963 62.4892)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="1.41963"
                          cy="38.3457"
                          r="1.42021"
                          transform="rotate(180 1.41963 38.3457)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="1.41963"
                          cy="13.634"
                          r="1.42021"
                          transform="rotate(180 1.41963 13.634)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="1.41963"
                          cy="50.2754"
                          r="1.42021"
                          transform="rotate(180 1.41963 50.2754)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="1.41963"
                          cy="26.1319"
                          r="1.42021"
                          transform="rotate(180 1.41963 26.1319)"
                          fill="#0d9891"
                        />
                        <circle
                          cx="1.41963"
                          cy="1.4202"
                          r="1.42021"
                          transform="rotate(180 1.41963 1.4202)"
                          fill="#0d9891"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {showModal ? (
        <>
          <div>
            <div
              class="fixed bottom-5 right-5 z-50  max-w-sm rounded-md  bg-teal-900/40 text-sm font-bold text-white shadow-lg "
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
                Credit purchase successful!
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
        <>
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
                Buying Credits...
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
        </>
      ) : null}
    </>
  );
};

export default Profile;
