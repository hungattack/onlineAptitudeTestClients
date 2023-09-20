"use client";
import React, { useState } from "react";
import styles from "./regManager.module.scss";
import managerAPI from "../API/manager/managerAPI";
import { H3 } from "../styleComponent/styleComponent";
const RegManager = () => {
  const user = JSON.parse(
    JSON.parse(window ? window?.localStorage.getItem("persist:root") ?? "" : "")
      .userData
  ).user;

  const [message, setMessage] = useState<string>("");
  const [err, setErr] = useState<{
    Name: boolean;
    Email: boolean;
    PhoneNumber: boolean;
    Address: boolean;
  }>({
    Name: false,
    Email: false,
    PhoneNumber: false,
    Address: false,
  });
  const [dataUser, setdataUser] = useState<{
    Name: string;
    Email: string;
    PhoneNumber: string;
    Address: string;
  }>({
    Name: "",
    Email: "",
    PhoneNumber: "",
    Address: "",
  });
  const submit = async () => {
    let check = false;
    let allCheck = {
      Name: false,
      Email: false,
      PhoneNumber: false,
      Address: false,
    };
    if (
      !dataUser.Name ||
      dataUser.Name.length < 5 ||
      dataUser.Name.length > 40
    ) {
      allCheck.Name = true;
      check = true;
    }
    if (!dataUser.Email) {
      allCheck.Email = true;
      check = true;
    }
    if (!dataUser.PhoneNumber) {
      allCheck.PhoneNumber = true;
      check = true;
    }
    if (!dataUser.Address) {
      allCheck.Address = true;
      check = true;
    }
    setErr({ ...allCheck });
    if (
      dataUser.Name &&
      dataUser.PhoneNumber &&
      dataUser.Email &&
      dataUser.Address &&
      !check
    ) {
      const res = await managerAPI.SendRequest({
        ...dataUser,
        userId: user.id,
      });

      setMessage(res.message);
      console.log(dataUser);
    }
  };
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validateEmail = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,5})+$/;
    if (!validateEmail.test(e.target.value)) {
      setErr({ ...err, Email: true });
    } else {
      setErr({ ...err, Email: false });
    }

    setdataUser({ ...dataUser, Email: e.target.value });
  };
  const handlePhoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isNaN(Number(e.target.value))) {
      if (e.target.value.length < 12)
        setdataUser({ ...dataUser, PhoneNumber: e.target.value });
    }
    setErr({ ...err, PhoneNumber: false });
  };
  return (
    <div className={styles.manager}>
      <div className={styles.form}>
        <H3>Send Request</H3>
        <div className={styles.divInput}>
          <input
            type="text"
            placeholder="Name"
            value={dataUser.Name}
            style={{ border: err.Name ? "1px solid red" : "" }}
            onChange={(e) => {
              if (e.target.value.length < 40) {
                setdataUser({ ...dataUser, Name: e.target.value });
              }
              setErr({ ...err, Name: false });
            }}
          />
          {err.Name && (
            <p style={{ color: "red", fontSize: "1.3rem" }}>
              The field name must be from 5 to 40 characters long
            </p>
          )}
        </div>
        <div className={styles.divInput}>
          <input
            type="text"
            placeholder="Email"
            onChange={handleEmail}
            value={dataUser.Email}
            style={{ border: err.Email ? "1px solid red" : "" }}
          />
          {err.Email && (
            <p style={{ color: "red", fontSize: "1.3rem" }}>
              Email is not valid
            </p>
          )}
        </div>
        <div className={styles.divInput}>
          <input
            type="text"
            placeholder="Phone Number"
            onChange={handlePhoneNumber}
            value={dataUser.PhoneNumber}
            style={{ border: err.PhoneNumber ? "1px solid red" : "" }}
          />
          {err.PhoneNumber && (
            <p style={{ color: "red", fontSize: "1.3rem" }}>
              Phone Number is not valid
            </p>
          )}
        </div>
        <div className={styles.divInput}>
          <input
            type="text"
            placeholder="Address"
            value={dataUser.Address}
            style={{ border: err.Address ? "1px solid red" : "" }}
            onChange={(e) =>
              setdataUser({ ...dataUser, Address: e.target.value })
            }
          />
        </div>
        <button onClick={submit}>Send Request</button>
        {message && (
          <p
            style={{
              color: message.includes("Send request succeed")
                ? "#69d169"
                : "red",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default RegManager;
