import React from "react";
import styles from "./manager.module.scss";
import Option from "./Option/Option";
import Result from "./Option/Result";
const Manager = () => {
  return (
    <>
      <div className={styles.manager}>
        <div className={styles.optionBar}>
          <div className={styles.itemPart}>
            <Option />
          </div>
        </div>
        <Result />
      </div>
    </>
  );
};

export default Manager;
