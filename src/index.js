import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import All from "./All";
import Race from "./Race";
import Address from "./Address";
import Credit from "./Credit";
import Header from "./Header";
import Swap from "./Swap";
import Stats from "./Stats";
import reportWebVitals from "./reportWebVitals";
import store from "./redux/store";
import { Provider } from "react-redux";
import "./styles/reset.css";
import { StyledEngineProvider } from "@mui/material/styles";
ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<All />} />
        <Route path="/Race/:id" element={<Race />} />
        <Route path="/address/:id" element={<Address />} />
        <Route path="/Swap" element={<Swap />} />
        <Route path="/Credit" element={<Credit />} />
        <Route path="/Stats" element={<Stats />} />
      </Routes>
    </Router>
  </Provider>,
  document.getElementById("root"),
);

reportWebVitals();
