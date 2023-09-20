"use client";
import React from "react";
import styles from "./header.module.scss";
import { useSelector } from "react-redux";
import { PropsUserDataRD } from "../redux/userData";
import Images from "../assets/images";
import { GridDotI } from "../assets/Icons/Icons";
const UserBar = ({
  setShow,
}: {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const user = useSelector(
    (state: { persistedReducer: { userData: PropsUserDataRD } }) => {
      return state.persistedReducer.userData.user;
    }
  );
  const avatar = user?.avatar || user?.gender ? Images.female : Images.male;
  return (
    <>
      {user ? (
        <div className={styles.userBar} onClick={() => setShow((pre) => !pre)}>
          <div className={styles.avatar}>
            <img src={avatar} alt={user.name} />
          </div>
          <p className={styles.name}>{user.name}</p>
        </div>
      ) : (
        <div
          style={{ color: "#f1f1f1", width: "50%" }}
          className={styles.gridDot}
        >
          <div
            className={styles.gridDotShow}
            onClick={() => setShow((pre) => !pre)}
          >
            <GridDotI />
          </div>
        </div>
      )}
    </>
  );
};

export default UserBar;
