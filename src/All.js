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
          console.log(result);
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
          console.log(result2);
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
      <div className="container my-5 mx-auto ">
        <div class="container mx-auto grid grid-cols-1 gap-4 p-6 lg:grid-cols-6">
          <div class=" col-span-4 flex flex-col border-2 bg-transparent p-4">
            <h1 className=" mb-4  max-w-2xl from-sky-400 text-justify text-4xl font-extrabold leading-none tracking-tight text-teal-600 md:text-5xl xl:text-6xl ">
              Welcome to OnChain Race!
            </h1>
            <p className="text-md mb-6 max-w-2xl text-justify  font-light  leading-relaxed tracking-tight text-slate-300 md:text-lg lg:mb-8 lg:text-xl ">
              Real-Time Excitement and Rewards on the Polygon! Get credits and
              join thrilling races. In races where a total of 10 racers compete
              in a race, your speeds change completely randomly, offering an
              on-chain experience in each race. The blue 3 checkpoints on the
              map are lines that alter your vehicle's speed. The winners not
              only become the owner of the map but also receive 2 credit
              rewards. You can use these valuable credits to enhance your races
              or swap them to MATIC.{" "}
            </p>
            <div class="mt-auto flex flex-wrap pt-3 text-xs">
              <Link to={`/credit/`}>
                <a
                  href=""
                  className="text-md justify-left mx-0.5 mr-3  inline-flex items-center rounded-lg border border-solid border-slate-500/30 py-3  px-4  text-base font-medium  text-slate-300 shadow-sm  hover:shadow-slate-500"
                >
                  Get Credit and Play !
                </a>
              </Link>
            </div>
          </div>

          {(() => {
            if (blockchain.account == null) {
              return (
                <>
                  <div className=" mx-x-auto  from-bgc/50 col-span-2 flex max-w-full  flex-col rounded-2xl  border-2 border-solid border-slate-500/20 bg-transparent bg-gradient-to-b shadow-2xl  ">
                    <section>
                      <div className="mx-auto max-w-2xl lg:max-w-4xl">
                        <figure>
                          <blockquote className="mt-5 animate-pulse text-center text-xl font-semibold leading-8 text-teal-600 sm:text-2xl sm:leading-9">
                            <div className=" row-start-2 inline-flex animate-pulse items-center    ">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                className="h-5 w-5 text-teal-600 lg:h-7  lg:w-7"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                                />
                              </svg>
                              <p className="text-md  grid text-center lg:text-xl ">
                                <span className=" ml-2   text-center font-bold ">
                                  {" "}
                                  Please Connect Your Wallet
                                </span>
                              </p>
                            </div>
                          </blockquote>
                        </figure>
                      </div>
                    </section>
                  </div>
                </>
              );
            } else {
              return (
                <>
                  <div class=" mx-x-auto  from-bgc/50 col-span-2 flex max-w-full  flex-col rounded-2xl  border-2  border-solid border-slate-500/20 bg-transparent bg-gradient-to-b shadow-2xl ">
                    <p className=" animate-pulse  py-2  text-center text-lg tracking-tight text-teal-600">
                      OnChainRace #{String(getSupply)}: Waiting to Players{" "}
                    </p>
                    <hr className="h-px  border-0 bg-slate-200/20 " />
                    <table className="mt-3 w-full text-center text-sm text-gray-500  ">
                      <thead className="text-sm uppercase  text-gray-400  ">
                        <tr>
                          <th scope="col" className="">
                            Color
                          </th>
                          <th scope="col" className="">
                            Player ID
                          </th>
                          <th scope="col" className="">
                            Wallet Address
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {resultData &&
                          resultData.length !== null &&
                          resultData.map((item, index) => (
                            <React.Fragment key={index}>
                              <tr className=" border-b ">
                                <th
                                  scope="row"
                                  className="whitespace-nowrap px-6 py-2 font-medium "
                                >
                                  <text className={`text-${colors[index]}`}>
                                    {" "}
                                    ⬤{" "}
                                  </text>
                                </th>
                                <td className="px-2 py-2 lg:px-6">
                                  {`Player #${index + 1}`}
                                </td>
                                <td className="px-2 py-2 lg:px-6 ">
                                  {`${trunceString(item)}`}
                                </td>
                              </tr>
                            </React.Fragment>
                          ))}
                        <tr className=" content-end  border-b">
                          <th
                            scope="row"
                            className="whitespace-nowrap px-6 py-2  font-medium"
                          ></th>
                          <td className="px-6 py-1"></td>
                          <td className="px-6 py-1 text-center"></td>
                        </tr>
                      </tbody>
                    </table>
                    <div class="mt-auto  flex flex-wrap pt-3 text-xs">
                      <div class="grid   w-full grid-cols-1 divide-x divide-gray-900/5">
                        <Link to={`/Race/${getSupply}`}>
                          <a class="text-md  flex items-center justify-center p-3 text-slate-100 text-gray-900 ">
                            Go to Last Race
                            <svg
                              className="ml-2 -mr-1 h-3 w-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                clip-rule="evenodd"
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
        <section className="bg-transparent ">
          <div className="mx-auto grid max-w-full p-8 lg:grid-cols-12 lg:gap-8 lg:py-16 xl:gap-0">
            <div className="mr-auto place-self-center tracking-tight lg:col-span-8 ">
              <h1 className=" mb-4  max-w-2xl from-sky-400 text-justify text-4xl font-extrabold leading-none tracking-tight text-teal-600 md:text-5xl xl:text-6xl ">
                Fully-OnChain!
              </h1>
              <p className="font-tight mb-6 max-w-2xl  text-justify font-light leading-relaxed text-slate-300 md:text-lg lg:mb-8 lg:text-xl ">
                OnChain Race is empowered with
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
                  className="text-md justify-left mx-0.5 mr-3  inline-flex items-center rounded-lg border border-solid border-slate-500/30 py-3  px-4  text-base font-medium  text-slate-300 shadow-sm  hover:shadow-slate-500"
                >
                  Get Credit and Play !
                </a>
              </Link>
            </div>

            <div className="  mx-x-auto from-bgc/50 max-w-full rounded-2xl  border border-solid border-slate-500/20 bg-gradient-to-b shadow-2xl duration-300 hover:scale-105 lg:col-span-4 lg:mt-0">
              <>
                <div className="h-100 flex w-full  items-center justify-center">
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
                      <h1 className=" mb-4 max-w-2xl text-justify text-4xl font-extrabold leading-none tracking-tight text-transparent text-teal-500/80 md:text-5xl xl:text-6xl ">
                        OnChainRace Table{" "}
                      </h1>
                    </div>
                    <div className="  mx-x-auto from-bgc/50 max-w-full rounded-2xl  border border-solid border-slate-500/20 bg-gradient-to-b shadow-2xl duration-300 hover:scale-105 lg:col-span-4 lg:mt-0 ">
                      <>
                        <div className="h-100 flex w-full  items-center justify-center">
                          <table className=" w-full text-left  text-sm  ">
                            <thead className="text-sm font-bold uppercase text-gray-400 underline  underline-offset-2">
                              <tr>
                                <th scope="col" className="px-6 py-3">
                                  Race ID
                                </th>
                                <th scope="col" className="py-3 px-6">
                                  Winner
                                </th>
                                <th scope="col" className="py-3 px-6">
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
                                      <td className="whitespace-nowrap px-6 py-2 font-light text-teal-500/60 underline decoration-dashed underline-offset-2">
                                        <Link to={`/Race/${key}`}>
                                          OnChainRace #{key}{" "}
                                        </Link>
                                      </td>
                                      <td className="whitespace-nowrap px-6 py-2 font-light text-teal-500/60 underline decoration-dashed underline-offset-2">
                                        <Link to={`/Address/${name}`}>
                                          {trunceString(name)}
                                        </Link>
                                      </td>
                                      <td className="whitespace-nowrap px-6 py-2 font-light text-gray-500">
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
                      <h1 className=" mb-4 max-w-2xl text-justify text-4xl font-extrabold leading-none tracking-tight  text-teal-500/80 md:text-5xl xl:text-6xl ">
                        Top 10
                      </h1>
                    </div>
                    <div className="  mx-x-auto from-bgc/50 max-w-full rounded-2xl  border border-solid border-slate-500/20 bg-gradient-to-b shadow-2xl duration-300 hover:scale-105 lg:col-span-4 lg:mt-0 ">
                      <>
                        <div className="h-100 flex w-full  items-center justify-center">
                          <table className="w-full text-left  text-sm  ">
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
        <section class="bg-transparent dark:bg-gray-900">
          <div class="container mx-auto px-6 py-12">
            <h1 class="mb-8 text-4xl font-extrabold tracking-tight text-teal-600">
              Frequently asked questions.
            </h1>
            <div class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:mt-16 xl:grid-cols-3">
              <div>
                <div>
                  <h1 class="text-xl font-semibold text-gray-400 dark:text-white">
                    {" "}
                    What is the OnChain Race ?
                  </h1>
                  <p class="text-md mt-2  text-justify leading-6 text-gray-500 ">
                    OnChain Race is a Fully On-Chain and Chance-Based racing
                    game available on the Polygon.
                  </p>
                </div>
              </div>
              <div>
                <h1 class="text-xl font-semibold text-gray-400 dark:text-white">
                  What are the Rules of the Game?
                </h1>
                <ul className="list-disc   text-justify  leading-6 tracking-tight text-gray-500 antialiased ">
                  <li className=" mb-3 mt-3">
                    First of all, the player buys credits to participate in the
                    last race.
                  </li>
                  <li className="mb-3 mt-3">
                    Participates in the last race with purchased credits and
                    spends one credit.
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
                    won race as NFT and get free 2 credits. If the racer wishes,
                    racers can claim NFT later.{" "}
                  </li>
                  <li className="mb-3 mt-3">
                    The racer can participate in new races with two free credits
                    or swap these credits for MATIC on the Swap page (if there
                    are enough MATICs in the pool).{" "}
                  </li>
                  <li className="mb-3 mt-3">
                    If a swap is made, the rate of 1 Credit = 0.5 MATIC will
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
                <h1 class="text-xl font-semibold text-gray-400 dark:text-white">
                  How to Random Numbers Generate ?
                </h1>
                <p class="text-md mt-2   text-justify  leading-6  tracking-tight text-gray-500 ">
                  When the racers joins a race for the first time, a seed value
                  is assigned to him wholly and randomly within the contract.
                  <a
                    class="text-sky-400/60 after:content-['↗_']"
                    href="https://docs.chain.link/vrf/v2/introduction"
                    rel="noreferrer"
                    target="_blank"
                  >
                    {" "}
                    Chainlink VRF
                  </a>
                  assigns this value to generate random numbers in all races.
                  Racers can change their seed numbers by spending two credits.
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
