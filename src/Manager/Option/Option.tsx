"use client";
import React, { useEffect, useState } from "react";
import styles from "./option.module.scss";
import { AddI, MinusI } from "../../assets/Icons/Icons";
import { useQuery } from "@tanstack/react-query";
import cateParts from "../../API/catePartsAPI/catePartsAPI";
import catePartsAPI from "../../API/catePartsAPI/catePartsAPI";
import { useSelector } from "react-redux";
import { PropsUserDataRD } from "../../redux/userData";
import occupationAPI from "../../API/occupationAPI/occupationAPI";
export interface PropsOccupationData {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
const Option = () => {
  const { user } = useSelector(
    (state: { persistedReducer: { userData: PropsUserDataRD } }) => {
      return state.persistedReducer.userData;
    }
  );
  const [jobShow, setJobShow] = useState<string>(""); // TO show the Job
  const [showQues, setShowQuest] = useState<string>(""); // to show the Option
  const [addData, setAddData] = useState<string>(""); // add Job
  const [firstData, setFirstData] = useState<string>(""); // data occupation
  const [addDataCate, setAddDataCate] = useState<string>(""); // add Job
  const [cate, setCate] = useState<string>(""); // data catePart
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
  const { data } = useQuery({
    queryKey: ["JobCateParts", 1],
    enabled: user?.id ? true : false,
    queryFn: async () => {
      const rr: PropsOccupationData[] = await occupationAPI.getOccupation(
        user?.id
      );
      return rr;
    },
  });
  const [datas, setData] = useState<
    {
      id: string;
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
  >([]);
  useEffect(() => {
    if (data) {
      const items: typeof datas = [];
      data.forEach((d) => {
        items.push({
          id: d.id,
          title: "Jobs",
          position: [
            {
              title: d.name,
              requirements: [
                { title: "Information" },
                {
                  title: "Question",
                  val: ["General knowledge", "Mathematics", "Java"],
                },
              ],
            },
          ],
        });
      });
      setData(items);
    }
  }, [data]);
  const handleAdd = async (title: string) => {
    if (user?.id && firstData) {
      const res = await occupationAPI.addOccupation(user.id, firstData);
      console.log(res, "res addnew");

      if (res === 1 && title === "Jobs" && firstData) {
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
    }
  };
  const handleAddCatePart = async (id: string) => {
    if (id && cate) {
      console.log(
        "add new cate",
        "addDataCate",
        addDataCate,
        "jobShow",
        jobShow
      );
      const res = await catePartsAPI.addCatePart(id, cate);
      if (res === 1) {
        setData((pre) =>
          pre.map((t) => {
            if (t.title === "Jobs") {
              // check Does it already exist or not?
              t.position.map((p) => {
                if (p.title === jobShow) {
                  console.log("t.position", t.position);

                  p.requirements.map((r) => {
                    console.log("p.requirements", p.requirements);
                    if (r.title === addDataCate) {
                      r.val?.push(cate);
                    }
                    return r;
                  });
                  return p;
                }
                return p;
              });
            }
            return t;
          })
        );
      }
    }
  };
  return (
    <>
      {datas.map((op) => (
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
                {addData === op.title ? <MinusI /> : <AddI />}
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
              >
                <div
                  className={styles.addTitle}
                  style={{
                    borderBottom:
                      jobShow === po.title ? "1px solid #999999" : "",
                    color: jobShow === po.title ? "#9ef3f7" : "",
                  }}
                  onClick={() => {
                    setJobShow((pre) => (pre === po.title ? "" : po.title));
                    setAddData("");
                  }}
                >
                  {po.title}
                </div>
                {jobShow === po.title && (
                  <>
                    {po.requirements.map((qs) => (
                      <div className={styles.questionIn} key={qs.title}>
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
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowQuest((pre) =>
                                pre === po.title + qs.title
                                  ? ""
                                  : po.title + qs.title
                              );
                            }}
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setAddDataCate((pre) =>
                                    pre === qs.title ? "" : qs.title
                                  );
                                }}
                              >
                                {addDataCate === qs.title ? (
                                  <MinusI />
                                ) : (
                                  <AddI />
                                )}
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
                        {addDataCate === qs.title && (
                          <div className={styles.divAdd}>
                            <input
                              type="text"
                              placeholder={qs.title}
                              value={cate}
                              onChange={(e) => setCate(e.target.value)}
                            />
                            <button onClick={() => handleAddCatePart(op.id)}>
                              Add
                            </button>
                          </div>
                        )}
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
