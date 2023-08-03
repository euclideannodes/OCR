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
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Menu from "@mui/material/Menu";
import { makeStyles } from "@mui/styles";
import ReactGA from "react-ga";
ReactGA.initialize("G-WKRBXV0N00");
ReactGA.pageview(window.location.pathname + window.location.search);

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
const useStyles = makeStyles({});
const containerStyles = {};

const All = () => {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  let [resultData, setResultData] = useState(null);
  let [resultWinData, setResultWinData] = useState(null);
  let [resultAllData, setResultAllData] = useState([]);
  const [minValues, setMinValues] = useState({});
  const [getSupply, setSupply] = useState(null);
  let [imageHero, setImage] = useState(
    String(
      "data:image/svg+xml;base64, PHN2ZyB2aWV3Qm94PSIwIDUgMjUwIDUwMCIgaGVpZ2h0PSI1MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggaWQ9ImEiIGZpbGw9Im5vbmUiIGQ9Ik00Mi41NTMgNDAwcy0uMTE5LTEyMy45NzItLjEwOC0xODUuOTU4Yy4wMDctMzguMDE0LjEwOC0xMTQuMDQyLjEwOC0xMTQuMDQyIi8+CiAgPHBhdGggaWQ9ImIiIGZpbGw9Im5vbmUiIGQ9Ik0xOTkuNTczIDk4Ljg5NiAyMDAgNDAwIi8+CiAgPHBhdGggaWQ9ImMiIHN0eWxlPSJmaWxsOm5vbmU7dHJhbnNmb3JtLW9yaWdpbjo3My4zMzNweCA0NTMuOTY3cHgiIGQ9Ik0xOTkuNTczIDQwMGMwIDEwMC0xNTcuMDIgMTAwLTE1Ny4wMiAwIi8+CiAgPHBhdGggaWQ9ImQiIHN0eWxlPSJmaWxsOm5vbmU7dHJhbnNmb3JtLW9yaWdpbjoyNjMuMzg5cHggMTAwLjg5NHB4IiBkPSJNNDIuNTUzIDEwMmMwLTEwMiAxNTcuMDItMTAyIDE1Ny4wMi0zIi8+CiAgPHBhdGggc3R5bGU9ImZpbGw6IzEwMTcyOSIgZD0iTTAgMGgzMzYuMTY1djUwMEgweiIvPgogIDxnIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGZpbGw9Im5vbmUiPgogICAgPHVzZSBocmVmPSIjYSIgc3Ryb2tlPSJyZWQiIHN0cm9rZS13aWR0aD0iMjQiLz4KICAgIDx1c2UgaHJlZj0iI2EiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLWRhc2hhcnJheT0iMjYgMjYiIHN0cm9rZS13aWR0aD0iMjQiLz4KICAgIDx1c2UgaHJlZj0iI2EiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIxOSIvPgogIDwvZz4KICA8ZyBzdHJva2UtbGluZWpvaW49InJvdW5kIiBmaWxsPSJub25lIj4KICAgIDx1c2UgaHJlZj0iI2IiIHN0cm9rZT0icmVkIiBzdHJva2Utd2lkdGg9IjI0Ii8+CiAgICA8dXNlIGhyZWY9IiNiIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1kYXNoYXJyYXk9IjI2IDI2IiBzdHJva2Utd2lkdGg9IjI0Ii8+CiAgICA8dXNlIGhyZWY9IiNiIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMTkiLz4KICA8L2c+CiAgPGcgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZmlsbD0ibm9uZSI+CiAgICA8dXNlIGhyZWY9IiNjIiBzdHJva2U9InJlZCIgc3Ryb2tlLXdpZHRoPSIyNCIvPgogICAgPHVzZSBocmVmPSIjYyIgc3Ryb2tlPSIjZmZmIiBzdHJva2UtZGFzaGFycmF5PSIyNiAyNiIgc3Ryb2tlLXdpZHRoPSIyNCIvPgogICAgPHVzZSBocmVmPSIjYyIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjE5Ii8+CiAgPC9nPgogIDxnIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGZpbGw9Im5vbmUiPgogICAgPHVzZSBocmVmPSIjZCIgc3Ryb2tlPSJyZWQiIHN0cm9rZS13aWR0aD0iMjQiLz4KICAgIDx1c2UgaHJlZj0iI2QiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLWRhc2hhcnJheT0iMjYgMjYiIHN0cm9rZS13aWR0aD0iMjQiLz4KICAgIDx1c2UgaHJlZj0iI2QiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIxOSIvPgogIDwvZz4KICA8cGF0aCBmaWxsPSJub25lIiBkPSJtNDUuMzY1IDEwMi43NjUtLjExNyA1NzEuNjIyIi8+CiAgPHBhdGggc3R5bGU9ImZpbGw6IzVlNWVjNiIgZD0iTTE5MC41IDM5NC40ODdoMTl2NmgtMTl6bS0xNTcuNSAwaDE5djZIMzN6TTMzIDk2aDE5djZIMzN6Ii8+CiAgPHBhdGggc3R5bGU9ImZpbGw6I2ZmZiIgZD0iTTEyLjMzNiA0MDMuNTMyaDEwdjEwaC0xMHoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE4NC4wNjYgLTkxLjE2KSBzY2FsZSguNDgxNDQpIi8+CiAgPHBhdGggZD0iTTE5MC4wMDUgOTguMzAyaDQuODE0djQuODE0aC00LjgxNHoiLz4KICA8cGF0aCBzdHlsZT0iZmlsbDojZmZmIiBkPSJNMTIuMzM2IDM4My41MzJoMTB2MTBoLTEweiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTg0LjA2NiAtOTEuMTYpIHNjYWxlKC40ODE0NCkiLz4KICA8cGF0aCBkPSJNMTk0LjgyIDkzLjQ4OGg0LjgxNHY0LjgxNGgtNC44MTV6Ii8+CiAgPHBhdGggc3R5bGU9ImZpbGw6I2ZmZiIgZD0iTTMyLjMzNiAzODMuNTMyaDEwdjEwaC0xMHptLTEwIDEwaDEwdjEwaC0xMHoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE4NC4wNjYgLTkxLjE2KSBzY2FsZSguNDgxNDQpIi8+CiAgPHBhdGggZD0iTTE5NC44MiAxMDMuMTE2aDQuODE0djQuODE1aC00LjgxNXoiLz4KICA8cGF0aCBzdHlsZT0iZmlsbDojZmZmIiBkPSJNMzIuMzM2IDQwMy41MzJoMTB2MTBoLTEweiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTg0LjA2NiAtOTEuMTYpIHNjYWxlKC40ODE0NCkiLz4KICA8cGF0aCBkPSJNMTk5LjYzNCA5OC4zMDJoNC44MTR2NC44MTRoLTQuODE0em00LjgxNCA0LjgxNGg0LjgxNXY0LjgxNWgtNC44MTV6bTAtOS42MjhoNC44MTV2NC44MTRoLTQuODE1eiIvPgogIDxwYXRoIHN0eWxlPSJmaWxsOiNmZmYiIGQ9Ik00Mi4zMzYgMzkzLjUzMmgxMHYxMGgtMTB6IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxODQuMDY2IC05MS4xNikgc2NhbGUoLjQ4MTQ0KSIvPgoKPC9zdmc+Cg==",
    ),
  );
  const [resultArrayWin, setResultArrayWin] = useState([]);
  const [hiddenDiv, setHiddenDiv] = useState(String("hidden"));

  let count = 0;
  let getTotalTicketCount = data.getTotalTicketCount;
  let tokenURI = data.tokenURI;
  let getCredit = data.getCredit;
  let totalSupply = data.totalSupply;
  let getDataByMap = data.getDataByMap;
  let getWinAdd = data.getWinAdd;
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
      setHiddenDiv("");
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
      blockchain.smartContract.methods
        .getPlayerAddress(String(getSupply))
        .call()
        .then((result) => {
          setResultData(result);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [blockchain.account, resultData]);
  useEffect(() => {
    if (blockchain.account !== null) {
      blockchain.smartContract.methods
        .listAllWinning()
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
    if (blockchain.account !== null) {
      blockchain.smartContract.methods
        .viewAllData()
        .call()
        .then((result2) => {
          setResultAllData(result2);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [blockchain.account]);
  let resultArray = [];
  useEffect(() => {
    if (resultData && resultData.length !== null) {
      for (let i = 1; i < resultData.length; i++) {
        resultArray.push(resultData[i]);
      }
    }
  }, [resultData]);
  function trunceString(string) {
    const start = string.slice(0, 4);
    const middle = "...";
    const last = string.slice(-5);
    const newString = `${start}${middle}${last}`;
    return newString;
  }
  useEffect(() => {
    if (resultWinData && resultWinData.length !== null) {
      let updatedResultArrayWin = [];
      const maxIterations = Math.min(resultWinData.length, 10);
      for (let i = 0; i < maxIterations; i++) {
        const walletAddress = resultWinData[i][0];
        const wonMaps = resultWinData[i][1];
        updatedResultArrayWin.push({
          walletAddress: walletAddress,
          wonMaps: wonMaps.length,
        });
      }
      updatedResultArrayWin.sort((a, b) => b.wonMaps - a.wonMaps);

      setResultArrayWin(updatedResultArrayWin);
    }
  }, [resultWinData]);
  useEffect(() => {
    if (resultAllData !== null) {
      const groupedData = resultAllData.reduce((acc, curr) => {
        const key = curr[2];
        const value = curr[4];
        const name = curr[0];
        if (!acc[key] || value < acc[key].value) {
          acc[key] = { value, name };
        }
        return acc;
      }, {});
      setMinValues(groupedData);
    }
  }, [resultAllData]);
  return (
    <>
      {(() => {
        if (blockchain.account == null) {
          return (
            <>
              <div className="hidden sm:block">
                <div className="from-bgc to-bgc animate-pulse bg-gradient-to-r via-teal-900 text-center leading-normal tracking-normal hs-removing:-translate-y-full">
                  <div className="mx-auto max-w-full px-4 py-1 sm:px-6 lg:px-8">
                    <div className="">
                      <span className=" text-xs font-bold  text-white lg:text-lg">
                        <strong className="text-amber-600"> Win </strong>
                        the Race → Get{" "}
                        <strong className="text-amber-600">5 Free</strong>{" "}
                        Credits →
                        <strong className="text-amber-600"> Swap</strong>{" "}
                        <div className="   inline-flex items-center   ">
                          MATIC
                          <svg
                            className=" ml-2 h-3 w-3"
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
                          or use for the Next Races! 
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="sm:hidden">
                <div className="from-bgc to-bgc animate-pulse bg-gradient-to-r via-teal-900 text-center leading-normal tracking-normal hs-removing:-translate-y-full">
                  <div className="mx-auto max-w-full px-4  sm:px-6 lg:px-8">
                    <div className="">
                      <marquee
                        behavior="scroll"
                        direction="left"
                        scrollamount="5"
                        className=""
                      >
                        <span className=" text-xs font-bold  text-white lg:text-lg">
                          <strong className="text-amber-600"> Win </strong>
                          the Races → Get{" "}
                          <strong className="text-amber-600">
                            5 Free
                          </strong>{" "}
                          Credits →
                          <strong className="text-amber-600"> Swap</strong>{" "}
                          <div className="   inline-flex items-center   ">
                            MATIC
                            <svg
                              className=" ml-2 h-3 w-3"
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
                            or use for the Next Races! 
                        </span>
                      </marquee>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        } else {
          return <></>;
        }
      })()}
      <div className="container my-5 mx-auto ">
        <section className="from-bgc to-bgc rounded-xl  bg-gradient-to-r via-teal-900/80 ">
          <div className="mx-auto grid max-w-full p-3 lg:p-8">
            <div className="mx-auto max-w-full ">
              <dl className="grid grid-cols-1 gap-y-6 text-center lg:grid-cols-2 lg:gap-y-16">
                <div className="mx-auto flex max-w-md flex-col gap-y-0 lg:gap-y-6 ">
                  <dt className="leading-7 text-slate-100">
                    <p className="mt-0  text-justify text-sm leading-4 text-slate-300  lg:mt-6 lg:text-lg lg:leading-8">
                      The Season 1 map has{" "}
                      <strong className="text-teal-600">3</strong> speed
                      check-points in total. There are{" "}
                      <strong className="text-teal-600"> 5</strong> light
                      corners, <strong className="text-teal-600">7</strong>{" "}
                      sharp corners,{" "}
                      <strong className="text-teal-600">3</strong> fast corners,
                      <strong className="text-teal-600"> 5</strong> short
                      straights, and{" "}
                      <strong className="text-teal-600">1</strong> long straight
                      in this map. Season 1 will end after a total of 250 races.
                    </p>
                  </dt>
                  <dd className="order-first text-xl font-semibold tracking-normal text-slate-100 sm:text-4xl lg:text-2xl">
                    OnChain Races: Season #1
                  </dd>
                </div>
                <div className="mx-auto flex max-w-full flex-col  lg:gap-y-6">
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                    <img
                      className="w-full rounded-2xl  duration-300 hover:scale-110"
                      src="season1.svg"
                      alt="season 1"
                    />
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
        <section className="bg-transparent  ">
          <div className="mx-auto grid max-w-full p-8 lg:grid-cols-12 lg:gap-8 lg:py-16 xl:gap-0">
            <div className="mr-auto place-self-center tracking-tight lg:col-span-8 ">
              <h1 className=" mb-4   max-w-2xl from-sky-400 text-justify text-4xl font-extrabold leading-none tracking-tight text-teal-600 md:text-5xl xl:text-6xl ">
                Welcome to OnChain Races!
              </h1>
              <p className="text-md mb-6 max-w-2xl text-justify  font-normal  leading-relaxed tracking-tight text-slate-300 md:text-lg lg:mb-8 lg:text-xl ">
                Get credits and participate in On-Chain Races!{" "}
                <p className="mt-1">
                  A total of 10 racers compete in a race. The 3 blue lines on
                  the map are the lines where the speed of the vehicles change.
                  The winners not only own the NFT of the map but also get 5
                  credits rewards. You can use these credits to participate in
                  other races or swap them for MATIC.
                  <p className="mt-3">
                    {" "}
                    <a
                      className=" text-sky-400/60 underline"
                      href="https://mumbaifaucet.com/"
                      rel="noreferrer"
                      target="_blank"
                    >
                      {" "}
                      Get Mumbai MATIC
                    </a>
                  </p>
                </p>
              </p>
              <div className="mt-auto flex flex-wrap  text-xs">
                <Link to={`/credit/`}>
                  <a
                    href=""
                    className="text-md justify-left mx-0.5 mr-3 mb-2 inline-flex items-center rounded-lg border border-solid border-slate-500/30 py-3  px-4  text-base font-medium  text-slate-300 shadow-sm  hover:shadow-slate-500"
                  >
                    Get Credit and Play !
                  </a>
                </Link>

                <p className="text-md  text-justify  leading-6  tracking-tight text-gray-500 ">
                  <a
                    className="text-sky-400/60"
                    href="https://twitter.com/OnChainRace/"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <div className=" text-md  justify-left   inline-flex items-center  rounded-lg  py-3 px-3 text-start  text-sm   font-medium  text-slate-300 shadow-sm  hover:shadow-slate-500  ">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="#34a2ec"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
                    </div>
                  </a>
                </p>
              </div>
            </div>

            <div className="  mx-x-auto from-bgc/50 max-w-full rounded-2xl  border border-solid border-slate-500/20 bg-gradient-to-b shadow-2xl duration-300 hover:scale-105 lg:col-span-4 lg:mt-0">
              <>
                <div className="h-100  flex w-full justify-center ">
                  {(() => {
                    if (blockchain.account == null) {
                      return (
                        <>
                          <section>
                            <div className="mx-auto max-w-2xl lg:max-w-4xl ">
                              <figure>
                                <blockquote className="animate-pulse p-4 text-center text-lg font-semibold  text-teal-600 sm:text-xl sm:leading-9">
                                  <div className=" row-start-2 inline-flex animate-pulse items-center  pl-2 pr-2 lg:pl-1 lg:pr-1  ">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth="1.5"
                                      stroke="currentColor"
                                      className="mr-2 h-6 w-6 text-teal-600 lg:h-7  lg:w-7"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                                      />
                                    </svg>
                                    <p className="text-md  grid  text-center lg:text-xl ">
                                      <span className="  ">
                                        {" "}
                                        Please Connect Your Wallet
                                      </span>
                                    </p>
                                  </div>
                                </blockquote>
                              </figure>
                            </div>
                          </section>
                        </>
                      );
                    } else {
                      return (
                        <>
                          <div className="  ">
                            <p className=" text-md  animate-pulse  p-2 py-3   text-teal-600 lg:p-1 lg:text-lg">
                              OnChainRace #{String(getSupply)}: Waiting to
                              Players{" "}
                            </p>
                            <hr className="h-px  border-0 bg-slate-200/20 " />
                            <table className="mt-3 w-full text-center text-sm text-gray-500 ">
                              <thead className="text-sm uppercase text-gray-400">
                                <tr>
                                  <th scope="col">Color</th>
                                  <th scope="col">Player ID</th>
                                  <th scope="col">Wallet Address</th>
                                </tr>
                              </thead>
                              <tbody>
                                {resultData &&
                                  resultData.length !== null &&
                                  resultData.map((item, index) => (
                                    <React.Fragment key={index}>
                                      <tr className="border-b">
                                        <td
                                          scope="row"
                                          className="whitespace-nowrap px-6 py-2 font-medium"
                                        >
                                          <span
                                            className={`text-${colors[index]}`}
                                          >
                                            ⬤
                                          </span>
                                        </td>
                                        <td className="px-2 py-2 lg:px-6">{`Player #${
                                          index + 1
                                        }`}</td>
                                        <td className="px-2 py-2 lg:px-6">{`${trunceString(
                                          item,
                                        )}`}</td>
                                      </tr>
                                    </React.Fragment>
                                  ))}
                              </tbody>
                            </table>
                            <div className="mt-auto flex flex-wrap  pt-3 text-xs">
                              <div className="grid   w-full grid-cols-1 divide-x divide-gray-900/5">
                                <Link to={`/Race/${getSupply}`}>
                                  <a className="text-md  flex  items-center justify-center p-3 text-slate-100 ">
                                    Go to Last Race
                                    <svg
                                      className="ml-2 -mr-1 h-3 w-3"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                      ></path>
                                    </svg>
                                  </a>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    }
                  })()}
                </div>
              </>
            </div>
          </div>
        </section>
        <section className="bg-transparent ">
          <div className="mx-auto grid max-w-full p-8 lg:grid-cols-12 lg:gap-8 lg:py-16 xl:gap-0">
            <div className="mr-auto place-self-center tracking-tight lg:col-span-8 ">
              <h1 className=" mb-4  max-w-2xl from-sky-400 text-justify text-4xl font-extrabold leading-none tracking-tight text-teal-600 md:text-5xl xl:text-6xl ">
                Fully-OnChain!
              </h1>
              <p className="font-tight mb-6 max-w-2xl  text-justify font-light leading-relaxed text-slate-300 md:text-lg lg:mb-8 lg:text-xl ">
                <p className="mb-3">
                  Even without this Web-App, all users can buy credits, trade,
                  participate in races, claiming maps, thanks to{" "}
                  <a
                    className="text-sky-600 after:content-['↗_']"
                    href="   https://www.monetsociety.io/post/on-chain-nfts-vs-off-chain-nfts"
                    rel="noreferrer"
                    target="_blank"
                  >
                    {" "}
                    On-Chain
                  </a>
                  technology.
                </p>
                OnChain Races speed calculation is empowered with
                <a
                  className="text-sky-600 after:content-['↗_']"
                  href="https://docs.chain.link/vrf/v2/introduction"
                  rel="noreferrer"
                  target="_blank"
                >
                  {" "}
                  Chainlink VRF (VERIFIABLE RANDOM FUNCTION)
                </a>
                for unforgettable racing experiences.
                <p className="mt-3">
                  {" "}
                  Chainlink VRF is an Oracle solution that enables transparent
                  and fair random speed calculations. When our racers pass each
                  of the blue 3 points on the map, Chainlink VRFs change their
                  speeds randomly. This integration ensures fair races and
                  real-time excitement.
                </p>
              </p>

              <Link to={`/credit/`}>
                <a
                  href=""
                  className="text-md justify-left mx-0.5 mr-3 mb-3 inline-flex items-center rounded-lg border border-solid border-slate-500/30 py-3  px-4  text-base font-medium  text-slate-300 shadow-sm  hover:shadow-slate-500"
                >
                  Get Credit and Play !
                </a>
              </Link>
            </div>

            <div className=" mx-x-auto from-bgc/50 mt-3 max-w-full rounded-2xl  border border-solid border-slate-500/20 bg-gradient-to-b shadow-2xl duration-300 hover:scale-105 lg:col-span-4 lg:mt-0">
              <>
                <div className="h-100 flex  w-full items-center justify-center ">
                  <img className={""} src={imageHero} />
                </div>
                <div className="h-100 flex  w-full items-center justify-center ">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setImage(
                        String(
                          "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDUgMjUwIDUwMCIgaGVpZ2h0PSI1MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggaWQ9ImEiIGZpbGw9Im5vbmUiIGQ9Ik00Mi41NTMgNDAwcy0uMTE5LTEyMy45NzItLjEwOC0xODUuOTU4Yy4wMDctMzguMDE0LjEwOC0xMTQuMDQyLjEwOC0xMTQuMDQyIi8+CiAgPHBhdGggaWQ9ImIiIGZpbGw9Im5vbmUiIGQ9Ik0xOTkuNTczIDk4Ljg5NiAyMDAgNDAwIi8+CiAgPHBhdGggaWQ9ImMiIHN0eWxlPSJmaWxsOm5vbmU7dHJhbnNmb3JtLW9yaWdpbjo3My4zMzNweCA0NTMuOTY3cHgiIGQ9Ik0xOTkuNTczIDQwMGMwIDEwMC0xNTcuMDIgMTAwLTE1Ny4wMiAwIi8+CiAgPHBhdGggaWQ9ImQiIHN0eWxlPSJmaWxsOm5vbmU7dHJhbnNmb3JtLW9yaWdpbjoyNjMuMzg5cHggMTAwLjg5NHB4IiBkPSJNNDIuNTUzIDEwMmMwLTEwMiAxNTcuMDItMTAyIDE1Ny4wMi0zIi8+CiAgPHBhdGggc3R5bGU9ImZpbGw6IzEwMTcyOSIgZD0iTTAgMGgzMzYuMTY1djUwMEgweiIvPgogIDxnIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGZpbGw9Im5vbmUiPgogICAgPHVzZSBocmVmPSIjYSIgc3Ryb2tlPSJyZWQiIHN0cm9rZS13aWR0aD0iMjQiLz4KICAgIDx1c2UgaHJlZj0iI2EiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLWRhc2hhcnJheT0iMjYgMjYiIHN0cm9rZS13aWR0aD0iMjQiLz4KICAgIDx1c2UgaHJlZj0iI2EiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIxOSIvPgogIDwvZz4KICA8ZyBzdHJva2UtbGluZWpvaW49InJvdW5kIiBmaWxsPSJub25lIj4KICAgIDx1c2UgaHJlZj0iI2IiIHN0cm9rZT0icmVkIiBzdHJva2Utd2lkdGg9IjI0Ii8+CiAgICA8dXNlIGhyZWY9IiNiIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1kYXNoYXJyYXk9IjI2IDI2IiBzdHJva2Utd2lkdGg9IjI0Ii8+CiAgICA8dXNlIGhyZWY9IiNiIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMTkiLz4KICA8L2c+CiAgPGcgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZmlsbD0ibm9uZSI+CiAgICA8dXNlIGhyZWY9IiNjIiBzdHJva2U9InJlZCIgc3Ryb2tlLXdpZHRoPSIyNCIvPgogICAgPHVzZSBocmVmPSIjYyIgc3Ryb2tlPSIjZmZmIiBzdHJva2UtZGFzaGFycmF5PSIyNiAyNiIgc3Ryb2tlLXdpZHRoPSIyNCIvPgogICAgPHVzZSBocmVmPSIjYyIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjE5Ii8+CiAgPC9nPgogIDxnIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGZpbGw9Im5vbmUiPgogICAgPHVzZSBocmVmPSIjZCIgc3Ryb2tlPSJyZWQiIHN0cm9rZS13aWR0aD0iMjQiLz4KICAgIDx1c2UgaHJlZj0iI2QiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLWRhc2hhcnJheT0iMjYgMjYiIHN0cm9rZS13aWR0aD0iMjQiLz4KICAgIDx1c2UgaHJlZj0iI2QiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIxOSIvPgogIDwvZz4KICA8cGF0aCBmaWxsPSJub25lIiBkPSJtNDUuMzY1IDEwMi43NjUtLjExNyA1NzEuNjIyIi8+CiAgPHBhdGggc3R5bGU9ImZpbGw6IzVlNWVjNiIgZD0iTTE5MC41IDM5NC40ODdoMTl2NmgtMTl6bS0xNTcuNSAwaDE5djZIMzN6TTMzIDk2aDE5djZIMzN6Ii8+CiAgPHBhdGggc3R5bGU9ImZpbGw6I2ZmZiIgZD0iTTEyLjMzNiA0MDMuNTMyaDEwdjEwaC0xMHoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE4NC4wNjYgLTkxLjE2KSBzY2FsZSguNDgxNDQpIi8+CiAgPHBhdGggZD0iTTE5MC4wMDUgOTguMzAyaDQuODE0djQuODE0aC00LjgxNHoiLz4KICA8cGF0aCBzdHlsZT0iZmlsbDojZmZmIiBkPSJNMTIuMzM2IDM4My41MzJoMTB2MTBoLTEweiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTg0LjA2NiAtOTEuMTYpIHNjYWxlKC40ODE0NCkiLz4KICA8cGF0aCBkPSJNMTk0LjgyIDkzLjQ4OGg0LjgxNHY0LjgxNGgtNC44MTV6Ii8+CiAgPHBhdGggc3R5bGU9ImZpbGw6I2ZmZiIgZD0iTTMyLjMzNiAzODMuNTMyaDEwdjEwaC0xMHptLTEwIDEwaDEwdjEwaC0xMHoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE4NC4wNjYgLTkxLjE2KSBzY2FsZSguNDgxNDQpIi8+CiAgPHBhdGggZD0iTTE5NC44MiAxMDMuMTE2aDQuODE0djQuODE1aC00LjgxNXoiLz4KICA8cGF0aCBzdHlsZT0iZmlsbDojZmZmIiBkPSJNMzIuMzM2IDQwMy41MzJoMTB2MTBoLTEweiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTg0LjA2NiAtOTEuMTYpIHNjYWxlKC40ODE0NCkiLz4KICA8cGF0aCBkPSJNMTk5LjYzNCA5OC4zMDJoNC44MTR2NC44MTRoLTQuODE0em00LjgxNCA0LjgxNGg0LjgxNXY0LjgxNWgtNC44MTV6bTAtOS42MjhoNC44MTV2NC44MTRoLTQuODE1eiIvPgogIDxwYXRoIHN0eWxlPSJmaWxsOiNmZmYiIGQ9Ik00Mi4zMzYgMzkzLjUzMmgxMHYxMGgtMTB6IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxODQuMDY2IC05MS4xNikgc2NhbGUoLjQ4MTQ0KSIvPgogIDxjaXJjbGUgY3g9IjMuMzcxIiByPSIzIiBmaWxsPSJwbHVtIj4KICAgIDxhbmltYXRlTW90aW9uIGJlZ2luPSIwcyIgZHVyPSI1LjEyMyIgcmVwZWF0Q291bnQ9IjAiPgogICAgICA8bXBhdGggaHJlZj0iI2IiLz4KICAgIDwvYW5pbWF0ZU1vdGlvbj4KICA8L2NpcmNsZT4KICA8Y2lyY2xlIGN4PSIzLjM3MSIgcj0iMyIgZmlsbD0icGx1bSI+CiAgICA8YW5pbWF0ZU1vdGlvbiBiZWdpbj0iNS4xMjMiIGR1cj0iNC4xMTkiIHJlcGVhdENvdW50PSIwIj4KICAgICAgPG1wYXRoIGhyZWY9IiNjIi8+CiAgICA8L2FuaW1hdGVNb3Rpb24+CiAgPC9jaXJjbGU+CiAgPGNpcmNsZSBjeD0iMy4zNzEiIHI9IjMiIGZpbGw9InBsdW0iPgogICAgPGFuaW1hdGVNb3Rpb24gYmVnaW49IjkuMjQyIiBkdXI9IjMuNDMiIHJlcGVhdENvdW50PSIwIj4KICAgICAgPG1wYXRoIGhyZWY9IiNhIi8+CiAgICA8L2FuaW1hdGVNb3Rpb24+CiAgPC9jaXJjbGU+CiAgPGNpcmNsZSBjeD0iMy4zNzEiIHI9IjMiIGZpbGw9InBsdW0iPgogICAgPGFuaW1hdGVNb3Rpb24gYmVnaW49IjEyLjY3MiIgZHVyPSIzLjg2NiIgcmVwZWF0Q291bnQ9IjAiPgogICAgICA8bXBhdGggaHJlZj0iI2QiLz4KICAgIDwvYW5pbWF0ZU1vdGlvbj4KICA8L2NpcmNsZT4KICA8Y2lyY2xlIGN4PSItNS4zMTkiIHI9IjMiIGZpbGw9IiNmZjE0OTMiPgogICAgPGFuaW1hdGVNb3Rpb24gYmVnaW49IjBzIiBkdXI9IjUuNTc3IiByZXBlYXRDb3VudD0iMCI+CiAgICAgIDxtcGF0aCBocmVmPSIjYiIvPgogICAgPC9hbmltYXRlTW90aW9uPgogIDwvY2lyY2xlPgogIDxjaXJjbGUgY3g9Ii01LjMxOSIgcj0iMyIgZmlsbD0iI2ZmMTQ5MyI+CiAgICA8YW5pbWF0ZU1vdGlvbiBiZWdpbj0iNS41NzciIGR1cj0iNC41OTQiIHJlcGVhdENvdW50PSIwIj4KICAgICAgPG1wYXRoIGhyZWY9IiNjIi8+CiAgICA8L2FuaW1hdGVNb3Rpb24+CiAgPC9jaXJjbGU+CiAgPGNpcmNsZSBjeD0iLTUuMzE5IiByPSIzIiBmaWxsPSIjZmYxNDkzIj4KICAgIDxhbmltYXRlTW90aW9uIGJlZ2luPSIxMC4xNyIgZHVyPSIzLjk0NSIgcmVwZWF0Q291bnQ9IjAiPgogICAgICA8bXBhdGggaHJlZj0iI2EiLz4KICAgIDwvYW5pbWF0ZU1vdGlvbj4KICA8L2NpcmNsZT4KICA8Y2lyY2xlIGN4PSItNS4zMTkiIHI9IjMiIGZpbGw9IiNmZjE0OTMiPgogICAgPGFuaW1hdGVNb3Rpb24gYmVnaW49IjE0LjExNSIgZHVyPSIzLjU0OSIgcmVwZWF0Q291bnQ9IjAiPgogICAgICA8bXBhdGggaHJlZj0iI2QiLz4KICAgIDwvYW5pbWF0ZU1vdGlvbj4KICA8L2NpcmNsZT4KICA8Y2lyY2xlIGN4PSI2LjE4MSIgcj0iMyIgZmlsbD0iIzFlOTBmZiI+CiAgICA8YW5pbWF0ZU1vdGlvbiBiZWdpbj0iMHMiIGR1cj0iNS42NDEiIHJlcGVhdENvdW50PSIwIj4KICAgICAgPG1wYXRoIGhyZWY9IiNiIi8+CiAgICA8L2FuaW1hdGVNb3Rpb24+CiAgPC9jaXJjbGU+CiAgPGNpcmNsZSBjeD0iNi4xODEiIHI9IjMiIGZpbGw9IiMxZTkwZmYiPgogICAgPGFuaW1hdGVNb3Rpb24gYmVnaW49IjUuNjQxIiBkdXI9IjQuNTE0IiByZXBlYXRDb3VudD0iMCI+CiAgICAgIDxtcGF0aCBocmVmPSIjYyIvPgogICAgPC9hbmltYXRlTW90aW9uPgogIDwvY2lyY2xlPgogIDxjaXJjbGUgY3g9IjYuMTgxIiByPSIzIiBmaWxsPSIjMWU5MGZmIj4KICAgIDxhbmltYXRlTW90aW9uIGJlZ2luPSIxMC4xNTUiIGR1cj0iMy42MjQiIHJlcGVhdENvdW50PSIwIj4KICAgICAgPG1wYXRoIGhyZWY9IiNhIi8+CiAgICA8L2FuaW1hdGVNb3Rpb24+CiAgPC9jaXJjbGU+CiAgPGNpcmNsZSBjeD0iNi4xODEiIHI9IjMiIGZpbGw9IiMxZTkwZmYiPgogICAgPGFuaW1hdGVNb3Rpb24gYmVnaW49IjEzLjc3OSIgZHVyPSIzLjYzMiIgcmVwZWF0Q291bnQ9IjAiPgogICAgICA8bXBhdGggaHJlZj0iI2QiLz4KICAgIDwvYW5pbWF0ZU1vdGlvbj4KICA8L2NpcmNsZT4KICA8Y2lyY2xlIGN4PSItMy40IiByPSIzIiBmaWxsPSIjZjA4MDgwIj4KICAgIDxhbmltYXRlTW90aW9uIGJlZ2luPSIwcyIgZHVyPSI1LjY1NiIgcmVwZWF0Q291bnQ9IjAiPgogICAgICA8bXBhdGggaHJlZj0iI2IiLz4KICAgIDwvYW5pbWF0ZU1vdGlvbj4KICA8L2NpcmNsZT4KICA8Y2lyY2xlIGN4PSItMy40IiByPSIzIiBmaWxsPSIjZjA4MDgwIj4KICAgIDxhbmltYXRlTW90aW9uIGJlZ2luPSI1LjY1NiIgZHVyPSI0LjYxMyIgcmVwZWF0Q291bnQ9IjAiPgogICAgICA8bXBhdGggaHJlZj0iI2MiLz4KICAgIDwvYW5pbWF0ZU1vdGlvbj4KICA8L2NpcmNsZT4KICA8Y2lyY2xlIGN4PSItMy40IiByPSIzIiBmaWxsPSIjZjA4MDgwIj4KICAgIDxhbmltYXRlTW90aW9uIGJlZ2luPSIxMC4yNjgiIGR1cj0iMy4xOTkiIHJlcGVhdENvdW50PSIwIj4KICAgICAgPG1wYXRoIGhyZWY9IiNhIi8+CiAgICA8L2FuaW1hdGVNb3Rpb24+CiAgPC9jaXJjbGU+CiAgPGNpcmNsZSBjeD0iLTMuNCIgcj0iMyIgZmlsbD0iI2YwODA4MCI+CiAgICA8YW5pbWF0ZU1vdGlvbiBiZWdpbj0iMTMuNDY4IiBkdXI9IjMuNDQ1IiByZXBlYXRDb3VudD0iMCI+CiAgICAgIDxtcGF0aCBocmVmPSIjZCIvPgogICAgPC9hbmltYXRlTW90aW9uPgogIDwvY2lyY2xlPgogIDxjaXJjbGUgY3g9Ii0zLjQ2MyIgcj0iMyIgZmlsbD0ib3JhbmdlIj4KICAgIDxhbmltYXRlTW90aW9uIGJlZ2luPSIwcyIgZHVyPSI1LjgxMiIgcmVwZWF0Q291bnQ9IjAiPgogICAgICA8bXBhdGggaHJlZj0iI2IiLz4KICAgIDwvYW5pbWF0ZU1vdGlvbj4KICA8L2NpcmNsZT4KICA8Y2lyY2xlIGN4PSItMy40NjMiIHI9IjMiIGZpbGw9Im9yYW5nZSI+CiAgICA8YW5pbWF0ZU1vdGlvbiBiZWdpbj0iNS44MTIiIGR1cj0iNC4xODMiIHJlcGVhdENvdW50PSIwIj4KICAgICAgPG1wYXRoIGhyZWY9IiNjIi8+CiAgICA8L2FuaW1hdGVNb3Rpb24+CiAgPC9jaXJjbGU+CiAgPGNpcmNsZSBjeD0iLTMuNDYzIiByPSIzIiBmaWxsPSJvcmFuZ2UiPgogICAgPGFuaW1hdGVNb3Rpb24gYmVnaW49IjkuOTk2IiBkdXI9IjMuODU0IiByZXBlYXRDb3VudD0iMCI+CiAgICAgIDxtcGF0aCBocmVmPSIjYSIvPgogICAgPC9hbmltYXRlTW90aW9uPgogIDwvY2lyY2xlPgogIDxjaXJjbGUgY3g9Ii0zLjQ2MyIgcj0iMyIgZmlsbD0ib3JhbmdlIj4KICAgIDxhbmltYXRlTW90aW9uIGJlZ2luPSIxMy44NSIgZHVyPSIzLjY2MSIgcmVwZWF0Q291bnQ9IjAiPgogICAgICA8bXBhdGggaHJlZj0iI2QiLz4KICAgIDwvYW5pbWF0ZU1vdGlvbj4KICA8L2NpcmNsZT4KICA8Y2lyY2xlIGN4PSIxLjM1NyIgcj0iMyIgZmlsbD0icmVkIj4KICAgIDxhbmltYXRlTW90aW9uIGJlZ2luPSIwcyIgZHVyPSI1LjU2MyIgcmVwZWF0Q291bnQ9IjAiPgogICAgICA8bXBhdGggaHJlZj0iI2IiLz4KICAgIDwvYW5pbWF0ZU1vdGlvbj4KICA8L2NpcmNsZT4KICA8Y2lyY2xlIGN4PSIxLjM1NyIgcj0iMyIgZmlsbD0icmVkIj4KICAgIDxhbmltYXRlTW90aW9uIGJlZ2luPSI1LjU2MyIgZHVyPSI0LjIyMSIgcmVwZWF0Q291bnQ9IjAiPgogICAgICA8bXBhdGggaHJlZj0iI2MiLz4KICAgIDwvYW5pbWF0ZU1vdGlvbj4KICA8L2NpcmNsZT4KICA8Y2lyY2xlIGN4PSIxLjM1NyIgcj0iMyIgZmlsbD0icmVkIj4KICAgIDxhbmltYXRlTW90aW9uIGJlZ2luPSI5Ljc4NCIgZHVyPSIzLjMyMSIgcmVwZWF0Q291bnQ9IjAiPgogICAgICA8bXBhdGggaHJlZj0iI2EiLz4KICAgIDwvYW5pbWF0ZU1vdGlvbj4KICA8L2NpcmNsZT4KICA8Y2lyY2xlIGN4PSIxLjM1NyIgcj0iMyIgZmlsbD0icmVkIj4KICAgIDxhbmltYXRlTW90aW9uIGJlZ2luPSIxMy4xMDUiIGR1cj0iMy4yNSIgcmVwZWF0Q291bnQ9IjAiPgogICAgICA8bXBhdGggaHJlZj0iI2QiLz4KICAgIDwvYW5pbWF0ZU1vdGlvbj4KICA8L2NpcmNsZT4KICA8Y2lyY2xlIGN4PSI2LjY5NiIgcj0iMyIgZmlsbD0iI2ZmZiI+CiAgICA8YW5pbWF0ZU1vdGlvbiBiZWdpbj0iMHMiIGR1cj0iNS42NTQiIHJlcGVhdENvdW50PSIwIj4KICAgICAgPG1wYXRoIGhyZWY9IiNiIi8+CiAgICA8L2FuaW1hdGVNb3Rpb24+CiAgPC9jaXJjbGU+CiAgPGNpcmNsZSBjeD0iNi42OTYiIHI9IjMiIGZpbGw9IiNmZmYiPgogICAgPGFuaW1hdGVNb3Rpb24gYmVnaW49IjUuNjU0IiBkdXI9IjQuMzQ4IiByZXBlYXRDb3VudD0iMCI+CiAgICAgIDxtcGF0aCBocmVmPSIjYyIvPgogICAgPC9hbmltYXRlTW90aW9uPgogIDwvY2lyY2xlPgogIDxjaXJjbGUgY3g9IjYuNjk2IiByPSIzIiBmaWxsPSIjZmZmIj4KICAgIDxhbmltYXRlTW90aW9uIGJlZ2luPSIxMC4wMDIiIGR1cj0iMy41MDUiIHJlcGVhdENvdW50PSIwIj4KICAgICAgPG1wYXRoIGhyZWY9IiNhIi8+CiAgICA8L2FuaW1hdGVNb3Rpb24+CiAgPC9jaXJjbGU+CiAgPGNpcmNsZSBjeD0iNi42OTYiIHI9IjMiIGZpbGw9IiNmZmYiPgogICAgPGFuaW1hdGVNb3Rpb24gYmVnaW49IjEzLjUwNyIgZHVyPSIzLjMyIiByZXBlYXRDb3VudD0iMCI+CiAgICAgIDxtcGF0aCBocmVmPSIjZCIvPgogICAgPC9hbmltYXRlTW90aW9uPgogIDwvY2lyY2xlPgogIDxjaXJjbGUgY3g9IjMuMDczIiByPSIzIiBmaWxsPSIjMDAwMGNkIj4KICAgIDxhbmltYXRlTW90aW9uIGJlZ2luPSIwcyIgZHVyPSI1LjQ3MyIgcmVwZWF0Q291bnQ9IjAiPgogICAgICA8bXBhdGggaHJlZj0iI2IiLz4KICAgIDwvYW5pbWF0ZU1vdGlvbj4KICA8L2NpcmNsZT4KICA8Y2lyY2xlIGN4PSIzLjA3MyIgcj0iMyIgZmlsbD0iIzAwMDBjZCI+CiAgICA8YW5pbWF0ZU1vdGlvbiBiZWdpbj0iNS40NzMiIGR1cj0iNC4xMjkiIHJlcGVhdENvdW50PSIwIj4KICAgICAgPG1wYXRoIGhyZWY9IiNjIi8+CiAgICA8L2FuaW1hdGVNb3Rpb24+CiAgPC9jaXJjbGU+CiAgPGNpcmNsZSBjeD0iMy4wNzMiIHI9IjMiIGZpbGw9IiMwMDAwY2QiPgogICAgPGFuaW1hdGVNb3Rpb24gYmVnaW49IjkuNjAyIiBkdXI9IjMuNDQiIHJlcGVhdENvdW50PSIwIj4KICAgICAgPG1wYXRoIGhyZWY9IiNhIi8+CiAgICA8L2FuaW1hdGVNb3Rpb24+CiAgPC9jaXJjbGU+CiAgPGNpcmNsZSBjeD0iMy4wNzMiIHI9IjMiIGZpbGw9IiMwMDAwY2QiPgogICAgPGFuaW1hdGVNb3Rpb24gYmVnaW49IjEzLjA0MiIgZHVyPSIzLjY1NiIgcmVwZWF0Q291bnQ9IjAiPgogICAgICA8bXBhdGggaHJlZj0iI2QiLz4KICAgIDwvYW5pbWF0ZU1vdGlvbj4KICA8L2NpcmNsZT4KICA8Y2lyY2xlIGN4PSI1Ljk2NyIgcj0iMyIgZmlsbD0iIzdmZmZkNCI+CiAgICA8YW5pbWF0ZU1vdGlvbiBiZWdpbj0iMHMiIGR1cj0iNS4zNzMiIHJlcGVhdENvdW50PSIwIj4KICAgICAgPG1wYXRoIGhyZWY9IiNiIi8+CiAgICA8L2FuaW1hdGVNb3Rpb24+CiAgPC9jaXJjbGU+CiAgPGNpcmNsZSBjeD0iNS45NjciIHI9IjMiIGZpbGw9IiM3ZmZmZDQiPgogICAgPGFuaW1hdGVNb3Rpb24gYmVnaW49IjUuMzczIiBkdXI9IjQuMTc5IiByZXBlYXRDb3VudD0iMCI+CiAgICAgIDxtcGF0aCBocmVmPSIjYyIvPgogICAgPC9hbmltYXRlTW90aW9uPgogIDwvY2lyY2xlPgogIDxjaXJjbGUgY3g9IjUuOTY3IiByPSIzIiBmaWxsPSIjN2ZmZmQ0Ij4KICAgIDxhbmltYXRlTW90aW9uIGJlZ2luPSI5LjU1MSIgZHVyPSIzLjM3NSIgcmVwZWF0Q291bnQ9IjAiPgogICAgICA8bXBhdGggaHJlZj0iI2EiLz4KICAgIDwvYW5pbWF0ZU1vdGlvbj4KICA8L2NpcmNsZT4KICA8Y2lyY2xlIGN4PSI1Ljk2NyIgcj0iMyIgZmlsbD0iIzdmZmZkNCI+CiAgICA8YW5pbWF0ZU1vdGlvbiBiZWdpbj0iMTIuOTI2IiBkdXI9IjMuNTQyIiByZXBlYXRDb3VudD0iMCI+CiAgICAgIDxtcGF0aCBocmVmPSIjZCIvPgogICAgPC9hbmltYXRlTW90aW9uPgogIDwvY2lyY2xlPgogIDxjaXJjbGUgY3g9IjQuNDc1IiByPSIzIiBmaWxsPSIjMjI4YjIyIj4KICAgIDxhbmltYXRlTW90aW9uIGJlZ2luPSIwcyIgZHVyPSI1LjcwOSIgcmVwZWF0Q291bnQ9IjAiPgogICAgICA8bXBhdGggaHJlZj0iI2IiLz4KICAgIDwvYW5pbWF0ZU1vdGlvbj4KICA8L2NpcmNsZT4KICA8Y2lyY2xlIGN4PSI0LjQ3NSIgcj0iMyIgZmlsbD0iIzIyOGIyMiI+CiAgICA8YW5pbWF0ZU1vdGlvbiBiZWdpbj0iNS43MDkiIGR1cj0iNC4yMTIiIHJlcGVhdENvdW50PSIwIj4KICAgICAgPG1wYXRoIGhyZWY9IiNjIi8+CiAgICA8L2FuaW1hdGVNb3Rpb24+CiAgPC9jaXJjbGU+CiAgPGNpcmNsZSBjeD0iNC40NzUiIHI9IjMiIGZpbGw9IiMyMjhiMjIiPgogICAgPGFuaW1hdGVNb3Rpb24gYmVnaW49IjkuOTIxIiBkdXI9IjMuODUiIHJlcGVhdENvdW50PSIwIj4KICAgICAgPG1wYXRoIGhyZWY9IiNhIi8+CiAgICA8L2FuaW1hdGVNb3Rpb24+CiAgPC9jaXJjbGU+CiAgPGNpcmNsZSBjeD0iNC40NzUiIHI9IjMiIGZpbGw9IiMyMjhiMjIiPgogICAgPGFuaW1hdGVNb3Rpb24gYmVnaW49IjEzLjc3MiIgZHVyPSIzLjIxMyIgcmVwZWF0Q291bnQ9IjAiPgogICAgICA8bXBhdGggaHJlZj0iI2QiLz4KICAgIDwvYW5pbWF0ZU1vdGlvbj4KICA8L2NpcmNsZT4KPC9zdmc+Cg==",
                        ),
                      );
                    }}
                    className="
                  text-md justify-left mx-0.5 mr-3 mb-3 inline-flex items-center rounded-lg border border-solid border-slate-500/30 py-2  px-2  text-base font-medium  text-slate-300 shadow-sm  hover:shadow-slate-500
                  "
                  >
                    <div className="   inline-flex items-center   ">
                      Start Race 
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="h-4 w-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                        />
                      </svg>
                    </div>
                  </button>
                </div>
              </>
            </div>
          </div>
        </section>
        {(() => {
          if (blockchain.account !== null) {
            return (
              <>
                <section className="bg-transparent ">
                  <div className="mx-auto grid max-w-full p-8 lg:grid-cols-12 lg:gap-8 lg:py-16 xl:gap-0">
                    <div className="mr-auto place-self-center lg:col-span-8">
                      <h1 className=" mb-4 max-w-2xl text-justify text-xl font-extrabold leading-none tracking-tight text-teal-500/80 md:text-5xl lg:text-4xl xl:text-6xl ">
                        OnChain Races Table{" "}
                      </h1>
                    </div>
                    <div className="  mx-x-auto from-bgc/50 max-w-full rounded-2xl  border border-solid border-slate-500/20 bg-gradient-to-b shadow-2xl duration-300 hover:scale-105 lg:col-span-4 lg:mt-0 ">
                      <>
                        <div className="h-100 flex w-full  items-center justify-center">
                          <table className=" w-full text-left  text-xs lg:text-sm  ">
                            <thead className="text-sm font-bold uppercase text-gray-400 underline  underline-offset-2">
                              <tr>
                                <th scope="col" className="px-4 py-3">
                                  Race ID
                                </th>
                                <th scope="col" className="py-3 px-2">
                                  Winner
                                </th>
                                <th scope="col" className="py-3 px-2">
                                  Time
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(minValues).map(
                                ([key, { value, name }]) => {
                                  if (count >= 10) return null;
                                  count++;

                                  return (
                                    <tr key={key}>
                                      <td className="whitespace-nowrap px-4 py-2 font-light text-teal-500/60 underline decoration-dashed underline-offset-2">
                                        <Link to={`/Race/${key}`}>
                                          OnChain Races #{key}{" "}
                                        </Link>
                                      </td>
                                      <td className="whitespace-nowrap px-2 py-2 font-light text-teal-500/60 underline decoration-dashed underline-offset-2">
                                        <Link to={`/Address/${name}`}>
                                          {trunceString(name)}
                                        </Link>
                                      </td>
                                      <td className="whitespace-nowrap px-2 py-2 font-light text-gray-500">
                                        {value}
                                      </td>
                                    </tr>
                                  );
                                },
                              )}
                            </tbody>
                          </table>
                        </div>
                      </>
                    </div>
                  </div>
                </section>
                <section className="bg-transparent ">
                  <div className="mx-auto grid max-w-full p-8 lg:grid-cols-12 lg:gap-8 lg:py-16 xl:gap-0">
                    <div className="mr-auto place-self-center lg:col-span-8">
                      <h1 className=" mb-4 max-w-2xl text-justify text-xl font-extrabold leading-none tracking-tight text-teal-500/80 md:text-5xl lg:text-4xl xl:text-6xl ">
                        Top 10
                      </h1>
                    </div>
                    <div className="  mx-x-auto from-bgc/50 max-w-full rounded-2xl  border border-solid border-slate-500/20 bg-gradient-to-b shadow-2xl duration-300 hover:scale-105 lg:col-span-4 lg:mt-0 ">
                      <>
                        <div className="h-100 flex w-full  items-center justify-center">
                          <table className="w-full text-left  text-xs lg:text-sm ">
                            <thead className="text-sm font-bold uppercase text-gray-400 underline  underline-offset-2">
                              <tr>
                                <th scope="col" className="px-6 py-3">
                                  #
                                </th>
                                <th scope="col" className="px-6 py-3">
                                  Wallet
                                </th>
                                <th scope="col" className="px-6 py-3">
                                  Total Win
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {blockchain.account !== null &&
                                resultArrayWin &&
                                resultArrayWin.length !== null &&
                                resultArrayWin.map((item, index) => (
                                  <React.Fragment key={item.walletAddress}>
                                    <tr>
                                      <th
                                        scope="row"
                                        className="whitespace-nowrap px-6 py-2  font-light  text-gray-400"
                                      >
                                        {index + 1}
                                      </th>
                                      <Link
                                        to={`/Address/${item.walletAddress}`}
                                      >
                                        <th
                                          scope="row"
                                          className="whitespace-nowrap px-6 py-2  font-light text-teal-500/60 underline decoration-dashed underline-offset-2"
                                        >
                                          {trunceString(item.walletAddress)}
                                        </th>
                                      </Link>
                                      <td className="px-6 py-2 text-gray-400">
                                        {item.wonMaps}
                                      </td>
                                    </tr>
                                  </React.Fragment>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    </div>
                  </div>
                </section>
              </>
            );
          } else {
          }
        })()}

        <section className="bg-transparent">
          <div className="container mx-auto px-6 py-12">
            <h1
              className="mb-8 text-4xl font-extrabold tracking-tight text-teal-600"
              style={{ userSelect: "text" }}
            >
              Frequently asked questions.
            </h1>
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:mt-16 xl:grid-cols-3">
              <div>
                <div>
                  <h1
                    className="text-xl font-semibold text-gray-400 "
                    style={{ userSelect: "text" }}
                  >
                    {" "}
                    What is the OnChain Races ?
                  </h1>
                  <p
                    className="text-md mt-2  text-justify leading-6 text-gray-500 "
                    style={{ userSelect: "text" }}
                  >
                    OnChain Races is a Fully On-Chain and Chance-Based racing
                    game available on the Polygon. Players show their luck by
                    participating in an entirely fair race.
                  </p>
                </div>
              </div>
              <div>
                <h1
                  className="text-xl font-semibold text-gray-400 "
                  style={{ userSelect: "text" }}
                >
                  What are the Rules of the Game?
                </h1>
                <ul
                  className="list-disc   text-justify  leading-6 tracking-tight text-gray-500 antialiased "
                  style={{ userSelect: "text" }}
                >
                  <li className=" mb-3 mt-3">
                    The player buys credits to participate in the race.
                  </li>
                  <li className="mb-3 mt-3">
                    Participates in the last race with purchased credits and
                    spends one credit. Player cannot attend the same race with
                    the same address more than once (Except Teta).
                  </li>
                  <li className="mb-3 mt-3">
                    The race starts only when a total of 10 player participate.
                    Different color is assigned for each racer to follow the
                    race.
                  </li>
                  <li className="mb-3 mt-3">
                    There are 3 speed change checkpoints in total in a race.
                    Speeds are determined completely randomly using Chainlink
                    VRF and the speed of the racers changes in 3 points.
                  </li>
                  <li className="mb-3 mt-3">
                    The player who finishes the race in the shortest time wins
                    (If there are racers who finish in equal time, the first
                    racers to join the race among these racers is deemed to have
                    won the race). As a reward, racers gets the right to claim
                    won race as NFT and get free 5 credits. If the racer wishes,
                    racers can claim NFT later.{" "}
                  </li>
                  <li className="mb-3 mt-3">
                    The racer can participate in new races with two free credits
                    or Swap these credits for MATIC on the Swap page (if there
                    are enough MATICs in the pool).{" "}
                  </li>
                  <li className="mb-3 mt-3">
                    If a Swap is made, the rate of 1 Credit = 0.9 MATIC will
                    apply. The right to change this rate belongs to the contract
                    owner.
                  </li>
                  <li className="mb-3 mt-3">
                    Credit prices are located on the Credit page, and the
                    contract owner has the right to change the credit fees.
                  </li>
                </ul>
              </div>
              <div>
                <h1
                  className="text-xl font-semibold text-gray-400 "
                  style={{ userSelect: "text" }}
                >
                  How to Random Numbers Generate ?
                </h1>
                <p
                  className="text-md mt-2   text-justify  leading-6  tracking-tight text-gray-500 "
                  style={{ userSelect: "text" }}
                >
                  Via
                  <a
                    className="text-sky-400/60 after:content-['↗_']"
                    href="https://docs.chain.link/vrf/v2/introduction"
                    rel="noreferrer"
                    target="_blank"
                  >
                    {" "}
                    Chainlink VRF
                  </a>
                  generate random numbers in all races.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
export default All;
