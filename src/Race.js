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
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { makeStyles } from "@mui/styles";
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

const Race = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [xNft, setxNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [resultMapIdTicket, setResultMapIdTicket] = useState(String(""));
  const [raceImg, setRaceImg] = useState(null);
  let [getCredit, setGetCredit] = useState(null);
  const [resultLastMapTicket, setResultLastMapTicket] = useState(String(0));
  let [raceMap, setRaceMap] = useState(
    String(
      "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDUgMTIwMCA3MDAiIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjcwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNMCAzaDEyMDB2NzAzLjc2N0gwVjNaIiBmaWxsPSIjMTExNzI4Ii8+CiAgPHBhdGggZmlsbD0ibm9uZSIgZD0iTTY5My40MDYgMzU1Ljk3czE4Mi42NDQtLjA2OCAyOTUuMjQ0IDBjNDkuNDk5LjAzIDgxLjUzMS0zOS44NTIgODEuNTEtNTguMzk4LS44MzMtNDguMDMxLTUyLjUxMS0yOS4zOTQtNzAuMTYtODMuNTU0LTE2LjMwNy01MC4wNDEgNC4zNDYtNzcuOTY5LTM4LjEwMy03OS42MTEtNDEuODc2LTEuNjItMjI1LjYxNC40NjktMjI1LjYxNC40NjktLjAxOC0uMDY1LTkwLjE1Ny0xNi40MjUtNzUuODkgNTMuNjYgNy4zMDIgMzUuODc4IDQ2LjE3OSAzMC43MDkgNDYuMTc5IDMwLjcwOXM0MC42NC02LjY4OCA5Mi42MTItNS42NTFjMzEuNjEyLjYzIDgzLjU3MyA1LjMxNSAxMTMuNTgzIDIyLjg3IDI1LjIxNiAxNC43NTEgNDUuNzc0IDMxLjMyMSAzNC41MDEgNTYuMzEyLTEyLjczNiAyOC4yMzQtNTkuNzM0IDMxLjA2My03OC4yMTUgMzEuMDYzIi8+CiAgPHBhdGggZmlsbD0ibm9uZSIgZD0iTTg2OS4wNTMgMzIzLjgwNmMtNDAuMjI4IDAtOTYuODc4LjU2MS05Ni44NzguNTYxLTE3LjMzOSAwLTE1MC41My0uNTYxLTIxOS41MjgtLjU2MS00Mi43MDUgMC0yNi40MTYtNjcuMTM3LTI3LjQ4NC0xMTAuNDI2LS4yMi04Ljg5NyAxMS4xNDMtNjMuMDUgNjUuNDk4LTIwLjM1MSAyMy44NTMgMTguNzM5IDQyLjM2MS0zMi4yMDYgMTguMDc0LTQ0LjAyNS0yNC44MjEtMTIuMDgtNDIuNTUtMjAuNjYyLTg3LjU5LTkuMjExLTUyLjI0NCAxMy4yODMtOC4zNjggOTguMzg2LTMyLjE0MyAxMzQuMTU2LTM3LjIgNTUuOTctNDguODI4IDUwLjM2MS0yNjAuMDU2IDUwLjM2MS01MS4xNzUgMC01Mi4xMy01NS40MTMtMjguOTQ2LTEyNC4zMSAxMC41NzUtMzEuNDI2IDcwLjMxLTU3LjY1NyA3OS43MzggMCAxMC42NjcgNjUuMjM2IDkuODkzIDc0LjU5NSAzOS4yNjIgOTMuNjMyIDMyLjE5NSAyMC44NjkgODQuMjkxLTgzLjE5MiA4MS0xMzkuMzc1LTEuMjU5LTIxLjQ4OS0xNi43ODktMTkuODUtNDUuNjg3LTE5Ljg1Ii8+CiAgPHBhdGggZmlsbD0ibm9uZSIgZD0iTTM1NSAxMzQuNDA3Yy0zMS4zNjEgMC0xMzMuMzQ2LS4yOTUtMTU3LjI5NC4wNTctMTYuODc4LjI0OC05Ny43MDYtLjA1Ny05Ny43MDYgMjkuMDMydjEwNy43MWMwIDg0LjU4MSAwIDg0LjU4MSAyNy4zMiA4NC41ODFtMCAuMTE4QzE5OS41ODIgMzU1LjczMyA3MDAgMzU2IDcwMCAzNTYiLz4KICA8ZyBzdHJva2UtbGluZWpvaW49InJvdW5kIiBmaWxsPSJub25lIj4KICAgIDxwYXRoIGQ9Ik02OTMuNDA2IDM1NS45N3MxODIuNjQ0LS4wNjggMjk1LjI0NCAwYzQ5LjQ5OS4wMyA4MS41MzEtMzkuODUyIDgxLjUxLTU4LjM5OC0uODMzLTQ4LjAzMS01Mi41MTEtMjkuMzk0LTcwLjE2LTgzLjU1NC0xNi4zMDctNTAuMDQxIDQuMzQ2LTc3Ljk2OS0zOC4xMDMtNzkuNjExLTQxLjg3Ni0xLjYyLTIyNS42MTQuNDY5LTIyNS42MTQuNDY5LS4wMTgtLjA2NS05MC4xNTctMTYuNDI1LTc1Ljg5IDUzLjY2IDcuMzAyIDM1Ljg3OCA0Ni4xNzkgMzAuNzA5IDQ2LjE3OSAzMC43MDlzNDAuNjQtNi42ODggOTIuNjEyLTUuNjUxYzMxLjYxMi42MyA4My41NzMgNS4zMTUgMTEzLjU4MyAyMi44NyAyNS4yMTYgMTQuNzUxIDQ1Ljc3NCAzMS4zMjEgMzQuNTAxIDU2LjMxMi0xMi43MzYgMjguMjM0LTU5LjczNCAzMS4wNjMtNzguMjE1IDMxLjA2MyIgc3Ryb2tlPSIjZTEyYjUxIiBzdHJva2Utd2lkdGg9IjI0Ii8+CiAgICA8cGF0aCBkPSJNNjkzLjQwNiAzNTUuOTdzMTgyLjY0NC0uMDY4IDI5NS4yNDQgMGM0OS40OTkuMDMgODEuNTMxLTM5Ljg1MiA4MS41MS01OC4zOTgtLjgzMy00OC4wMzEtNTIuNTExLTI5LjM5NC03MC4xNi04My41NTQtMTYuMzA3LTUwLjA0MSA0LjM0Ni03Ny45NjktMzguMTAzLTc5LjYxMS00MS44NzYtMS42Mi0yMjUuNjE0LjQ2OS0yMjUuNjE0LjQ2OS0uMDE4LS4wNjUtOTAuMTU3LTE2LjQyNS03NS44OSA1My42NiA3LjMwMiAzNS44NzggNDYuMTc5IDMwLjcwOSA0Ni4xNzkgMzAuNzA5czQwLjY0LTYuNjg4IDkyLjYxMi01LjY1MWMzMS42MTIuNjMgODMuNTczIDUuMzE1IDExMy41ODMgMjIuODcgMjUuMjE2IDE0Ljc1MSA0NS43NzQgMzEuMzIxIDM0LjUwMSA1Ni4zMTItMTIuNzM2IDI4LjIzNC01OS43MzQgMzEuMDYzLTc4LjIxNSAzMS4wNjMiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLWRhc2hhcnJheT0iMjYgMjYiIHN0cm9rZS13aWR0aD0iMjQiLz4KICAgIDxwYXRoIGQ9Ik02OTMuNDA2IDM1NS45N3MxODIuNjQ0LS4wNjggMjk1LjI0NCAwYzQ5LjQ5OS4wMyA4MS41MzEtMzkuODUyIDgxLjUxLTU4LjM5OC0uODMzLTQ4LjAzMS01Mi41MTEtMjkuMzk0LTcwLjE2LTgzLjU1NC0xNi4zMDctNTAuMDQxIDQuMzQ2LTc3Ljk2OS0zOC4xMDMtNzkuNjExLTQxLjg3Ni0xLjYyLTIyNS42MTQuNDY5LTIyNS42MTQuNDY5LS4wMTgtLjA2NS05MC4xNTctMTYuNDI1LTc1Ljg5IDUzLjY2IDcuMzAyIDM1Ljg3OCA0Ni4xNzkgMzAuNzA5IDQ2LjE3OSAzMC43MDlzNDAuNjQtNi42ODggOTIuNjEyLTUuNjUxYzMxLjYxMi42MyA4My41NzMgNS4zMTUgMTEzLjU4MyAyMi44NyAyNS4yMTYgMTQuNzUxIDQ1Ljc3NCAzMS4zMjEgMzQuNTAxIDU2LjMxMi0xMi43MzYgMjguMjM0LTU5LjczNCAzMS4wNjMtNzguMjE1IDMxLjA2MyIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjE5Ii8+CiAgICA8cGF0aCBkPSJNODY5LjA1MyAzMjMuODA2Yy00MC4yMjggMC05Ni44NzguNTYxLTk2Ljg3OC41NjEtMTcuMzM5IDAtMTUwLjUzLS41NjEtMjE5LjUyOC0uNTYxLTQyLjcwNSAwLTI2LjQxNi02Ny4xMzctMjcuNDg0LTExMC40MjYtLjIyLTguODk3IDExLjE0My02My4wNSA2NS40OTgtMjAuMzUxIDIzLjg1MyAxOC43MzkgNDIuMzYxLTMyLjIwNiAxOC4wNzQtNDQuMDI1LTI0LjgyMS0xMi4wOC00Mi41NS0yMC42NjItODcuNTktOS4yMTEtNTIuMjQ0IDEzLjI4My04LjM2OCA5OC4zODYtMzIuMTQzIDEzNC4xNTYtMzcuMiA1NS45Ny00OC44MjggNTAuMzYxLTI2MC4wNTYgNTAuMzYxLTUxLjE3NSAwLTUyLjEzLTU1LjQxMy0yOC45NDYtMTI0LjMxIDEwLjU3NS0zMS40MjYgNzAuMzEtNTcuNjU3IDc5LjczOCAwIDEwLjY2NyA2NS4yMzYgOS44OTMgNzQuNTk1IDM5LjI2MiA5My42MzIgMzIuMTk1IDIwLjg2OSA4NC4yOTEtODMuMTkyIDgxLTEzOS4zNzUtMS4yNTktMjEuNDg5LTE2Ljc4OS0xOS44NS00NS42ODctMTkuODUiIHN0cm9rZT0iI2UxMmI1MSIgc3Ryb2tlLXdpZHRoPSIyNCIvPgogICAgPHBhdGggZD0iTTg2OS4wNTMgMzIzLjgwNmMtNDAuMjI4IDAtOTYuODc4LjU2MS05Ni44NzguNTYxLTE3LjMzOSAwLTE1MC41My0uNTYxLTIxOS41MjgtLjU2MS00Mi43MDUgMC0yNi40MTYtNjcuMTM3LTI3LjQ4NC0xMTAuNDI2LS4yMi04Ljg5NyAxMS4xNDMtNjMuMDUgNjUuNDk4LTIwLjM1MSAyMy44NTMgMTguNzM5IDQyLjM2MS0zMi4yMDYgMTguMDc0LTQ0LjAyNS0yNC44MjEtMTIuMDgtNDIuNTUtMjAuNjYyLTg3LjU5LTkuMjExLTUyLjI0NCAxMy4yODMtOC4zNjggOTguMzg2LTMyLjE0MyAxMzQuMTU2LTM3LjIgNTUuOTctNDguODI4IDUwLjM2MS0yNjAuMDU2IDUwLjM2MS01MS4xNzUgMC01Mi4xMy01NS40MTMtMjguOTQ2LTEyNC4zMSAxMC41NzUtMzEuNDI2IDcwLjMxLTU3LjY1NyA3OS43MzggMCAxMC42NjcgNjUuMjM2IDkuODkzIDc0LjU5NSAzOS4yNjIgOTMuNjMyIDMyLjE5NSAyMC44NjkgODQuMjkxLTgzLjE5MiA4MS0xMzkuMzc1LTEuMjU5LTIxLjQ4OS0xNi43ODktMTkuODUtNDUuNjg3LTE5Ljg1IiBzdHJva2U9IiNmZmYiIHN0cm9rZS1kYXNoYXJyYXk9IjI2IDI2IiBzdHJva2Utd2lkdGg9IjI0Ii8+CiAgICA8cGF0aCBkPSJNODY5LjA1MyAzMjMuODA2Yy00MC4yMjggMC05Ni44NzguNTYxLTk2Ljg3OC41NjEtMTcuMzM5IDAtMTUwLjUzLS41NjEtMjE5LjUyOC0uNTYxLTQyLjcwNSAwLTI2LjQxNi02Ny4xMzctMjcuNDg0LTExMC40MjYtLjIyLTguODk3IDExLjE0My02My4wNSA2NS40OTgtMjAuMzUxIDIzLjg1MyAxOC43MzkgNDIuMzYxLTMyLjIwNiAxOC4wNzQtNDQuMDI1LTI0LjgyMS0xMi4wOC00Mi41NS0yMC42NjItODcuNTktOS4yMTEtNTIuMjQ0IDEzLjI4My04LjM2OCA5OC4zODYtMzIuMTQzIDEzNC4xNTYtMzcuMiA1NS45Ny00OC44MjggNTAuMzYxLTI2MC4wNTYgNTAuMzYxLTUxLjE3NSAwLTUyLjEzLTU1LjQxMy0yOC45NDYtMTI0LjMxIDEwLjU3NS0zMS40MjYgNzAuMzEtNTcuNjU3IDc5LjczOCAwIDEwLjY2NyA2NS4yMzYgOS44OTMgNzQuNTk1IDM5LjI2MiA5My42MzIgMzIuMTk1IDIwLjg2OSA4NC4yOTEtODMuMTkyIDgxLTEzOS4zNzUtMS4yNTktMjEuNDg5LTE2Ljc4OS0xOS44NS00NS42ODctMTkuODUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIxOSIvPgogICAgPHBhdGggZD0iTTM1NSAxMzQuNDA3Yy0zMS4zNjEgMC0xMzMuMzQ2LS4yOTUtMTU3LjI5NC4wNTctMTYuODc4LjI0OC05Ny43MDYtLjA1Ny05Ny43MDYgMjkuMDMydjEwNy43MWMwIDg0LjU4MSAwIDg0LjU4MSAyNy4zMiA4NC41ODEiIHN0cm9rZT0iI2UxMmI1MSIgc3Ryb2tlLXdpZHRoPSIyNCIvPgogICAgPHBhdGggZD0iTTM1NSAxMzQuNDA3Yy0zMS4zNjEgMC0xMzMuMzQ2LS4yOTUtMTU3LjI5NC4wNTctMTYuODc4LjI0OC05Ny43MDYtLjA1Ny05Ny43MDYgMjkuMDMydjEwNy43MWMwIDg0LjU4MSAwIDg0LjU4MSAyNy4zMiA4NC41ODEiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLWRhc2hhcnJheT0iMjYgMjYiIHN0cm9rZS13aWR0aD0iMjQiLz4KICAgIDxwYXRoIGQ9Ik0zNTUgMTM0LjQwN2MtMzEuMzYxIDAtMTMzLjM0Ni0uMjk1LTE1Ny4yOTQuMDU3LTE2Ljg3OC4yNDgtOTcuNzA2LS4wNTctOTcuNzA2IDI5LjAzMnYxMDcuNzFjMCA4NC41ODEgMCA4NC41ODEgMjcuMzIgODQuNTgxIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMTkiLz4KICAgIDxwYXRoIGQ9Ik0xMjcuMzIgMzU1LjkwNUMxOTkuNTgyIDM1NS43MzMgNzAwIDM1NiA3MDAgMzU2IiBzdHJva2U9IiNlMTJiNTEiIHN0cm9rZS13aWR0aD0iMjQiLz4KICAgIDxwYXRoIGQ9Ik0xMjcuMzIgMzU1LjkwNUMxOTkuNTgyIDM1NS43MzMgNzAwIDM1NiA3MDAgMzU2IiBzdHJva2U9IiNmZmYiIHN0cm9rZS1kYXNoYXJyYXk9IjI2IDI2IiBzdHJva2Utd2lkdGg9IjI0Ii8+CiAgICA8cGF0aCBkPSJNMTI3LjMyIDM1NS45MDVDMTk5LjU4MiAzNTUuNzMzIDcwMCAzNTYgNzAwIDM1NiIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjE5Ii8+CiAgPC9nPgogIDxwYXRoIHN0eWxlPSJzdHJva2Utd2lkdGg6MDtzdHJva2UtbWl0ZXJsaW1pdDo2O3N0cm9rZS1saW5lY2FwOnNxdWFyZTtmaWxsOnJnYmEoMTEwLDExMCwyNTUsLjQ3KSIgZD0iTTg2NS45NTMgMzE0LjQwNWg3LjA2N3YxOC45MDFoLTcuMDY3di0xOC45MDFaTTM1MS4yMTcgMTI0Ljk0MWg3LjA2N3YxOC45MDFoLTdNMTIzLjczNyAzNDYuNTM4aDcuMDY3djE4LjkwMWgtNy4wNjd2LTE4LjkwMVoiLz4KICA8dGV4dCBmaWxsPSIjZmZmIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI1IiBmb250LXdlaWdodD0iNzAwIiB4PSI1MTAuNjg0IiB5PSI0MTAiIHN0eWxlPSJ3aGl0ZS1zcGFjZTpwcmU7Zm9udC1zaXplOjI1cHgiPiBSYWNlIFJlc3VsdHM8L3RleHQ+CiAgPHRleHQgZmlsbD0iI2ZmZiIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZmlsbC1vcGFjaXR5PSIuNyIgZm9udC1zaXplPSIyNSIgZm9udC13ZWlnaHQ9IjcwMCIgeD0iNDA3IiB5PSI0MzUiPiA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJmaWxsIiB2YWx1ZXM9IndoaXRlO3JlZCIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiLz4KCgpXYWl0aW5nIHRvIDEwIE1vcmUgUGxheWVycy4uLjwvdGV4dD4KICA8cGF0aCBmaWxsPSIjZmZmIiBkPSJNNjg1LjkyNCAzNDYuNDU5aDQuOHY0LjhoLTQuOHoiLz4KICA8cGF0aCBkPSJNNjg1LjkyNCAzNTEuMjU5aDQuOHY0LjhoLTQuOHoiLz4KICA8cGF0aCBmaWxsPSIjZmZmIiBkPSJNNjg1LjkyNCAzNTYuMDU5aDQuOHY0LjhoLTQuOHoiLz4KICA8cGF0aCBkPSJNNjg1LjkyNCAzNjAuODU5aDQuOHY0LjhoLTQuOHptNC44LTE0LjRoNC44djQuOGgtNC44eiIvPgogIDxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik02OTUuNTI0IDM0Ni40NTloNC44djQuOGgtNC44em0tNC44IDQuOGg0Ljh2NC44aC00Ljh6Ii8+CiAgPHBhdGggZD0iTTY5MC43MjQgMzU2LjA1OWg0Ljh2NC44aC00Ljh6Ii8+CiAgPHBhdGggZmlsbD0iI2ZmZiIgZD0iTTY5MC43MjQgMzYwLjg1OWg0Ljh2NC44aC00Ljh6Ii8+CiAgPHBhdGggZD0iTTY5NS41MjQgMzUxLjI1OWg0Ljh2NC44aC00Ljh6Ii8+CiAgPHBhdGggZmlsbD0iI2ZmZiIgZD0iTTY5NS41MjQgMzU2LjA1OWg0Ljh2NC44aC00Ljh6Ii8+CiAgPHBhdGggZD0iTTY5NS41MjQgMzYwLjg1OWg0Ljh2NC44aC00Ljh6Ii8+CiAgPHBhdGggc3R5bGU9InN0cm9rZS13aWR0aDowO3N0cm9rZS1taXRlcmxpbWl0OjY7c3Ryb2tlLWxpbmVjYXA6c3F1YXJlO2ZpbGw6cmdiYSgxMTAsMTEwLDI1NSwuNDcpIiBkPSJNODY1Ljk1MyAzMTQuNDA1aDcuMDY3djE4LjkwMWgtNy4wNjd2LTE4LjkwMVoiLz4KICA8dGV4dCBmaWxsPSIjRjJFQ0ZGIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjM1IiBmb250LXdlaWdodD0iNzAwIiBzdHlsZT0id2hpdGUtc3BhY2U6cHJlIiB4PSIyOS41NjEiPjx0c3BhbiB4PSI0ODQuNTYxIiB5PSI0NSIgc3R5bGU9ImZvbnQtc2l6ZTozNXB4O3dvcmQtc3BhY2luZzowIj5PbkNoYWluIFJhY2U8L3RzcGFuPjwvdGV4dD4KICA8dGV4dCBzdHlsZT0iZmlsbDojZjJlY2ZmO2ZvbnQtZmFtaWx5Om1vbm9zcGFjZTtmb250LXNpemU6MjBweDtmb250LXdlaWdodDo3MDA7d2hpdGUtc3BhY2U6cHJlIiB4PSI0ODguNzIxIiB5PSI3Mi4xNTIiPlNlYXNvbiAxPC90ZXh0Pgo8L3N2Zz4K",
    ),
  );
  let [raceMap2, setRaceMap2] = useState(
    String(
      "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDUgMTIwMCA3MDAiIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjcwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNMCAzaDEyMDB2NzAzLjc2N0gwVjNaIiBmaWxsPSIjMTExNzI4Ii8+CiAgPHBhdGggZmlsbD0ibm9uZSIgZD0iTTY5My40MDYgMzU1Ljk3czE4Mi42NDQtLjA2OCAyOTUuMjQ0IDBjNDkuNDk5LjAzIDgxLjUzMS0zOS44NTIgODEuNTEtNTguMzk4LS44MzMtNDguMDMxLTUyLjUxMS0yOS4zOTQtNzAuMTYtODMuNTU0LTE2LjMwNy01MC4wNDEgNC4zNDYtNzcuOTY5LTM4LjEwMy03OS42MTEtNDEuODc2LTEuNjItMjI1LjYxNC40NjktMjI1LjYxNC40NjktLjAxOC0uMDY1LTkwLjE1Ny0xNi40MjUtNzUuODkgNTMuNjYgNy4zMDIgMzUuODc4IDQ2LjE3OSAzMC43MDkgNDYuMTc5IDMwLjcwOXM0MC42NC02LjY4OCA5Mi42MTItNS42NTFjMzEuNjEyLjYzIDgzLjU3MyA1LjMxNSAxMTMuNTgzIDIyLjg3IDI1LjIxNiAxNC43NTEgNDUuNzc0IDMxLjMyMSAzNC41MDEgNTYuMzEyLTEyLjczNiAyOC4yMzQtNTkuNzM0IDMxLjA2My03OC4yMTUgMzEuMDYzIi8+CiAgPHBhdGggZmlsbD0ibm9uZSIgZD0iTTg2OS4wNTMgMzIzLjgwNmMtNDAuMjI4IDAtOTYuODc4LjU2MS05Ni44NzguNTYxLTE3LjMzOSAwLTE1MC41My0uNTYxLTIxOS41MjgtLjU2MS00Mi43MDUgMC0yNi40MTYtNjcuMTM3LTI3LjQ4NC0xMTAuNDI2LS4yMi04Ljg5NyAxMS4xNDMtNjMuMDUgNjUuNDk4LTIwLjM1MSAyMy44NTMgMTguNzM5IDQyLjM2MS0zMi4yMDYgMTguMDc0LTQ0LjAyNS0yNC44MjEtMTIuMDgtNDIuNTUtMjAuNjYyLTg3LjU5LTkuMjExLTUyLjI0NCAxMy4yODMtOC4zNjggOTguMzg2LTMyLjE0MyAxMzQuMTU2LTM3LjIgNTUuOTctNDguODI4IDUwLjM2MS0yNjAuMDU2IDUwLjM2MS01MS4xNzUgMC01Mi4xMy01NS40MTMtMjguOTQ2LTEyNC4zMSAxMC41NzUtMzEuNDI2IDcwLjMxLTU3LjY1NyA3OS43MzggMCAxMC42NjcgNjUuMjM2IDkuODkzIDc0LjU5NSAzOS4yNjIgOTMuNjMyIDMyLjE5NSAyMC44NjkgODQuMjkxLTgzLjE5MiA4MS0xMzkuMzc1LTEuMjU5LTIxLjQ4OS0xNi43ODktMTkuODUtNDUuNjg3LTE5Ljg1Ii8+CiAgPHBhdGggZmlsbD0ibm9uZSIgZD0iTTM1NSAxMzQuNDA3Yy0zMS4zNjEgMC0xMzMuMzQ2LS4yOTUtMTU3LjI5NC4wNTctMTYuODc4LjI0OC05Ny43MDYtLjA1Ny05Ny43MDYgMjkuMDMydjEwNy43MWMwIDg0LjU4MSAwIDg0LjU4MSAyNy4zMiA4NC41ODFtMCAuMTE4QzE5OS41ODIgMzU1LjczMyA3MDAgMzU2IDcwMCAzNTYiLz4KICA8ZyBzdHJva2UtbGluZWpvaW49InJvdW5kIiBmaWxsPSJub25lIj4KICAgIDxwYXRoIGQ9Ik02OTMuNDA2IDM1NS45N3MxODIuNjQ0LS4wNjggMjk1LjI0NCAwYzQ5LjQ5OS4wMyA4MS41MzEtMzkuODUyIDgxLjUxLTU4LjM5OC0uODMzLTQ4LjAzMS01Mi41MTEtMjkuMzk0LTcwLjE2LTgzLjU1NC0xNi4zMDctNTAuMDQxIDQuMzQ2LTc3Ljk2OS0zOC4xMDMtNzkuNjExLTQxLjg3Ni0xLjYyLTIyNS42MTQuNDY5LTIyNS42MTQuNDY5LS4wMTgtLjA2NS05MC4xNTctMTYuNDI1LTc1Ljg5IDUzLjY2IDcuMzAyIDM1Ljg3OCA0Ni4xNzkgMzAuNzA5IDQ2LjE3OSAzMC43MDlzNDAuNjQtNi42ODggOTIuNjEyLTUuNjUxYzMxLjYxMi42MyA4My41NzMgNS4zMTUgMTEzLjU4MyAyMi44NyAyNS4yMTYgMTQuNzUxIDQ1Ljc3NCAzMS4zMjEgMzQuNTAxIDU2LjMxMi0xMi43MzYgMjguMjM0LTU5LjczNCAzMS4wNjMtNzguMjE1IDMxLjA2MyIgc3Ryb2tlPSIjZTEyYjUxIiBzdHJva2Utd2lkdGg9IjI0Ii8+CiAgICA8cGF0aCBkPSJNNjkzLjQwNiAzNTUuOTdzMTgyLjY0NC0uMDY4IDI5NS4yNDQgMGM0OS40OTkuMDMgODEuNTMxLTM5Ljg1MiA4MS41MS01OC4zOTgtLjgzMy00OC4wMzEtNTIuNTExLTI5LjM5NC03MC4xNi04My41NTQtMTYuMzA3LTUwLjA0MSA0LjM0Ni03Ny45NjktMzguMTAzLTc5LjYxMS00MS44NzYtMS42Mi0yMjUuNjE0LjQ2OS0yMjUuNjE0LjQ2OS0uMDE4LS4wNjUtOTAuMTU3LTE2LjQyNS03NS44OSA1My42NiA3LjMwMiAzNS44NzggNDYuMTc5IDMwLjcwOSA0Ni4xNzkgMzAuNzA5czQwLjY0LTYuNjg4IDkyLjYxMi01LjY1MWMzMS42MTIuNjMgODMuNTczIDUuMzE1IDExMy41ODMgMjIuODcgMjUuMjE2IDE0Ljc1MSA0NS43NzQgMzEuMzIxIDM0LjUwMSA1Ni4zMTItMTIuNzM2IDI4LjIzNC01OS43MzQgMzEuMDYzLTc4LjIxNSAzMS4wNjMiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLWRhc2hhcnJheT0iMjYgMjYiIHN0cm9rZS13aWR0aD0iMjQiLz4KICAgIDxwYXRoIGQ9Ik02OTMuNDA2IDM1NS45N3MxODIuNjQ0LS4wNjggMjk1LjI0NCAwYzQ5LjQ5OS4wMyA4MS41MzEtMzkuODUyIDgxLjUxLTU4LjM5OC0uODMzLTQ4LjAzMS01Mi41MTEtMjkuMzk0LTcwLjE2LTgzLjU1NC0xNi4zMDctNTAuMDQxIDQuMzQ2LTc3Ljk2OS0zOC4xMDMtNzkuNjExLTQxLjg3Ni0xLjYyLTIyNS42MTQuNDY5LTIyNS42MTQuNDY5LS4wMTgtLjA2NS05MC4xNTctMTYuNDI1LTc1Ljg5IDUzLjY2IDcuMzAyIDM1Ljg3OCA0Ni4xNzkgMzAuNzA5IDQ2LjE3OSAzMC43MDlzNDAuNjQtNi42ODggOTIuNjEyLTUuNjUxYzMxLjYxMi42MyA4My41NzMgNS4zMTUgMTEzLjU4MyAyMi44NyAyNS4yMTYgMTQuNzUxIDQ1Ljc3NCAzMS4zMjEgMzQuNTAxIDU2LjMxMi0xMi43MzYgMjguMjM0LTU5LjczNCAzMS4wNjMtNzguMjE1IDMxLjA2MyIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjE5Ii8+CiAgICA8cGF0aCBkPSJNODY5LjA1MyAzMjMuODA2Yy00MC4yMjggMC05Ni44NzguNTYxLTk2Ljg3OC41NjEtMTcuMzM5IDAtMTUwLjUzLS41NjEtMjE5LjUyOC0uNTYxLTQyLjcwNSAwLTI2LjQxNi02Ny4xMzctMjcuNDg0LTExMC40MjYtLjIyLTguODk3IDExLjE0My02My4wNSA2NS40OTgtMjAuMzUxIDIzLjg1MyAxOC43MzkgNDIuMzYxLTMyLjIwNiAxOC4wNzQtNDQuMDI1LTI0LjgyMS0xMi4wOC00Mi41NS0yMC42NjItODcuNTktOS4yMTEtNTIuMjQ0IDEzLjI4My04LjM2OCA5OC4zODYtMzIuMTQzIDEzNC4xNTYtMzcuMiA1NS45Ny00OC44MjggNTAuMzYxLTI2MC4wNTYgNTAuMzYxLTUxLjE3NSAwLTUyLjEzLTU1LjQxMy0yOC45NDYtMTI0LjMxIDEwLjU3NS0zMS40MjYgNzAuMzEtNTcuNjU3IDc5LjczOCAwIDEwLjY2NyA2NS4yMzYgOS44OTMgNzQuNTk1IDM5LjI2MiA5My42MzIgMzIuMTk1IDIwLjg2OSA4NC4yOTEtODMuMTkyIDgxLTEzOS4zNzUtMS4yNTktMjEuNDg5LTE2Ljc4OS0xOS44NS00NS42ODctMTkuODUiIHN0cm9rZT0iI2UxMmI1MSIgc3Ryb2tlLXdpZHRoPSIyNCIvPgogICAgPHBhdGggZD0iTTg2OS4wNTMgMzIzLjgwNmMtNDAuMjI4IDAtOTYuODc4LjU2MS05Ni44NzguNTYxLTE3LjMzOSAwLTE1MC41My0uNTYxLTIxOS41MjgtLjU2MS00Mi43MDUgMC0yNi40MTYtNjcuMTM3LTI3LjQ4NC0xMTAuNDI2LS4yMi04Ljg5NyAxMS4xNDMtNjMuMDUgNjUuNDk4LTIwLjM1MSAyMy44NTMgMTguNzM5IDQyLjM2MS0zMi4yMDYgMTguMDc0LTQ0LjAyNS0yNC44MjEtMTIuMDgtNDIuNTUtMjAuNjYyLTg3LjU5LTkuMjExLTUyLjI0NCAxMy4yODMtOC4zNjggOTguMzg2LTMyLjE0MyAxMzQuMTU2LTM3LjIgNTUuOTctNDguODI4IDUwLjM2MS0yNjAuMDU2IDUwLjM2MS01MS4xNzUgMC01Mi4xMy01NS40MTMtMjguOTQ2LTEyNC4zMSAxMC41NzUtMzEuNDI2IDcwLjMxLTU3LjY1NyA3OS43MzggMCAxMC42NjcgNjUuMjM2IDkuODkzIDc0LjU5NSAzOS4yNjIgOTMuNjMyIDMyLjE5NSAyMC44NjkgODQuMjkxLTgzLjE5MiA4MS0xMzkuMzc1LTEuMjU5LTIxLjQ4OS0xNi43ODktMTkuODUtNDUuNjg3LTE5Ljg1IiBzdHJva2U9IiNmZmYiIHN0cm9rZS1kYXNoYXJyYXk9IjI2IDI2IiBzdHJva2Utd2lkdGg9IjI0Ii8+CiAgICA8cGF0aCBkPSJNODY5LjA1MyAzMjMuODA2Yy00MC4yMjggMC05Ni44NzguNTYxLTk2Ljg3OC41NjEtMTcuMzM5IDAtMTUwLjUzLS41NjEtMjE5LjUyOC0uNTYxLTQyLjcwNSAwLTI2LjQxNi02Ny4xMzctMjcuNDg0LTExMC40MjYtLjIyLTguODk3IDExLjE0My02My4wNSA2NS40OTgtMjAuMzUxIDIzLjg1MyAxOC43MzkgNDIuMzYxLTMyLjIwNiAxOC4wNzQtNDQuMDI1LTI0LjgyMS0xMi4wOC00Mi41NS0yMC42NjItODcuNTktOS4yMTEtNTIuMjQ0IDEzLjI4My04LjM2OCA5OC4zODYtMzIuMTQzIDEzNC4xNTYtMzcuMiA1NS45Ny00OC44MjggNTAuMzYxLTI2MC4wNTYgNTAuMzYxLTUxLjE3NSAwLTUyLjEzLTU1LjQxMy0yOC45NDYtMTI0LjMxIDEwLjU3NS0zMS40MjYgNzAuMzEtNTcuNjU3IDc5LjczOCAwIDEwLjY2NyA2NS4yMzYgOS44OTMgNzQuNTk1IDM5LjI2MiA5My42MzIgMzIuMTk1IDIwLjg2OSA4NC4yOTEtODMuMTkyIDgxLTEzOS4zNzUtMS4yNTktMjEuNDg5LTE2Ljc4OS0xOS44NS00NS42ODctMTkuODUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIxOSIvPgogICAgPHBhdGggZD0iTTM1NSAxMzQuNDA3Yy0zMS4zNjEgMC0xMzMuMzQ2LS4yOTUtMTU3LjI5NC4wNTctMTYuODc4LjI0OC05Ny43MDYtLjA1Ny05Ny43MDYgMjkuMDMydjEwNy43MWMwIDg0LjU4MSAwIDg0LjU4MSAyNy4zMiA4NC41ODEiIHN0cm9rZT0iI2UxMmI1MSIgc3Ryb2tlLXdpZHRoPSIyNCIvPgogICAgPHBhdGggZD0iTTM1NSAxMzQuNDA3Yy0zMS4zNjEgMC0xMzMuMzQ2LS4yOTUtMTU3LjI5NC4wNTctMTYuODc4LjI0OC05Ny43MDYtLjA1Ny05Ny43MDYgMjkuMDMydjEwNy43MWMwIDg0LjU4MSAwIDg0LjU4MSAyNy4zMiA4NC41ODEiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLWRhc2hhcnJheT0iMjYgMjYiIHN0cm9rZS13aWR0aD0iMjQiLz4KICAgIDxwYXRoIGQ9Ik0zNTUgMTM0LjQwN2MtMzEuMzYxIDAtMTMzLjM0Ni0uMjk1LTE1Ny4yOTQuMDU3LTE2Ljg3OC4yNDgtOTcuNzA2LS4wNTctOTcuNzA2IDI5LjAzMnYxMDcuNzFjMCA4NC41ODEgMCA4NC41ODEgMjcuMzIgODQuNTgxIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMTkiLz4KICAgIDxwYXRoIGQ9Ik0xMjcuMzIgMzU1LjkwNUMxOTkuNTgyIDM1NS43MzMgNzAwIDM1NiA3MDAgMzU2IiBzdHJva2U9IiNlMTJiNTEiIHN0cm9rZS13aWR0aD0iMjQiLz4KICAgIDxwYXRoIGQ9Ik0xMjcuMzIgMzU1LjkwNUMxOTkuNTgyIDM1NS43MzMgNzAwIDM1NiA3MDAgMzU2IiBzdHJva2U9IiNmZmYiIHN0cm9rZS1kYXNoYXJyYXk9IjI2IDI2IiBzdHJva2Utd2lkdGg9IjI0Ii8+CiAgICA8cGF0aCBkPSJNMTI3LjMyIDM1NS45MDVDMTk5LjU4MiAzNTUuNzMzIDcwMCAzNTYgNzAwIDM1NiIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjE5Ii8+CiAgPC9nPgogIDxwYXRoIHN0eWxlPSJzdHJva2Utd2lkdGg6MDtzdHJva2UtbWl0ZXJsaW1pdDo2O3N0cm9rZS1saW5lY2FwOnNxdWFyZTtmaWxsOnJnYmEoMTEwLDExMCwyNTUsLjQ3KSIgZD0iTTg2NS45NTMgMzE0LjQwNWg3LjA2N3YxOC45MDFoLTcuMDY3di0xOC45MDFaTTM1MS4yMTcgMTI0Ljk0MWg3LjA2N3YxOC45MDFoLTdNMTIzLjczNyAzNDYuNTM4aDcuMDY3djE4LjkwMWgtNy4wNjd2LTE4LjkwMVoiLz4KICA8dGV4dCBmaWxsPSIjZmZmIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI1IiBmb250LXdlaWdodD0iNzAwIiB4PSI1MTAuNjg0IiB5PSI0MTAiIHN0eWxlPSJ3aGl0ZS1zcGFjZTpwcmU7Zm9udC1zaXplOjI1cHgiPiBSYWNlIFJlc3VsdHM8L3RleHQ+CiAgPHRleHQgZmlsbD0iI2ZmZiIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZmlsbC1vcGFjaXR5PSIuNyIgZm9udC1zaXplPSIyNSIgZm9udC13ZWlnaHQ9IjcwMCIgeD0iNDA3IiB5PSI0MzUiPiA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJmaWxsIiB2YWx1ZXM9IndoaXRlO3JlZCIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiLz4KCgpXYWl0aW5nIHRvIDEwIE1vcmUgUGxheWVycy4uLjwvdGV4dD4KICA8cGF0aCBmaWxsPSIjZmZmIiBkPSJNNjg1LjkyNCAzNDYuNDU5aDQuOHY0LjhoLTQuOHoiLz4KICA8cGF0aCBkPSJNNjg1LjkyNCAzNTEuMjU5aDQuOHY0LjhoLTQuOHoiLz4KICA8cGF0aCBmaWxsPSIjZmZmIiBkPSJNNjg1LjkyNCAzNTYuMDU5aDQuOHY0LjhoLTQuOHoiLz4KICA8cGF0aCBkPSJNNjg1LjkyNCAzNjAuODU5aDQuOHY0LjhoLTQuOHptNC44LTE0LjRoNC44djQuOGgtNC44eiIvPgogIDxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik02OTUuNTI0IDM0Ni40NTloNC44djQuOGgtNC44em0tNC44IDQuOGg0Ljh2NC44aC00Ljh6Ii8+CiAgPHBhdGggZD0iTTY5MC43MjQgMzU2LjA1OWg0Ljh2NC44aC00Ljh6Ii8+CiAgPHBhdGggZmlsbD0iI2ZmZiIgZD0iTTY5MC43MjQgMzYwLjg1OWg0Ljh2NC44aC00Ljh6Ii8+CiAgPHBhdGggZD0iTTY5NS41MjQgMzUxLjI1OWg0Ljh2NC44aC00Ljh6Ii8+CiAgPHBhdGggZmlsbD0iI2ZmZiIgZD0iTTY5NS41MjQgMzU2LjA1OWg0Ljh2NC44aC00Ljh6Ii8+CiAgPHBhdGggZD0iTTY5NS41MjQgMzYwLjg1OWg0Ljh2NC44aC00Ljh6Ii8+CiAgPHBhdGggc3R5bGU9InN0cm9rZS13aWR0aDowO3N0cm9rZS1taXRlcmxpbWl0OjY7c3Ryb2tlLWxpbmVjYXA6c3F1YXJlO2ZpbGw6cmdiYSgxMTAsMTEwLDI1NSwuNDcpIiBkPSJNODY1Ljk1MyAzMTQuNDA1aDcuMDY3djE4LjkwMWgtNy4wNjd2LTE4LjkwMVoiLz4KICA8dGV4dCBmaWxsPSIjRjJFQ0ZGIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjM1IiBmb250LXdlaWdodD0iNzAwIiBzdHlsZT0id2hpdGUtc3BhY2U6cHJlIiB4PSIyOS41NjEiPjx0c3BhbiB4PSI0ODQuNTYxIiB5PSI0NSIgc3R5bGU9ImZvbnQtc2l6ZTozNXB4O3dvcmQtc3BhY2luZzowIj5PbkNoYWluIFJhY2U8L3RzcGFuPjwvdGV4dD4KICA8dGV4dCBzdHlsZT0iZmlsbDojZjJlY2ZmO2ZvbnQtZmFtaWx5Om1vbm9zcGFjZTtmb250LXNpemU6MjBweDtmb250LXdlaWdodDo3MDA7d2hpdGUtc3BhY2U6cHJlIiB4PSI0ODguNzIxIiB5PSI3Mi4xNTIiPlNlYXNvbiAxPC90ZXh0Pgo8L3N2Zz4K",
    ),
  );
  const [loadingImage, setLoadingImage] = useState(false);
  const [raceImage, setRaceImage] = useState(false);
  const [getSupply, setSupply] = useState(null);
  let [resultData, setResultData] = useState(null);
  function trunceString(string) {
    const start = string.slice(0, 7);
    const middle = "...";
    const last = string.slice(-7);
    const newString = `${start}${middle}${last}`;
    return newString;
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
  let getTotalTicketCount = data.getTotalTicketCount;
  let tokenURI = "";
  let totalSupply = data.totalSupply;
  let getDataByMap = data.getDataByMap;

  let getWinAdd = data.getWinAdd;
  if (blockchain.account !== null && resultMapIdTicket !== String(0)) {
    tokenURI = "";
    tokenURI = data.tokenURI;
    tokenURI = tokenURI.substring(29);
    tokenURI = Base64.decode(tokenURI);
    if (tokenURI.length > 3) {
      tokenURI = JSON.parse(tokenURI);
      tokenURI = tokenURI.image;
    } else {
    }
    //console.log(tokenURI);
  }
  let [resultData2, setResultData2] = useState(null);
  useEffect(() => {
    if (blockchain.account !== null) {
      blockchain.smartContract.methods
        .getPlayerAddress(String(id))
        .call()
        .then((result) => {
          setResultData2(result);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [blockchain.account, resultData2]);
  useEffect(() => {
    if (blockchain.account !== null) {
      blockchain.smartContract.methods
        .getCreditAmount(blockchain.account)
        .call()
        .then((result) => {
          setGetCredit(result);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [blockchain.account, getCredit]);

  const xNFTs = () => {
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalGasLimit = String(gasLimit);
    setxNft(true);
    blockchain.smartContract.methods
      .claimMapid(id)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: 0,
      })
      .once("error", (err) => {
        console.log(err);
        setxNft(false);
      })
      .then((receipt) => {
        console.log(receipt);

        setxNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };
  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .buyTicket()
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: 0,
      })
      .once("transactionHash", (hash) => {
        setShowModal3(true);
      })
      .once("error", (err) => {
        console.log(err);
        setShowModal3(false);
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setShowModal3(false);
        setShowModal2(true);
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const getData = () => {
    if (
      blockchain.account !== "" &&
      blockchain.smartContract !== null &&
      resultMapIdTicket !== String(0)
    ) {
      tokenURI = data.tokenURI;
      dispatch(fetchData(blockchain.account));
      dispatch(fetchData(id));
      tokenURI = tokenURI.substring(29);
      tokenURI = Base64.decode(tokenURI);
      tokenURI = tokenURI.substring(163, tokenURI.length - 2);
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
    if (id == totalSupply) {
      let id = 1;
    }
    getConfig();
  }, []);

  useEffect(() => {
    dispatch(fetchData(id));
  }, [id, dispatch]);

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [showModal2, setShowModal2] = React.useState(false);
  const [showModal3, setShowModal3] = React.useState(false);
  const [showModal4, setShowModal4] = React.useState(false);
  const [showModal5, setShowModal5] = React.useState(false);
  useEffect(() => {
    if (blockchain.account !== null) {
      let account = blockchain.account.toUpperCase();
      const upper = Object.values(getDataByMap).map((value) => {
        return value.toUpperCase();
      });

      const upperWin = Object.values(getWinAdd).map((value) => {
        return value.toUpperCase();
      });
      let WinTime = getWinAdd[1] * 1000;
      if (upperWin[0] === account) {
        const timer = setTimeout(() => {
          setShowModal(true);
        }, Number(WinTime));

        return () => {
          clearTimeout(timer);
        };
      }
    }
  }, [blockchain.account, getDataByMap, getWinAdd]);

  useEffect(() => {
    if (blockchain.account !== null) {
      blockchain.smartContract.methods
        .getMapIdTicketCount(id)
        .call()
        .then((result) => {
          setResultMapIdTicket(result);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [blockchain.account, resultMapIdTicket]);
  useEffect(() => {
    getData();
  }, [blockchain.account]);
  useEffect(() => {
    if (blockchain.account !== null) {
      blockchain.smartContract.methods
        .getMapIdTicketCount(totalSupply)
        .call()
        .then((result) => {
          setResultLastMapTicket(result);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [blockchain.account, resultLastMapTicket]);

  useEffect(() => {
    if (
      blockchain.account !== "" &&
      blockchain.smartContract !== null &&
      resultMapIdTicket !== 0
    ) {
      setLoadingImage(true);
      setRaceImage(false);
      blockchain.smartContract.methods
        .tokenURI(id)
        .call()
        .then((result) => {
          let updatedRaceMap = result.substring(29);
          updatedRaceMap = Base64.decode(updatedRaceMap);
          setRaceMap(updatedRaceMap);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoadingImage(false);
          setRaceImage(true);
        });
    }
  }, [blockchain.account, blockchain.smartContract, id]);

  useEffect(() => {
    if (blockchain.account !== null && resultMapIdTicket == String(0)) {
      setRaceImg(
        String(
          "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgNSAxMjAwIDcwMCIgaGVpZ2h0PSI3MDAiIHdpZHRoPSIxMjAwIj4KICA8cGF0aCBmaWxsPSIjMTExNzI4IiBkPSJNMCAwaDEyMDB2NzAwSDB6Ii8+CiAgPHBhdGggaWQ9ImEiIGZpbGw9Im5vbmUiIGQ9Ik02OTMuNDA2IDM1NS45N3MxODIuNjQ0LS4wNjggMjk1LjI0NCAwYzQ5LjQ5OS4wMyA4MS41MzEtMzkuODUyIDgxLjUxLTU4LjM5OC0uODMzLTQ4LjAzMS01Mi41MTEtMjkuMzk0LTcwLjE2LTgzLjU1NC0xNi4zMDctNTAuMDQxIDQuMzQ2LTc3Ljk2OS0zOC4xMDMtNzkuNjExLTQxLjg3Ni0xLjYyLTIyNS42MTQuNDY5LTIyNS42MTQuNDY5LS4wMTgtLjA2NS05MC4xNTctMTYuNDI1LTc1Ljg5IDUzLjY2IDcuMzAyIDM1Ljg3OCA0Ni4xNzkgMzAuNzA5IDQ2LjE3OSAzMC43MDlzNDAuNjQtNi42ODggOTIuNjEyLTUuNjUxYzMxLjYxMi42MyA4My41NzMgNS4zMTUgMTEzLjU4MyAyMi44NyAyNS4yMTYgMTQuNzUxIDQ1Ljc3NCAzMS4zMjEgMzQuNTAxIDU2LjMxMi0xMi43MzYgMjguMjM0LTU5LjczNCAzMS4wNjMtNzguMjE1IDMxLjA2MyIvPgogIDxwYXRoIGlkPSJiIiBmaWxsPSJub25lIiBkPSJNODY5LjA1MyAzMjMuODA2Yy00MC4yMjggMC05Ni44NzguNTYxLTk2Ljg3OC41NjEtMTcuMzM5IDAtMTUwLjUzLS41NjEtMjE5LjUyOC0uNTYxLTQyLjcwNSAwLTI2LjQxNi02Ny4xMzctMjcuNDg0LTExMC40MjYtLjIyLTguODk3IDExLjE0My02My4wNSA2NS40OTgtMjAuMzUxIDIzLjg1MyAxOC43MzkgNDIuMzYxLTMyLjIwNiAxOC4wNzQtNDQuMDI1LTI0LjgyMS0xMi4wOC00Mi41NS0yMC42NjItODcuNTktOS4yMTEtNTIuMjQ0IDEzLjI4My04LjM2OCA5OC4zODYtMzIuMTQzIDEzNC4xNTYtMzcuMiA1NS45Ny00OC44MjggNTAuMzYxLTI2MC4wNTYgNTAuMzYxLTUxLjE3NSAwLTUyLjEzLTU1LjQxMy0yOC45NDYtMTI0LjMxIDEwLjU3NS0zMS40MjYgNzAuMzEtNTcuNjU3IDc5LjczOCAwIDEwLjY2NyA2NS4yMzYgOS44OTMgNzQuNTk1IDM5LjI2MiA5My42MzIgMzIuMTk1IDIwLjg2OSA4NC4yOTEtODMuMTkyIDgxLTEzOS4zNzUtMS4yNTktMjEuNDg5LTE2Ljc4OS0xOS44NS00NS42ODctMTkuODUiLz4KICA8cGF0aCBpZD0iYyIgZmlsbD0ibm9uZSIgZD0iTTM1NSAxMzQuNDA3Yy0zMS4zNjEgMC0xMzMuMzQ2LS4yOTUtMTU3LjI5NC4wNTctMTYuODc4LjI0OC05Ny43MDYtLjA1Ny05Ny43MDYgMjkuMDMydjEwNy43MWMwIDg0LjU4MSAwIDg0LjU4MSAyNy4zMiA4NC41ODEiLz4KICA8cGF0aCBpZD0iZCIgZmlsbD0ibm9uZSIgZD0iTTEyNy4zMiAzNTUuOTA1QzE5OS41ODIgMzU1LjczMyA3MDAgMzU2IDcwMCAzNTYiLz4KICA8ZyBzdHJva2UtbGluZWpvaW49InJvdW5kIiBmaWxsPSJub25lIj4KICAgIDx1c2UgaHJlZj0iI2EiIHN0cm9rZT0iI2UxMmI1MSIgc3Ryb2tlLXdpZHRoPSIyNCIvPgogICAgPHVzZSBocmVmPSIjYSIgc3Ryb2tlPSIjZmZmIiBzdHJva2UtZGFzaGFycmF5PSIyNiAyNiIgc3Ryb2tlLXdpZHRoPSIyNCIvPgogICAgPHVzZSBocmVmPSIjYSIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjE5Ii8+CiAgICA8dXNlIGhyZWY9IiNiIiBzdHJva2U9IiNlMTJiNTEiIHN0cm9rZS13aWR0aD0iMjQiLz4KICAgIDx1c2UgaHJlZj0iI2IiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLWRhc2hhcnJheT0iMjYgMjYiIHN0cm9rZS13aWR0aD0iMjQiLz4KICAgIDx1c2UgaHJlZj0iI2IiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIxOSIvPgogICAgPHVzZSBocmVmPSIjYyIgc3Ryb2tlPSIjZTEyYjUxIiBzdHJva2Utd2lkdGg9IjI0Ii8+CiAgICA8dXNlIGhyZWY9IiNjIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1kYXNoYXJyYXk9IjI2IDI2IiBzdHJva2Utd2lkdGg9IjI0Ii8+CiAgICA8dXNlIGhyZWY9IiNjIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMTkiLz4KICAgIDx1c2UgaHJlZj0iI2QiIHN0cm9rZT0iI2UxMmI1MSIgc3Ryb2tlLXdpZHRoPSIyNCIvPgogICAgPHVzZSBocmVmPSIjZCIgc3Ryb2tlPSIjZmZmIiBzdHJva2UtZGFzaGFycmF5PSIyNiAyNiIgc3Ryb2tlLXdpZHRoPSIyNCIvPgogICAgPHVzZSBocmVmPSIjZCIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjE5Ii8+CiAgPC9nPgogIDxwYXRoIHN0eWxlPSJzdHJva2Utd2lkdGg6MDtzdHJva2UtbWl0ZXJsaW1pdDo2O3N0cm9rZS1saW5lY2FwOnNxdWFyZTtmaWxsOnJnYmEoMTEwLDExMCwyNTUsLjQ3KSIgZD0iTTg2NS45NTMgMzE0LjQwNWg3LjA2N3YxOC45MDFoLTcuMDY3di0xOC45MDFaIiBpZD0iZSIvPgogIDxwYXRoIHN0eWxlPSJzdHJva2Utd2lkdGg6MDtzdHJva2UtbWl0ZXJsaW1pdDo2O3N0cm9rZS1saW5lY2FwOnNxdWFyZTtmaWxsOnJnYmEoMTEwLDExMCwyNTUsLjQ3KSIgZD0iTTM1MS4yMTcgMTI0Ljk0MWg3LjA2N3YxOC45MDFoLTdNMTIzLjczNyAzNDYuNTM4aDcuMDY3djE4LjkwMWgtNy4wNjd2LTE4LjkwMVoiLz4KICA8dXNlIGhyZWY9IiNhIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1kYXNoYXJyYXk9IjUgNSIvPgogIDx1c2UgaHJlZj0iI2IiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLWRhc2hhcnJheT0iNSA1Ii8+CiAgPHVzZSBocmVmPSIjYyIgc3Ryb2tlPSIjZmZmIiBzdHJva2UtZGFzaGFycmF5PSI1IDUiLz4KICA8dXNlIGhyZWY9IiNkIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1kYXNoYXJyYXk9IjUgNSIvPgogIDx0ZXh0IGZpbGw9IiNmZmYiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMjUiIGZvbnQtd2VpZ2h0PSI3MDAiIHg9IjUxNyIgeT0iNDEwIj4gUmFjZSBSZXN1bHRzPC90ZXh0PgogIDx0ZXh0IGZpbGw9IiNmZmYiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZpbGwtb3BhY2l0eT0iLjciIGZvbnQtc2l6ZT0iMjUiIGZvbnQtd2VpZ2h0PSI3MDAiIHg9IjQwNyIgeT0iNDM1Ij4gPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iZmlsbCIgdmFsdWVzPSJ3aGl0ZTtyZWQiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+CgoKV2FpdGluZyB0byAxMCBNb3JlIFBsYXllcnMuLi48L3RleHQ+CiAgPHBhdGggZmlsbD0iIzE3MTk0MSIgZD0iTTAgMGgxNXY1SDB6Ii8+CiAgPHBhdGggZmlsbD0iI2ZmZiIgZD0iTTY4NS45MjQgMzQ2LjQ1OWg0Ljh2NC44aC00Ljh6Ii8+CiAgPHBhdGggZD0iTTY4NS45MjQgMzUxLjI1OWg0Ljh2NC44aC00Ljh6Ii8+CiAgPHBhdGggZmlsbD0iI2ZmZiIgZD0iTTY4NS45MjQgMzU2LjA1OWg0Ljh2NC44aC00Ljh6Ii8+CiAgPHBhdGggZD0iTTY4NS45MjQgMzYwLjg1OWg0Ljh2NC44aC00Ljh6bTQuOC0xNC40aDQuOHY0LjhoLTQuOHoiLz4KICA8cGF0aCBmaWxsPSIjZmZmIiBkPSJNNjk1LjUyNCAzNDYuNDU5aDQuOHY0LjhoLTQuOHptLTQuOCA0LjhoNC44djQuOGgtNC44eiIvPgogIDxwYXRoIGQ9Ik02OTAuNzI0IDM1Ni4wNTloNC44djQuOGgtNC44eiIvPgogIDxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik02OTAuNzI0IDM2MC44NTloNC44djQuOGgtNC44eiIvPgogIDxwYXRoIGQ9Ik02OTUuNTI0IDM1MS4yNTloNC44djQuOGgtNC44eiIvPgogIDxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik02OTUuNTI0IDM1Ni4wNTloNC44djQuOGgtNC44eiIvPgogIDxwYXRoIGQ9Ik02OTUuNTI0IDM2MC44NTloNC44djQuOGgtNC44eiIvPgogIDx1c2UgaHJlZj0iI2UiLz4KICA8dGV4dCBmaWxsPSIjRjJFQ0ZGIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjM1IiBmb250LXdlaWdodD0iNzAwIj48dHNwYW4geD0iNDU1IiB5PSI0NSI+T25DaGFpbiBSYWNlPC90c3Bhbj48L3RleHQ+CiAgPHRleHQgc3R5bGU9ImZpbGw6I2YyZWNmZjtmb250LWZhbWlseTptb25vc3BhY2U7Zm9udC1zaXplOjIwcHg7Zm9udC13ZWlnaHQ6NzAwIiB4PSI0NTUiIHk9IjY4Ij5TZXNpb246IDE8L3RleHQ+Cjwvc3ZnPgo=",
        ),
      );
    }
  }, [blockchain.account, raceImg]);
  useEffect(() => {
    if (blockchain.account !== null) {
      blockchain.smartContract.methods
        .getPlayerAddress(String(id))
        .call()
        .then((result) => {
          setResultData(result);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [blockchain.account, resultData]);
  return (
    <>
      <section className="">
        <div className="mx-auto max-w-screen-xl text-center lg:py-5 lg:px-12 lg:pb-5">
          <div className="lg:text-md flex flex-wrap items-center justify-center  py-3 text-xs font-bold  md:py-3">
            {blockchain.account === "" || blockchain.smartContract === null ? (
              <Container>{blockchain.errorMsg !== "" ? <></> : null}</Container>
            ) : (
              <>
                <s.SpacerSmall />
                <Menu as="div" className="relative inline-block text-center ">
                  <div>
                    <Link to={`/Race/${Number(1)}`}>
                      <button
                        type="button"
                        className="relative mx-0.5 mb-1 inline-block rounded-lg border border-solid border-teal-600/30 px-2 py-1 text-center  text-teal-600 shadow-sm hover:shadow-slate-500 lg:px-4 lg:py-2 "
                      >
                        &#60;&#60;
                      </button>
                    </Link>
                    <Link to={`/Race/${Number(id) - 1}`}>
                      <button
                        type="button"
                        className={`mx-0.5 mb-1 inline-flex items-center rounded-lg border border-solid border-teal-600/30 px-2 py-1   text-teal-600 shadow-sm hover:shadow-slate-500 lg:px-4 lg:py-2  ${
                          Number(id) - 1 <= 0 ? "hidden" : ""
                        }`}
                      >
                        &#60;
                      </button>
                    </Link>
                    {(() => {
                      if (
                        blockchain.account !== null &&
                        Number(getCredit) > 0
                      ) {
                        return (
                          <button
                            type="button"
                            className="relative mx-0.5 inline-block rounded-lg border border-solid border-teal-600/30  px-2 py-1 text-center  text-teal-600 shadow-sm  hover:shadow-slate-500 lg:px-4  lg:py-2 "
                            disabled={claimingNft ? 1 : 0}
                            onClick={(e) => {
                              e.preventDefault();
                              claimNFTs();
                              getData();
                            }}
                          >
                            {claimingNft ? (
                              <div
                                className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                role="status"
                              ></div>
                            ) : (
                              "Join Last Race"
                            )}
                          </button>
                        );
                      } else if (
                        blockchain.account !== null &&
                        Number(getCredit) === 0
                      ) {
                        return (
                          <button
                            onClick={() => setShowModal5(true)}
                            type="button"
                            className="mx-0.5 inline-flex items-center rounded-lg border border-solid  border-slate-600/30 px-2  py-1  text-teal-600 shadow-sm  hover:shadow-slate-500 lg:px-4 lg:py-2"
                          >
                            Join Races
                          </button>
                        );
                      }
                    })()}

                    {(() => {
                      if (
                        blockchain.account !== null &&
                        resultMapIdTicket !== String(0) &&
                        resultData2 !== null
                      ) {
                        let account = blockchain.account.toUpperCase();
                        const matchingIndexes = [];
                        const upper = Object.values(resultData2).map(
                          (value, index) => {
                            const upperValue = value.toUpperCase();
                            if (upperValue === account) {
                              matchingIndexes.push(index);
                            }
                            return upperValue;
                          },
                        );

                        //console.log(`Matching indexes: ${matchingIndexes}`);
                        const colorComponents = matchingIndexes.map((index) => {
                          return (
                            <>
                              <span
                                className={`text-${colors[index]} lg:text-md text-[10px]`}
                              >
                                ⬤{" "}
                              </span>
                            </>
                          );
                        });

                        if (colorComponents.length > 0) {
                          return (
                            <>
                              <button
                                type="button"
                                disabled
                                className="relative mx-0.5 inline-block rounded-lg border border-solid border-teal-600/30 px-2 py-1 text-center  text-teal-600 shadow-sm hover:shadow-slate-500 lg:px-4 lg:py-2"
                              >
                                Your Car: {colorComponents}
                              </button>
                            </>
                          );
                        }
                      }
                    })()}

                    <Link to={`/Race/${Number(id) + 1}`}>
                      <button
                        type="button"
                        className={`mx-0.5 inline-flex items-center rounded-lg border border-solid border-teal-600/30 px-2  py-1  text-teal-600 shadow-sm  hover:shadow-slate-500 lg:px-4 lg:py-2  ${
                          Number(id) == Number(totalSupply) ? "hidden" : ""
                        }`}
                      >
                        &#62;
                      </button>
                    </Link>
                    {(() => {
                      if (resultLastMapTicket == 0) {
                        return (
                          <Link to={`/Race/${Number(totalSupply) - 1}`}>
                            <button
                              type="button"
                              className="mx-0.5 inline-flex items-center rounded-lg border border-solid border-teal-600/30 px-2  py-1  text-teal-600 shadow-sm  hover:shadow-slate-500 lg:px-4 lg:py-2 "
                            >
                              &#62;&#62;
                            </button>
                          </Link>
                        );
                      } else {
                        return (
                          <Link to={`/Race/${Number(totalSupply)}`}>
                            <button
                              type="button"
                              className="relative mx-0.5  inline-block rounded-lg border border-solid border-teal-600/30 px-2 py-1 text-center  text-teal-600 shadow-sm hover:shadow-slate-500 lg:px-4 lg:py-2"
                            >
                              &#62;&#62;
                            </button>
                          </Link>
                        );
                      }
                    })()}
                  </div>
                </Menu>
              </>
            )}
          </div>
          <div className="container mx-auto">
            <div className="   rounded-2xl  border border-solid border-teal-500 border-opacity-20  text-center shadow-2xl   lg:col-span-5 lg:mt-0 ">
              {(() => {
                if (blockchain.account == null) {
                  return (
                    <>
                      <div className=" mx-auto max-w-screen-xl animate-pulse py-8 px-4 text-center lg:py-16 lg:px-12">
                        <div className=" row-start-2 inline-flex animate-pulse items-center    ">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-5 w-5 text-amber-300 lg:h-7  lg:w-7"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                            />
                          </svg>
                          <p className="text-md  grid text-center text-amber-300 lg:text-2xl ">
                            <span className=" ml-2   text-center font-bold ">
                              {" "}
                              Please Connect Your Wallet
                            </span>
                          </p>
                        </div>
                      </div>
                    </>
                  );
                }
              })()}

              {(() => {
                if (
                  id == Number(totalSupply) &&
                  resultMapIdTicket == String(0)
                ) {
                  return (
                    <>
                      <img className={"h-fit p-1"} src={raceMap2} />
                    </>
                  );
                } else {
                  try {
                    raceMap = JSON.parse(raceMap);
                  } catch (error) {}
                  return (
                    <div>
                      {loadingImage && (
                        <button
                          disabled
                          type="button"
                          className="  mr-2 inline-flex animate-pulse items-center bg-transparent py-2.5  px-5 text-center text-xl font-medium   text-teal-600 duration-300"
                        >
                          <svg
                            aria-hidden="true"
                            role="status"
                            className="mr-3 inline h-6 w-6 animate-spin text-teal-600  "
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
                              fill="#101729"
                            />
                          </svg>
                          OnChain Race #{id} Loading...
                        </button>
                      )}
                      {raceImage && (
                        <img
                          className="h-fit p-1"
                          src={raceMap.image}
                          alt="Race Map"
                        />
                      )}
                      {}
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </div>
      </section>
      {(() => {
        if (blockchain.account !== null) {
          return (
            <>
              <section className="">
                <div className=" mx-auto max-w-screen-xl px-6 text-center lg:py-5 lg:px-12 lg:pb-5">
                  <div className=" from-bgc/50 mt-10    rounded-2xl  border border-solid border-teal-500 border-opacity-20 bg-gradient-to-b shadow-2xl lg:col-span-4 lg:mt-0  ">
                    <div className=" items-center">
                      <p className=" animate-pulse py-2  text-center  text-xs    tracking-tight  text-teal-600 lg:text-lg">
                        OnChainRace #{String(id)} Players
                      </p>
                    </div>
                    <hr className="h-px  border-0 bg-slate-200/20 " />
                    <table className="lg:text-md w-full text-center text-xs text-gray-500 ">
                      <thead className=" uppercase  text-gray-400  ">
                        <tr>
                          <th scope="col" className="px-1 py-2 lg:px-6">
                            Color
                          </th>
                          <th scope="col" className="px-0 py-2 lg:px-6">
                            Player ID
                          </th>
                          <th scope="col" className="px-1 py-2 lg:px-6">
                            Wallet Addresss
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {resultData &&
                          resultData.length !== null &&
                          resultData.map((item, index) => (
                            <React.Fragment key={index}>
                              <tr className="border-b">
                                <th
                                  scope="row"
                                  className="whitespace-nowrap py-2 font-medium"
                                >
                                  <p className={`text-${colors[index]} `}>⬤ </p>
                                </th>
                                <td className="px-0 py-2 lg:px-6">{`Player #${
                                  index + 1
                                }`}</td>

                                <td className=" px-1 py-2   text-teal-500/50 underline decoration-dashed underline-offset-2 lg:px-6">
                                  {" "}
                                  <Link to={`/Address/${item}`}>
                                    {trunceString(item)}
                                  </Link>
                                </td>
                              </tr>
                            </React.Fragment>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </>
          );
        } else {
        }
      })()}

      <div className="container mx-auto">
        <>
          {showModal ? (
            <>
              <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
                <div className="bg-bgc relative my-6 mx-auto w-auto max-w-3xl rounded-lg  border  border-gray-200 shadow ">
                  <div className="relative flex w-full flex-col rounded-lg border-0 shadow-lg  outline-none focus:outline-none ">
                    <div className="to-bgc group flex h-full flex-col rounded-xl border border-gray-200 bg-gradient-to-r from-teal-900 shadow-sm">
                      <div className="p-4 md:p-6">
                        <span className="mb-1 block text-center text-lg font-normal text-gray-200 lg:text-2xl">
                          <div className=" inline-flex  items-center  justify-center    ">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="#134d49"
                              viewBox="0 0 24 24"
                              strokeWidth="0.3"
                              stroke="currentColor"
                              className="lg:h-15 lg:w-15  h-10 w-10"
                            >
                              <path
                                strokeLineCap="round"
                                strokeLinejoin="round"
                                d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                              />
                            </svg>
                            Congratulations!
                          </div>
                        </span>
                        <h3 className="animate-pulse text-center text-lg   font-semibold text-gray-200 lg:text-2xl">
                          🎉🎉🎉 You Won OnChain Race #{id} 🎉🎉🎉
                        </h3>
                        <p className="mt-3 text-gray-200">
                          You Won 2 Credits and Also You Can Free Claim OnChain
                          Race #{id}
                        </p>
                      </div>
                      <div className="mt-auto flex divide-x divide-gray-200/10 border-t border-solid border-gray-400">
                        <button
                          className="inline-flex w-full items-center justify-center gap-2 rounded-bl-xl py-3 px-4 align-middle text-sm font-medium text-gray-200 shadow-sm transition-all hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 focus:ring-offset-white  sm:p-4"
                          type="button"
                          onClick={() => setShowModal(false)}
                        >
                          Close
                        </button>
                        {(() => {
                          {
                            if (blockchain.account !== null) {
                              let account = blockchain.account.toUpperCase();
                              const upper = Object.values(getDataByMap).map(
                                (value) => {
                                  return value.toUpperCase();
                                },
                              );
                              const upperWin = Object.values(getWinAdd).map(
                                (value) => {
                                  return value.toUpperCase();
                                },
                              );

                              if (upperWin[0] == account) {
                                return (
                                  <button
                                    className=" inline-flex w-full items-center justify-center gap-2  py-3 px-4 align-middle text-sm font-medium text-gray-200 shadow-sm transition-all hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 focus:ring-offset-white  sm:p-4 "
                                    onClick={(e) => {
                                      e.preventDefault();
                                      xNFTs();
                                      getData();
                                    }}
                                  >
                                    {xNft ? "Sending..." : "Claim NFT"}
                                  </button>
                                );
                              } else {
                              }
                            }
                          }
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </>
      </div>
      {showModal ? <div></div> : <div></div>}

      <div className="container mx-auto">
        <>
          {showModal2 ? (
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
                    Success! You have successfully join the last race.
                    <div className="ml-auto">
                      <button
                        onClick={() => setShowModal2(false)}
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
          {showModal3 ? (
            <>
              <div>
                <div
                  className="fixed bottom-5 right-5 z-50  max-w-sm rounded-md  bg-blue-700/40 text-sm font-bold text-white shadow-lg "
                  role="alert"
                >
                  <div className="flex p-4">
                    <svg
                      aria-hidden="true"
                      className="mr-2 h-5 w-5 animate-spin fill-teal-600 text-gray-200 "
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
                    Joining to Last Race
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
          {showModal4 ? (
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
                    </svg>
                    Sorry, something went wrong please try again later.
                    <div className="ml-auto">
                      <button
                        onClick={() => setShowModal4(false)}
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
          {showModal5 ? (
            <>
              <div>
                <div
                  className="fixed bottom-5 right-5 z-50  max-w-lg rounded-md  bg-rose-900/40 text-sm font-bold text-rose-200 shadow-lg "
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
                    </svg>
                    Sorry, you do not have enough credits (1 credit per race) to
                    enter the race. Please add credit.
                    <div className="ml-auto">
                      <button
                        onClick={() => setShowModal5(false)}
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
    </>
  );
};

export default Race;
