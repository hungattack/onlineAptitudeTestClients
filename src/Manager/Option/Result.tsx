import React, { useState } from "react";
import { Div, H3, Input, P } from "../../styleComponent/styleComponent";
import { Space, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { SettingI, TimerI } from "../../assets/Icons/Icons";

const Result = () => {
  const [type, setType] = useState<boolean>(false);
  const [showTimerType, setShowTimerType] = useState<boolean>(false);
  const [timer, setTimer] = useState<string>("Minute");
  const [valTimer, setValTimer] = useState<string>("");
  const [edit, setEdit] = useState<boolean>(false);
  interface DataType {
    index: number;
    key: string;
    name: string;
    answer: string;
    point: number;
  }
  const timerData = ["Hour", "Minute", "Second"];
  const columns: ColumnsType<DataType> = [
    {
      title: "Index",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <P>{text}</P>,
    },
    {
      title: "Answer",
      dataIndex: "answer",
      key: "answer",
    },
    {
      title: "Point",
      dataIndex: "point",
      key: "point",
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <P
            css={`
              padding: 3px 7px;
              background-color: #4785d5;
              border-radius: 5px;
              color: #fff;
              font-size: 1.3rem;
              cursor: var(--pointer);
            `}
          >
            Update
          </P>
          <P
            css={`
              padding: 3px 7px;
              background-color: #c43a68;
              border-radius: 5px;
              color: #fff;
              font-size: 1.3rem;
              cursor: var(--pointer);
            `}
          >
            Delete
          </P>
        </Space>
      ),
    },
  ];

  const data: DataType[] = [
    {
      index: 1,
      key: "1",
      name: "John Brown",
      answer: "Me!",
      point: 30,
    },
    {
      index: 2,
      key: "2",
      name: "Jim Green",
      answer: "Me!",
      point: 10,
    },
    {
      index: 3,
      key: "3",
      name: "Joe Black",
      answer: "Me!",
      point: 50,
    },
  ];
  const dataF: DataType[] = [
    {
      index: 1,
      key: "1",
      name: "Hung",
      answer: "Me!",
      point: 30,
    },
    {
      index: 2,
      key: "2",
      name: "Jim Green",
      answer: "Me!",
      point: 10,
    },
    {
      index: 3,
      key: "3",
      name: "Joe Black",
      answer: "Me!",
      point: 50,
    },
  ];
  return (
    <Div>
      <Div
        width="70%"
        wrap="wrap"
        css={`
          color: #fff;
        `}
      >
        <Div
          css={`
            color: #333;
            justify-content: space-evenly;
            margin: 5px 0;
            p {
              font-size: 1.4rem;
              padding: 4px 12px;
              border-radius: 5px;
              color: #fff;
              background-color: #626262;
              cursor: var(--pointer);
            }
          `}
        >
          <P
            onClick={() => setType(false)}
            css={`
              ${!type
                ? "background-image: linear-gradient(123deg, #37aece, #070101);"
                : ""}
            `}
          >
            String
          </P>
          <Div
            css={`
              font-size: 30px;
            `}
          >
            <TimerI />
            {/* <TimerI /> <P size="1.3rem">2 hours</P> */}
            {/* <P size="1.3rem">2</P> */}
            {edit && (
              <Input
                type="text"
                value={valTimer}
                onChange={(e) => {
                  const t = Number(e.target.value);
                  if (timer === "Hour" && t < 25) {
                    setValTimer(e.target.value);
                  } else if (timer === "Minute" && t < 61) {
                    setValTimer(e.target.value);
                  } else if (timer === "Second" && t < 60) {
                    setValTimer(e.target.value);
                  }
                }}
                css={`
                  padding: 3px;
                  width: 45px;
                  border-radius: 5px;
                  margin-right: 3px;
                `}
              />
            )}
            <Div width="auto">
              {showTimerType && edit ? (
                timerData.map((t) => (
                  <P
                    size="1.3rem"
                    css={`
                      margin: 0 2px;
                      background-color: ${timer === t
                        ? "#389f32 "
                        : "#626262"} !important;
                    `}
                    key={t}
                    onClick={() => {
                      setShowTimerType(false);
                      setTimer(t);
                    }}
                  >
                    {t}
                  </P>
                ))
              ) : (
                <P
                  size="1.3rem"
                  css="margin: 0 2px;"
                  onClick={() => setShowTimerType(!showTimerType)}
                >
                  {valTimer + " " + timer}
                </P>
              )}
            </Div>
          </Div>
          <P
            onClick={() => setType(true)}
            css={`
              ${type
                ? "background-image: linear-gradient(123deg, #37aece, #070101);"
                : ""}
            `}
          >
            [Array]
          </P>
        </Div>

        <Div
          css={`
            width: 100%;
            background-image: linear-gradient(123deg, #37aece, #070101);
            border-radius: 5px;
            padding: 5px;
            margin-bottom: 5px;
            position: relative;
          `}
        >
          <H3 css="width: 100%; " size="1.4rem">
            General knowledge ( 100 points )
          </H3>
          <Div
            width="auto"
            css={`
              position: absolute;
              top: 8px;
              right: 8px;
              cursor: var(--pointer);
            `}
            onClick={() => setEdit(!edit)}
          >
            <SettingI />
          </Div>
        </Div>
        <Div
          css={`
            background-image: linear-gradient(45deg, #565656, #d0d0d0);
            border-radius: 8px;
          `}
        >
          {type ? (
            <Table
              style={{ width: "100%" }}
              columns={columns}
              dataSource={data}
            />
          ) : (
            <Table
              style={{ width: "100%" }}
              columns={columns}
              dataSource={dataF}
            />
          )}
        </Div>
      </Div>
    </Div>
  );
};

export default Result;
