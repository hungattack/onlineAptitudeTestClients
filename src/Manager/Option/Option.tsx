"use client";
import React, { useState } from "react";
import styles from "./option.module.scss";
import { AddI } from "../../assets/Icons/Icons";
const Option = () => {
  const [jobShow, setJobShow] = useState<string>(""); // TO show the Job
  const [showQues, setShowQuest] = useState<string>(""); // to show the Option
  const [addData, setAddData] = useState<string>("");
  const [firstData, setFirstData] = useState<string>("");
  const [candidate, setCandidate] = useState<{
    title: string;
    position: string[];
  }>({
    title: "Candidates",
    position: [
      "All candidates",
      "Candidates register",
      "Success candidates",
      "Failed candidates",
    ],
  });
  const [data, setData] = useState<
    {
      title: string;
      position:
        | {
            title: string;
            requirements: (
              | {
                  title: string;
                  val?: undefined;
                }
              | {
                  title: string;
                  val: string[];
                }
            )[];
          }[];
    }[]
  >([
    {
      title: "Jobs",
      position: [
        {
          title: "Developer",
          requirements: [
            { title: "Information" },
            {
              title: "Question",
              val: ["General knowledge", "Mathematics", "Java"],
            },
          ],
        },
        {
          title: "Marketing",
          requirements: [
            { title: "Information" },
            {
              title: "Question",
              val: ["General knowledge", "Market research"],
            },
          ],
        },
        {
          title: "Security Engineer",
          requirements: [
            { title: "Information" },
            { title: "Question", val: ["General knowledge", "Mathematics"] },
          ],
        },
      ],
    },
  ]);
  const handleAdd = (title: string) => {
    if (title === "Jobs" && firstData) {
      setData((pre) =>
        pre.map((t) => {
          if (t.title === title && typeof t.position === "object") {
            // check Does it already exist or not?
            let check = false;
            t.position.map((p) => {
              if (p.title === firstData) check = true;
            });
            if (!check)
              t.position.push({
                title: firstData,
                requirements: [
                  { title: "Information" },
                  {
                    title: "Question",
                    val: ["General knowledge", "Mathematics", "Java"],
                  },
                ],
              });
          }
          return t;
        })
      );
    }
    setFirstData("");
  };

  return (
    <>
      {data.map((op) => (
        <div className={styles.question} key={op.title}>
          <h4>
            {op.title}
            {op.title === "Jobs" && (
              <span
                style={{
                  fontSize: "1.6rem",
                  cursor: "var(--pointer)",
                  display: "flex",
                  alignItems: "center",
                  padding: "5px",
                }}
                onClick={() =>
                  setAddData((pre) => (pre === op.title ? "" : op.title))
                }
              >
                <AddI />
              </span>
            )}
          </h4>
          {op.position.map((po) => {
            return (
              <div
                className={styles.itemPosition}
                key={po.title}
                style={{
                  borderBottom: jobShow === po.title ? "1px solid #999999" : "",
                  marginBottom: jobShow === po.title ? "7px" : "",
                  paddingBottom: jobShow === po.title ? "5px" : "",
                }}
                onClick={() => {
                  setJobShow((pre) => (pre === po.title ? "" : po.title));
                  setAddData("");
                }}
              >
                <div
                  className={styles.addTitle}
                  style={{
                    borderBottom:
                      jobShow === po.title ? "1px solid #999999" : "",
                    color: jobShow === po.title ? "#9ef3f7" : "",
                  }}
                >
                  {po.title}
                </div>
                {jobShow === po.title && (
                  <>
                    {po.requirements.map((qs) => (
                      <div
                        className={styles.questionIn}
                        key={qs.title}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowQuest((pre) =>
                            pre === po.title + qs.title
                              ? ""
                              : po.title + qs.title
                          );
                        }}
                      >
                        <div
                          className={styles.addTitle}
                          style={{
                            borderBottom:
                              showQues === po.title + qs.title
                                ? "1px solid #999999"
                                : "",
                          }}
                        >
                          <p
                            style={{
                              color:
                                showQues === po.title + qs.title
                                  ? "#9ef3f7"
                                  : "",
                            }}
                            className={styles.itemPositionIn}
                          >
                            {qs.title}
                          </p>

                          {showQues === po.title + qs.title &&
                            qs.title === "Question" && (
                              <span
                                style={{
                                  fontSize: "1.6rem",
                                  cursor: "var(--pointer)",
                                  display: "flex",
                                  alignItems: "center",
                                  padding: "5px",
                                }}
                              >
                                <AddI />
                              </span>
                            )}
                        </div>
                        {showQues === po.title + qs.title &&
                          qs.val &&
                          qs.val.map((v) => (
                            <div key={v} onClick={(e) => e.stopPropagation()}>
                              <p className={styles.itemPositionIn}>{v}</p>
                            </div>
                          ))}
                      </div>
                    ))}
                  </>
                )}
              </div>
            );
          })}
          {addData === op.title && (
            <div className={styles.divAdd}>
              <input
                type="text"
                placeholder={op.title}
                value={firstData}
                onChange={(e) => setFirstData(e.target.value)}
              />
              <button onClick={() => handleAdd(op.title)}>Add</button>
            </div>
          )}
        </div>
      ))}
      <div className={styles.question} style={{ textAlign: "start" }}>
        <h4>{candidate.title}</h4>
        {candidate.position.map((po) => {
          return (
            <p
              className={styles.itemPosition}
              key={po}
              onClick={() => setAddData("")}
            >
              {po}
            </p>
          );
        })}
      </div>
    </>
  );
};

export default Option;
