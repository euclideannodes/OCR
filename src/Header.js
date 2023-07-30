import { useParams } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import { Base64 } from "js-base64";
import * as s from "./styles/globalStyles";
import { styled } from "@mui/material/styles";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import BoltIcon from "@mui/icons-material/Bolt";
import MenuIcon from "@mui/icons-material/Menu";
import { makeStyles } from "@mui/styles";
import ButtonGroup from "@mui/material/ButtonGroup";
import { Fragment } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const truncate = (input) => {
  const first5 = input.substring(0, 5);
  const last4 = input.substring(input.length - 4);
  return input ? `${first5}...${last4}` : input;
};

const Header = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [buyCredit, setBuyCredit] = useState(false);
  const [xNft, setxNft] = useState(false);
  let [showCredit, setShowCredit] = useState(null);
  let [showBalance, setShowBalance] = useState(null);
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
  let getTotalTicketCount = data.getTotalTicketCount;

  let getCredit = data.getCredit;
  let totalSupply = data.totalSupply;
  let getDataByMap = data.getDataByMap;
  let getWinAdd = data.getWinAdd;

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
    }
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
    if (blockchain && blockchain.account !== null) {
      blockchain.smartContract.methods
        .totalSupply()
        .call()
        .then((result) => {
          setSupply(result);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [blockchain.account, blockchain.smartContract]);
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
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);
  useEffect(() => {
    dispatch(fetchData(id));
  }, [id, dispatch]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <>
      <header>
        <nav className=" border-b border-solid border-teal-600/20   px-4  py-2.5 hover:shadow-slate-500  lg:px-6 ">
          <div className="max-w-screen-3xl mx-auto flex flex-wrap items-center justify-between">
            <div className="relative  inline-flex items-center self-center whitespace-nowrap  rounded-lg p-2 text-center text-xs font-semibold text-teal-600  duration-300 hover:scale-105 lg:text-xl">
              OnChain Races
              <span className="sr-only">Notifications</span>
              <div className="absolute -top-2 -right-2 inline-flex h-8 w-8 items-center justify-center   rounded text-xs font-bold ">
                Beta
              </div>
            </div>
            <div className="flex items-center lg:order-2">
              <div className="hidden w-full items-center justify-between lg:order-1 lg:flex lg:w-auto">
                <ul className="mt-4 flex flex-col font-medium lg:mt-0 lg:flex-row lg:space-x-8">
                  <div
                    className="block border-b border-gray-100 py-2 pr-4 pl-3 text-slate-300 hover:bg-gray-50 lg:border-0 lg:p-0 lg:hover:bg-transparent lg:hover:text-teal-600"
                    aria-current="page"
                  >
                    Season #1: {Number(getSupply)}/{String(250)}
                  </div>
                </ul>
              </div>
              <div className="flex md:order-2">
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <Container ai={"center"} jc={"center"}>
                    <button
                      className=" lg:text-md mr-2 rounded-lg  py-2.5 px-5 text-xs text-slate-50 shadow shadow-teal-500/50 "
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      CONNECT
                    </button>

                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </Container>
                ) : (
                  <>
                    <s.SpacerSmall />
                    <Menu as="div" className="relative inline-block text-left ">
                      <div>
                        <Menu.Button className="mr-2 mb-2 inline-flex w-full items-center justify-center gap-x-1.5  rounded-lg py-2.5 px-5 text-xs  text-slate-50 shadow shadow-teal-500/50 lg:text-sm">
                          {claimingNft
                            ? "  " + truncate(blockchain.account, 10)
                            : "  " + truncate(blockchain.account, 10)}
                          <ChevronDownIcon
                            className="-mr-1 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </Menu.Button>
                      </div>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="bg-bgc absolute right-0 z-40 mt-2 w-56 origin-top-right  rounded-lg shadow shadow-teal-500/50">
                          <div className="rounded-lg py-1 shadow shadow-teal-500/50">
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="#"
                                  className={classNames(
                                    active
                                      ? "bg-teal-900/60 text-slate-50"
                                      : "text-slate-50",
                                    "block px-4 py-2 text-sm",
                                  )}
                                >
                                  TOTAL CREDITS: {Number(showCredit)}
                                </a>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="#"
                                  className={classNames(
                                    active
                                      ? "bg-teal-900/60 text-slate-50"
                                      : "text-slate-50",
                                    "block px-4 py-2 text-sm",
                                  )}
                                >
                                  TOTAL BALANCE: {Number(showBalance)}
                                </a>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <Link to={`/Address/${blockchain.account}`}>
                                  <a
                                    className={classNames(
                                      active
                                        ? "bg-teal-900/60  text-slate-50"
                                        : "text-slate-50",
                                      "block px-4 py-2 text-sm",
                                    )}
                                  >
                                    PROFILE
                                  </a>
                                </Link>
                              )}
                            </Menu.Item>

                            <form>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    type="submit"
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-slate-50",
                                      "block w-full px-4 py-2 text-left text-sm uppercase",
                                    )}
                                  >
                                    Disconnect
                                  </button>
                                )}
                              </Menu.Item>
                            </form>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </>
                )}
              </div>
              <button
                data-collapse-toggle="mobile-menu-2"
                type="button"
                className="ml-1 inline-flex items-center rounded-lg p-2 text-sm text-gray-200 hover:bg-teal-700/40 focus:outline-none focus:ring-1 focus:ring-gray-200 lg:hidden"
                aria-controls="mobile-menu-2"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <svg
                  className="hidden h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
            <div
              className="hidden w-full items-center justify-between lg:order-1 lg:flex lg:w-auto"
              id="mobile-menu-2"
            >
              <ul className="mt-4 flex flex-col font-medium lg:mt-0 lg:flex-row lg:space-x-8">
                <li>
                  <Link to={`/`}>
                    <a
                      href=""
                      className="block rounded bg-teal-700 py-2 pr-4 pl-3 text-slate-200 lg:bg-transparent lg:p-0 lg:text-slate-200 "
                      aria-current="page"
                    >
                      Home
                    </a>
                  </Link>
                </li>
                <li>
                  <Link to={`/Race/${Number(getSupply)}`}>
                    <a
                      href=""
                      className="block border-b border-gray-100 py-2 pr-4 pl-3 text-slate-300 hover:bg-gray-50 lg:border-0 lg:p-0 lg:hover:bg-transparent lg:hover:text-teal-600"
                      aria-current="page"
                    >
                      Race
                    </a>
                  </Link>
                </li>
                <li>
                  <Link to={`/Credit`}>
                    <a
                      href=""
                      className="block border-b border-gray-100 py-2 pr-4 pl-3 text-slate-300 hover:bg-gray-50 lg:border-0 lg:p-0 lg:hover:bg-transparent lg:hover:text-teal-600"
                      aria-current="page"
                    >
                      Credit
                    </a>
                  </Link>
                </li>
                <li>
                  <Link to={`/Swap`}>
                    <a
                      href=""
                      className="block border-b border-gray-100 py-2 pr-4 pl-3 text-slate-300 hover:bg-gray-50 lg:border-0 lg:p-0 lg:hover:bg-transparent lg:hover:text-teal-600"
                      aria-current="page"
                    >
                      Swap
                    </a>
                  </Link>
                </li>
                <li>
                  <Link to={`/Stats`}>
                    <a
                      href=""
                      className="block border-b border-gray-100 py-2 pr-4 pl-3 text-slate-300 hover:bg-gray-50 lg:border-0 lg:p-0 lg:hover:bg-transparent lg:hover:text-teal-600"
                      aria-current="page"
                    >
                      Stats
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <div className="from-bgc to-bgc animate-pulse bg-gradient-to-r via-rose-900/30 text-center leading-normal tracking-normal hs-removing:-translate-y-full">
        <div className="mx-auto max-w-full px-4 py-2 text-justify text-xs   text-white  antialiased sm:px-6 lg:px-8 lg:text-center lg:text-lg">
          <div className="">
            <span>
               OnChain Races Public Beta is LIVE on{" "}
              <div className="   inline-flex items-center   ">
                <svg
                  className=" mr-2 h-4 w-4"
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
              </div>
              Polygon Mumbai Testnet. Please Test the Web App and Game. We Want
              Your Feedback via{" "}
              <a
                className="text-sky-400/60 underline"
                href="https://twitter.com/OnChainRace/"
                rel="noreferrer"
                target="_blank"
              >
                {" "}
                Twitter DM
              </a>
              . You will be Rewarded.
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
