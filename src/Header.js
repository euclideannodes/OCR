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
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

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
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [creditAmount, setCreditAmount] = useState(10);
  let [showCredit, setShowCredit] = useState(null);
  let [showBalance, setShowBalance] = useState(null);

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
        <nav class=" border-b border-solid border-teal-600/20 border-slate-500/30   px-4  py-2.5 hover:shadow-slate-500  lg:px-6 ">
          <div class="max-w-screen-3xl mx-auto flex flex-wrap items-center justify-between">
            <div className="relative  inline-flex items-center self-center whitespace-nowrap  rounded-lg p-2 text-center text-xs font-semibold text-teal-600  duration-300 hover:scale-105 lg:text-xl">
              OnChain Races
              <span className="sr-only">Notifications</span>
              <div className="absolute -top-2 -right-2 inline-flex h-8 w-8 items-center justify-center   rounded text-xs font-bold ">
                Beta
              </div>
            </div>
            <div class="flex items-center lg:order-2">
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
                        <Menu.Button className="mr-2 mb-2 inline-flex w-full justify-center gap-x-1.5 rounded-md rounded-lg py-2.5 px-5 text-xs  text-slate-50 shadow shadow-teal-500/50 lg:text-sm">
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
                        <Menu.Items className="bg-bgc absolute right-0 z-40 mt-2 w-56 origin-top-right rounded-md  rounded-lg shadow shadow-teal-500/50">
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
                            <div className="block md:hidden">
                              <Menu.Item>
                                {({ active }) => (
                                  <Link to={`/`}>
                                    <a
                                      href="#"
                                      className={classNames(
                                        active
                                          ? "bg-teal-900/60  text-slate-50"
                                          : "text-slate-50",
                                        "block px-4 py-2 text-sm",
                                      )}
                                    >
                                      Home2
                                    </a>
                                  </Link>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <Link to={`/Race`}>
                                    <a
                                      href="#"
                                      className={classNames(
                                        active
                                          ? "bg-teal-900/60 text-slate-50"
                                          : "text-slate-50",
                                        "block px-4 py-2 text-sm",
                                      )}
                                    >
                                      Race
                                    </a>
                                  </Link>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <Link to={`/Credit`}>
                                    <a
                                      href="#"
                                      className={classNames(
                                        active
                                          ? "bg-teal-900/60 text-slate-50"
                                          : "text-slate-50",
                                        "block px-4 py-2 text-sm",
                                      )}
                                    >
                                      Credit
                                    </a>
                                  </Link>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <Link to={`/Swap`}>
                                    <a
                                      href="#"
                                      className={classNames(
                                        active
                                          ? "bg-teal-900/60 text-slate-50"
                                          : "text-slate-50",
                                        "block px-4 py-2 text-sm",
                                      )}
                                    >
                                      Swap
                                    </a>
                                  </Link>
                                )}
                              </Menu.Item>
                            </div>
                            <form>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    type="submit"
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-slate-50",
                                      "block w-full px-4 py-2 text-left text-sm",
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
                class="ml-1 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 lg:hidden"
                aria-controls="mobile-menu-2"
                aria-expanded="false"
              >
                <span class="sr-only">Open main menu</span>
                <svg
                  class="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <svg
                  class="hidden h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
            <div
              class="hidden w-full items-center justify-between lg:order-1 lg:flex lg:w-auto"
              id="mobile-menu-2"
            >
              <ul class="mt-4 flex flex-col font-medium lg:mt-0 lg:flex-row lg:space-x-8">
                <li>
                  <Link to={`/`}>
                    <a
                      href=""
                      class="block rounded bg-teal-700 py-2 pr-4 pl-3 text-slate-200 lg:bg-transparent lg:p-0 lg:text-slate-200 "
                      aria-current="page"
                    >
                      Home
                    </a>
                  </Link>
                </li>
                <li>
                  <Link to={`/Race/1`}>
                    <a
                      href=""
                      class="block border-b border-gray-100 py-2 pr-4 pl-3 text-slate-300 hover:bg-gray-50 lg:border-0 lg:p-0 lg:hover:bg-transparent lg:hover:text-teal-600"
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
                      class="block border-b border-gray-100 py-2 pr-4 pl-3 text-slate-300 hover:bg-gray-50 lg:border-0 lg:p-0 lg:hover:bg-transparent lg:hover:text-teal-600"
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
                      class="block border-b border-gray-100 py-2 pr-4 pl-3 text-slate-300 hover:bg-gray-50 lg:border-0 lg:p-0 lg:hover:bg-transparent lg:hover:text-teal-600"
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
                      class="block border-b border-gray-100 py-2 pr-4 pl-3 text-slate-300 hover:bg-gray-50 lg:border-0 lg:p-0 lg:hover:bg-transparent lg:hover:text-teal-600"
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
    </>
  );
};

export default Header;
