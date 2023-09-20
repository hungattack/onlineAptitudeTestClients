import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Header from "./Header/Header";
import Home from "./Home/Home";
import { useSelector } from "react-redux";
import { PropsUserDataRD } from "./redux/userData";
import Login from "./auth/Login/Login";
import Register from "./auth/Register/Register";
import Manager from "./Manager/Manager";
import RegManager from "./RegManager/RagManager";

function App() {
  const { login, register } = useSelector(
    (state: { persistedReducer: { userData: PropsUserDataRD } }) => {
      return state.persistedReducer.userData;
    }
  );
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/manager" element={<Manager />} />
        <Route path="/regManager" element={<RegManager />} />
      </Routes>
      {login && <Login />}
      {register && <Register />}
    </div>
  );
}

export default App;
