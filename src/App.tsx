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
import { useQuery } from "@tanstack/react-query";
import userAPI from "./API/userAPI/userAPI";

function App() {
  const { login, register, user } = useSelector(
    (state: { persistedReducer: { userData: PropsUserDataRD } }) => {
      return state.persistedReducer.userData;
    }
  );
  const { data } = useQuery({
    queryKey: ["user", 1],
    enabled: user?.id ? true : false,
    queryFn: () => {
      if (user?.id) {
        return userAPI.GeById(user.id);
      }
    },
  });
  console.log(data, "data user");

  return (
      <div className="App">
          <Header />
          <Routes>
              <Route path="/" element={<Home />} />
              {user && (
                  <>
                      {user.roles.name === 'admin' ? (
                          <>
                              <Route path="/manager" element={<Manager />} />
                              {/* <Route path="/regManager" element={<RegManager />} /> */}
                          </>
                      ) : (
                          <Route path="/regManager" element={<RegManager />} />
                      )}
                  </>
              )}
          </Routes>
          {login && <Login />}
          {register && <Register />}
      </div>
  );
}

export default App;
