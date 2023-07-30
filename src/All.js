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
  const [imageHero] = useState(
    String(
      "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDc2IDEwNCA2MjgiIHdpZHRoPSIxMDQiIGhlaWdodD0iNjI4IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGZpbGw9IiMxMTE3MjgiIGQ9Ik0gMCA3NiBMIDEwNCA3NiBMIDEwNCA3MDQgTCAwIDcwNCBMIDAgNzYgWiIgc3R5bGU9InN0cm9rZS13aWR0aDogMC4wOTg7Ii8+CiAgPHBhdGggaWQ9Im1hcDMiIGZpbGw9Im5vbmUiIGQ9Ik0gMCA3NiBMIDEwNCA3NiBMIDEwNCA3MDQgTCAwIDcwNCBMIDAgNzYgWiIvPgogIDxnIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGZpbGw9Im5vbmUiIHRyYW5zZm9ybT0ibWF0cml4KDAsIDEsIC0xLjAyNDgxNCwgMCwgNDA5LjkyNTUzNywgLTI1KSI+CiAgICA8cGF0aCBmaWxsPSJub25lIiBkPSJNIDEyNy4zMiAzNTUuOTA1IEMgMTk5LjU4MiAzNTUuNzMzIDcwMCAzNTYgNzAwIDM1NiIgdHJhbnNmb3JtPSJtYXRyaXgoMSwgMCwgMCwgMSwgMCwgMCkiIHN0cm9rZT0iI2UxMmI1MSIgc3Ryb2tlLXdpZHRoPSIyNCIvPgogICAgPHBhdGggZmlsbD0ibm9uZSIgZD0iTSAxMjcuMzIgMzU1LjkwNSBDIDE5OS41ODIgMzU1LjczMyA3MDAgMzU2IDcwMCAzNTYiIHRyYW5zZm9ybT0ibWF0cml4KDEsIDAsIDAsIDEsIDAsIDApIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1kYXNoYXJyYXk9IjI2IDI2IiBzdHJva2Utd2lkdGg9IjI0Ii8+CiAgICA8cGF0aCBmaWxsPSJub25lIiBkPSJNIDEyNy4zMiAzNTUuOTA1IEMgMTk5LjU4MiAzNTUuNzMzIDcwMCAzNTYgNzAwIDM1NiIgdHJhbnNmb3JtPSJtYXRyaXgoMSwgMCwgMCwgMSwgMCwgMCkiIHN0cm9rZT0iIzMzMzMzMyIgc3Ryb2tlLXdpZHRoPSIxOSIvPgogIDwvZz4KCiAgPHBhdGggaWQ9Im1hcDIiIGZpbGw9Im5vbmUiIGQ9Ik0gNDUuMzY1IDEwMi43NjUgTCA0NS4yNDggNjc0LjM4NyIvPgogIDxjaXJjbGUgcj0iMyIgZmlsbD0id2hpdGUiIHRyYW5zZm9ybT0iIiBkPSJNIDAgNzYgTCAxMDQgNzYgTCAxMDQgNzA0IEwgMCA3MDQgTCAwIDc2IFoiPgogICAgPGFuaW1hdGVNb3Rpb24gYmVnaW49IjBzIiBkdXI9IjcuOHMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj4KICAgICAgPG1wYXRoIGhyZWY9IiNtYXAyIi8+CiAgICA8L2FuaW1hdGVNb3Rpb24+CiAgPC9jaXJjbGU+CiAgPGNpcmNsZSByPSIzIiBmaWxsPSJwbHVtIiB0cmFuc2Zvcm09IiIgZD0iTSAwIDc2IEwgMTA0IDc2IEwgMTA0IDcwNCBMIDAgNzA0IEwgMCA3NiBaIj4KICAgIDxhbmltYXRlTW90aW9uIGJlZ2luPSIwcyIgZHVyPSI3LjVzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+CiAgICAgIDxtcGF0aCBocmVmPSIjbWFwMiIvPgogICAgPC9hbmltYXRlTW90aW9uPgogIDwvY2lyY2xlPgogIDxjaXJjbGUgcj0iMyIgZmlsbD0iZGVlcHBpbmsiIHRyYW5zZm9ybT0iIiBkPSJNIDAgNzYgTCAxMDQgNzYgTCAxMDQgNzA0IEwgMCA3MDQgTCAwIDc2IFoiPgogICAgPGFuaW1hdGVNb3Rpb24gYmVnaW49IjBzIiBkdXI9IjcuM3MiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj4KICAgICAgPG1wYXRoIGhyZWY9IiNtYXAyIi8+CiAgICA8L2FuaW1hdGVNb3Rpb24+CiAgPC9jaXJjbGU+CiAgPGNpcmNsZSByPSIzIiBmaWxsPSJkb2RnZXJibHVlIiB0cmFuc2Zvcm09IiIgZD0iTSAwIDc2IEwgMTA0IDc2IEwgMTA0IDcwNCBMIDAgNzA0IEwgMCA3NiBaIj4KICAgIDxhbmltYXRlTW90aW9uIGJlZ2luPSIwcyIgZHVyPSI3LjJzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+CiAgICAgIDxtcGF0aCBocmVmPSIjbWFwMiIvPgogICAgPC9hbmltYXRlTW90aW9uPgogIDwvY2lyY2xlPgogIDxjaXJjbGUgcj0iMyIgZmlsbD0ibGlnaHRjb3JhbCIgdHJhbnNmb3JtPSIiIGQ9Ik0gMCA3NiBMIDEwNCA3NiBMIDEwNCA3MDQgTCAwIDcwNCBMIDAgNzYgWiI+CiAgICA8YW5pbWF0ZU1vdGlvbiBiZWdpbj0iMHMiIGR1cj0iNy4xcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPgogICAgICA8bXBhdGggaHJlZj0iI21hcDIiLz4KICAgIDwvYW5pbWF0ZU1vdGlvbj4KICA8L2NpcmNsZT4KICA8Y2lyY2xlIHI9IjMiIGZpbGw9Im9yYW5nZSIgdHJhbnNmb3JtPSIiIGQ9Ik0gMCA3NiBMIDEwNCA3NiBMIDEwNCA3MDQgTCAwIDcwNCBMIDAgNzYgWiI+CiAgICA8YW5pbWF0ZU1vdGlvbiBiZWdpbj0iMHMiIGR1cj0iNS44cyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPgogICAgICA8bXBhdGggaHJlZj0iI21hcDIiLz4KICAgIDwvYW5pbWF0ZU1vdGlvbj4KICA8L2NpcmNsZT4KICA8Y2lyY2xlIHI9IjMiIGZpbGw9InJlZCIgdHJhbnNmb3JtPSIiIGQ9Ik0gMCA3NiBMIDEwNCA3NiBMIDEwNCA3MDQgTCAwIDcwNCBMIDAgNzYgWiI+CiAgICA8YW5pbWF0ZU1vdGlvbiBiZWdpbj0iMHMiIGR1cj0iNi40cyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPgogICAgICA8bXBhdGggaHJlZj0iI21hcDIiLz4KICAgIDwvYW5pbWF0ZU1vdGlvbj4KICA8L2NpcmNsZT4KICA8Y2lyY2xlIHI9IjMiIGZpbGw9Im1lZGl1bWJsdWUiIHRyYW5zZm9ybT0iIiBkPSJNIDAgNzYgTCAxMDQgNzYgTCAxMDQgNzA0IEwgMCA3MDQgTCAwIDc2IFoiPgogICAgPGFuaW1hdGVNb3Rpb24gYmVnaW49IjBzIiBkdXI9IjYuNXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj4KICAgICAgPG1wYXRoIGhyZWY9IiNtYXAyIi8+CiAgICA8L2FuaW1hdGVNb3Rpb24+CiAgPC9jaXJjbGU+CiAgPGNpcmNsZSByPSIzIiBmaWxsPSJhcXVhbWFyaW5lIiB0cmFuc2Zvcm09IiIgZD0iTSAwIDc2IEwgMTA0IDc2IEwgMTA0IDcwNCBMIDAgNzA0IEwgMCA3NiBaIj4KICAgIDxhbmltYXRlTW90aW9uIGJlZ2luPSIwcyIgZHVyPSI2LjhzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+CiAgICAgIDxtcGF0aCBocmVmPSIjbWFwMiIvPgogICAgPC9hbmltYXRlTW90aW9uPgogIDwvY2lyY2xlPgogIDxjaXJjbGUgcj0iMyIgZmlsbD0iZm9yZXN0Z3JlZW4iIHRyYW5zZm9ybT0iIiBkPSJNIDAgNzYgTCAxMDQgNzYgTCAxMDQgNzA0IEwgMCA3MDQgTCAwIDc2IFoiPgogICAgPGFuaW1hdGVNb3Rpb24gYmVnaW49IjBzIiBkdXI9IjYuMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj4KICAgICAgPG1wYXRoIGhyZWY9IiNtYXAyIi8+CiAgICA8L2FuaW1hdGVNb3Rpb24+CiAgPC9jaXJjbGU+Cjwvc3ZnPgo=",
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
              <div className="from-bgc to-bgc animate-pulse bg-gradient-to-r via-teal-900 text-center leading-normal tracking-normal hs-removing:-translate-y-full">
                <div className="mx-auto max-w-full px-4 py-1 sm:px-6 lg:px-8">
                  <div className="">
                    <span className=" text-xs font-bold  text-white lg:text-lg">
                      <strong className="text-amber-600"> Win </strong>
                      the Race → Get{" "}
                      <strong className="text-amber-600">5 Free</strong> Credits
                      →<strong className="text-amber-600"> Swap</strong>{" "}
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
            </>
          );
        } else {
          return <></>;
        }
      })()}
      <div className="container my-5 mx-auto ">
        <section className="bg-transparent ">
          <div className="mx-auto grid max-w-full p-8 lg:grid-cols-12 lg:gap-8 lg:py-16 xl:gap-0">
            <div className="mr-auto place-self-center tracking-tight lg:col-span-8 ">
              <h1 className=" mb-4  max-w-2xl from-sky-400 text-justify text-4xl font-extrabold leading-none tracking-tight text-teal-600 md:text-5xl xl:text-6xl ">
                Welcome to OnChain Races!
              </h1>
              <p className="text-md mb-6 max-w-2xl text-justify  font-light  leading-relaxed tracking-tight text-slate-300 md:text-lg lg:mb-8 lg:text-xl ">
                Real-Time Excitement and Rewards on the Polygon! Get credits and
                join thrilling races. In races where a total of 10 racers
                compete in a race, your speeds change completely randomly,
                offering an on-chain experience in each race. The blue 3
                checkpoints on the map are lines that alter your vehicle's
                speed. The winners not only become the owner of the map but also
                receive 5 credit rewards. You can use these credits to join
                another races or Swap them to MATIC.{" "}
              </p>
              <div className="mt-auto flex flex-wrap pt-3 text-xs">
                <Link to={`/credit/`}>
                  <a
                    href=""
                    className="text-md justify-left mx-0.5 mr-3  inline-flex items-center rounded-lg border border-solid border-slate-500/30 py-3  px-4  text-base font-medium  text-slate-300 shadow-sm  hover:shadow-slate-500"
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
                            <div className="mx-auto max-w-2xl lg:max-w-4xl">
                              <figure>
                                <blockquote className="animate-pulse p-4 text-center text-lg font-semibold  text-teal-600 sm:text-xl sm:leading-9">
                                  <div className=" row-start-2 inline-flex animate-pulse items-center  pl-2 pr-2 lg:pl-1 lg:pr-1  ">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth="1.5"
                                      stroke="currentColor"
                                      className="mr-2 h-5 w-5 text-teal-600 lg:h-7  lg:w-7"
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
                            <table className="mt-3 w-full text-center text-sm text-gray-500">
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
                                <tr className="content-end border-b">
                                  <td
                                    scope="row"
                                    className="whitespace-nowrap px-6 py-2 font-medium"
                                  ></td>
                                  <td className="px-6 py-1"></td>
                                  <td className="px-6 py-1 text-center"></td>
                                </tr>
                              </tbody>
                            </table>
                            <div className="mt-auto  flex flex-wrap pt-3 text-xs">
                              <div className="grid   w-full grid-cols-1 divide-x divide-gray-900/5">
                                <Link to={`/Race/${getSupply}`}>
                                  <a className="text-md  flex items-center justify-center p-3 text-slate-100">
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
                OnChain Races is empowered with
                <a
                  className="text-sky-600 after:content-['↗_']"
                  href="https://docs.chain.link/vrf/v2/introduction"
                  rel="noreferrer"
                  target="_blank"
                >
                  {" "}
                  Chainlink VRF (VERIFIABLE RANDOM FUNCTION)
                </a>
                for unforgettable racing experiences. Chainlink VRF is an Oracle
                solution that enables transparent and fair random speed
                calculations. When our racers pass the blue 3 points on the map,
                Chainlink VRF's reliable data comes into play, changing their
                speeds randomly. This integration ensures fair races and
                real-time excitement.
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

            <div className="  mx-x-auto from-bgc/50 max-w-full rounded-2xl  border border-solid border-slate-500/20 bg-gradient-to-b shadow-2xl duration-300 hover:scale-105 lg:col-span-4 lg:mt-0">
              <>
                <div className="h-100 flex  w-full items-center justify-center ">
                  <img className={""} src={imageHero} />
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
        <section className="rounded-xl bg-teal-500/5 shadow-2xl">
          <div className="mx-auto grid max-w-full p-8 ">
            <div className="mx-auto max-w-full ">
              <dl className="grid grid-cols-1  gap-y-16 text-center lg:grid-cols-2">
                <div className="mx-auto flex max-w-md flex-col gap-y-6">
                  <dt className="leading-7 text-slate-100">
                    <p className="mt-6 text-justify text-sm  leading-8 text-slate-300 lg:text-lg">
                      The Season 1 map has{" "}
                      <strong className="text-teal-600">3</strong> speed
                      check-points in total. There are{" "}
                      <strong className="text-teal-600">5</strong> light
                      corners, <strong className="text-teal-600">7</strong>{" "}
                      sharp corners,{" "}
                      <strong className="text-teal-600">3</strong> fast corners,
                      <strong className="text-teal-600">5</strong> short
                      straights, and{" "}
                      <strong className="text-teal-600">1</strong> long straight
                      in this map.
                    </p>
                  </dt>
                  <dd className="order-first text-2xl font-semibold tracking-normal text-slate-100 sm:text-4xl">
                    OnChain Races: Season #1
                  </dd>
                </div>
                <div className="mx-auto flex max-w-full flex-col gap-y-6">
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                    <img
                      className="w-full rounded-lg duration-300 hover:scale-110"
                      src="season1.svg"
                      alt="season 1"
                    />
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
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
                    the same address more than once (Exept Beta).
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
