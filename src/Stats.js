import { useParams } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import { styled } from "@mui/material/styles";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { useMemo } from "react";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary
}));
const useStyles = makeStyles({});


const All = () => {
    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);
    let [resultData, setResultData] = useState(null);
    let [resultWinData, setResultWinData] = useState([]);
    let [resultAllData, setResultAllData] = useState([]);
    const [minValues, setMinValues] = useState({});
    const [getSupply, setSupply] = useState(null);
    const [resultArrayWin, setResultArrayWin] = useState([]);
    const [hiddenDiv, setHiddenDiv] = useState(String("hidden"));
    const [filteredData, setFilteredData] = useState([]); 

    const columns = useMemo(
        () => [
            {
                accessorKey: "0",
                header: "Address",
                size: 150
            },
            {
                accessorKey: "1",
                header: "Ticket Number",
                size: 150
            },
            {
                accessorKey: "2", 
                header: "Map ID",
                size: 200
            },
            {
                accessorKey: "3",
                header: "Color",
                size: 150
            },
            {
                accessorKey: "4",
                header: "Total Time",
                size: 150
            },
            {
                accessorKey: "5",
                header: "Sector 0",
                size: 150
            },
            {
                accessorKey: "6",
                header: "Sector 1",
                size: 150
            },
            {
                accessorKey: "7",
                header: "Sector 2",
                size: 150
            },
            {
                accessorKey: "8",
                header: "Sector 3",
                size: 150
            }
        ],
        []
    );


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


    useEffect(() => {
        if (resultWinData && resultWinData.length !== null) {
            let updatedResultArrayWin = [];
            const maxIterations = Math.min(resultWinData.length, 10);
            for (let i = 0; i < maxIterations; i++) {
                const walletAddress = resultWinData[i][0];
                const wonMaps = resultWinData[i][1];
                updatedResultArrayWin.push({
                    walletAddress: walletAddress,
                    wonMaps: wonMaps.length
                });
            }
            updatedResultArrayWin.sort((a, b) => b.wonMaps - a.wonMaps);
            setResultArrayWin(updatedResultArrayWin);
        }
    }, [resultWinData]);


    useEffect(() => {
        if (resultAllData !== null) {
          let filteredData = resultAllData.filter(curr => curr[2] !== getSupply);
          if (getSupply % 10 == 0) {
             filteredData = resultAllData;
             setFilteredData(filteredData);
          }
          setFilteredData(filteredData);
        
        }
      }, [resultAllData, getSupply]);

      useEffect(() => {
        if (resultAllData !== null) {
          const filteredData = resultAllData.filter(curr => curr[2] !== getSupply);
    
          if (getSupply % 10 == 0) {
            let filteredData = resultAllData;
            setMinValues(filteredData);
         }
          const groupedData = filteredData.reduce((acc, curr) => {
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
      }, [resultAllData, getSupply]);

    const themeX = createTheme({
        palette: {
            mode: 'dark'
        },
    });

    return (
        <>
            {(() => {
                if (blockchain.account !== null) {
                    return (

                        <div className="my-6 container mx-auto "  >

                            <div className="container mx-auto bg-[#1b1b1b]/40 rounded-2xl">
                                <div className="  text-center  shadow-2xl  p-3 rounded-2xl border-solid     lg:mt-0 lg:col-span-5   w-full ">
                                    <div className="mr-auto place-self-center lg:col-span-8">
                                        <h1 className=" text-justify   text-slate-300   max-w-2xl mb-4 text-sm lg:text-2xl  font-extrabold tracking-tight leading-none ">
                                            All Race Data:
                                        </h1>
                                        <hr className="h-px mb-5 bg-slate-200/20 border-0 " />
                                    </div>
                                    <ThemeProvider theme={themeX}>
                                        <MaterialReactTable
                                            columns={columns}
                                            data={filteredData}
                                            experimentalFeatures={{ clipboardPaste: true }}
                                            enableStickyHeader
                                            initialState={{ density: 'compact' }}
                                        />
                                    </ThemeProvider>
                                </div>
                            </div>

                            <div className="container mt-5 mx-auto bg-[#1b1b1b]/40 rounded-2xl ">
                                <div className="  text-center  shadow-2xl  p-3 border-solid     lg:mt-0 lg:col-span-5   w-full ">
                                    <div className="mr-auto place-self-center lg:col-span-8">
                                        <h1 className=" text-justify   text-slate-300   max-w-2xl mb-4 text-sm lg:text-2xl  font-extrabold tracking-tight leading-none ">
                                            All Race Data:
                                        </h1>
                                        <hr className="h-px mb-5 bg-slate-200/20 border-0 " />
                                        <table className="rounded-lg  w-full lg:text-sm text-xs   text-left  " style={{ userSelect: 'text' }}>
                                            <thead className=" text-slate-300  uppercase">
                                                <tr>
                                                    <th scope="col" className="  px-1 py-3">
                                                        Race ID
                                                    </th>
                                                    <th scope="col" className=" text-center   py-3 px-1">
                                                         Winner Address
                                                    </th>
                                                    <th scope="col" className="  py-3 px-1">
                                                        Time
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.entries(minValues).map(
                                                    ([key, { value, name }]) => (
                                                        <tr key={key}>
                                                            <td className="  px-1 py-2 font-light underline text-slate-400   whitespace-nowrap">
                                                                {" "}
                                                                <Link to={`/Race/${key}`}>
                                                                   #{key}{" "}
                                                                </Link>
                                                            </td>
                                                            <td className="   text-center  px-1 py-2 font-light underline text-slate-400  whitespace-nowrap">
                                                                <Link to={`/Address/${name}`}>
                                                                    {name}
                                                                </Link>
                                                            </td>
                                                            <td className="  px-1 py-2 font-light text-slate-400  whitespace-nowrap">
                                                                {" "}
                                                                {value}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                </div>
                            </div>

                            <div className="container mt-5 mx-auto bg-[#1b1b1b]/40 rounded-2xl ">
                                <div className="  text-center  shadow-2xl  p-3 border-solid     lg:mt-0 lg:col-span-5   w-full ">
                                    <div className="mr-auto place-self-center lg:col-span-8">
                                        <h1 className=" text-justify   text-slate-300   max-w-2xl mb-4 text-sm lg:text-2xl  font-extrabold tracking-tight leading-none ">
                                            Top 10 Players:
                                        </h1>
                                        <hr className="h-px mb-5 bg-slate-200/20 border-0 " />
                                        <table className="rounded-lg  w-full lg:text-sm text-xs    " style={{ userSelect: 'text' }}>
                                            <thead className=" text-slate-300  uppercase">
                                                <tr>
                                                       <th scope="col" className="  px-2 py-2">
                                                        #
                                                    </th>
                                                    <th scope="col" className=" text-center   py-3 px-2">
                                                         Winner Address
                                                    </th>
                                                         <th scope="col" className="  px-2 py-3">
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
                                                            <td className="  px-2 py-2 font-light  text-slate-400   whitespace-nowrap">
                                                                    {index + 1}
                                                                </td>
                                                                <Link to={`/Address/${item.walletAddress}`}>
                                                            <td className="   text-center px-2 py-2 font-light underline text-slate-400  whitespace-nowrap">
                                                                        {item.walletAddress}
                                                                    </td>
                                                                </Link>
                                                            <td className="  px-2 py-2 font-light text-slate-400  whitespace-nowrap">
                                                                    {item.wonMaps}
                                                                </td>
                                                            </tr>
                                                        </React.Fragment>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>

                                </div>
                            </div>

                        </div>
                    );
                } else {
                    return (
                        <div className="container mx-auto mt-10">
                        <div className="   text-center  shadow-2xl  rounded-2xl border-solid  border border-slate-500/20   lg:mt-0 lg:col-span-5 ">
                        <div className=" animate-pulse py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
                            <div className=" row-start-2 inline-flex animate-pulse items-center  text-amber-300  ">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="h-5 w-5 text-amber-300  lg:h-7  lg:w-7"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                                />
                              </svg>
                              <p className="text-md  grid text-center lg:text-2xl ">
                                <span className=" ml-2   text-center font-bold ">
                                  {" "}
                                  Please Connect Your Wallet
                                </span>
                              </p>
                            </div>                      </div>
                      </div>
                      </div>
                    );
                }
            })()}


        </>
    );
};

export default All;
