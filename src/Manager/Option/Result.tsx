import React, { ReactElement, useState } from "react";
import {
  Div,
  H3,
  Input,
  P,
  Textarea,
} from "../../styleComponent/styleComponent";
import { Space, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { SettingI, TimerI } from "../../assets/Icons/Icons";
import { toast } from "react-toastify";

const Result = () => {
  const [type, setType] = useState<boolean>(false); // string or array
  const [showTimerType, setShowTimerType] = useState<boolean>(false);
  const [timer, setTimer] = useState<string>("Minute");
  const [valTimer, setValTimer] = useState<string>("5");
  const [edit, setEdit] = useState<boolean>(false);
  const [point, setPoint] = useState<string>("100");
  const [update, setUpdate] = useState<string>(""); //for question
  const [dataDelete, setDataDelete] = useState<string>("");
  const [question, setQuestion] = useState<{
    Name: string;
    Point: number;
    Answer: string;
  }>({ Name: "", Answer: "", Point: 0 });
  interface DataType {
    index: number | ReactElement;
    key: string;
    name: string | ReactElement;
    answer: string | ReactElement;
    point: number | ReactElement;
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
          {update && record.key === update ? (
            <P
              css={`
                padding: 3px 7px;
                background-color: #4785d5;
                border-radius: 5px;
                color: #fff;
                font-size: 1.3rem;
                cursor: var(--pointer);
              `}
              onClick={() => setUpdate(record.key)}
            >
              Save
            </P>
          ) : (
            <P
              css={`
                padding: 3px 7px;
                background-color: #4785d5;
                border-radius: 5px;
                color: #fff;
                font-size: 1.3rem;
                cursor: var(--pointer);
              `}
              onClick={() => setUpdate(record.key)}
            >
              Update
            </P>
          )}
          <P
            css={`
              padding: 3px 7px;
              background-color: #c43a68;
              border-radius: 5px;
              color: #fff;
              font-size: 1.3rem;
              cursor: var(--pointer);
            `}
            onClick={() => {
              const isDel = window.confirm(
                "Are you sure you want to delete this data!"
              );

              if (isDel) {
                const notify = () => toast("Wow so easy!");
                notify();
                setDataDelete(record.key);
              }
            }}
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
  const dataUpdate = data
    .filter((d) => d.key === update)
    .map((d) => {
      if (d.key === update) {
        d.name = (
          <Textarea
            value={question.Name}
            onChange={(e) => setQuestion({ ...question, Name: e.target.value })}
            css={`
              padding: 3px;
              width: 45px;
              border-radius: 5px;
              margin-right: 3px;
            `}
          />
        );
        d.answer = (
          <Textarea
            value={question.Answer}
            onChange={(e) =>
              setQuestion({ ...question, Answer: e.target.value })
            }
            css={`
              padding: 3px;
              width: 45px;
              border-radius: 5px;
              margin-right: 3px;
            `}
          />
        );
        d.point = (
          <Textarea
            value={question.Point}
            onChange={(e) => {
              if (!isNaN(Number(e.target.value)))
                setQuestion({ ...question, Point: Number(e.target.value) });
            }}
            css={`
              padding: 3px;
              width: 45px;
              border-radius: 5px;
              margin-right: 3px;
            `}
          />
        );
      }
      return d;
    });
  for (let i = 0; i < 46; i++) {
    data.push({
      index: i,
      key: `3${i}`,
      name: "Joe Black",
      answer: "Me!",
      point: 50,
    });
  }
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
            position: relative;
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
                  {valTimer + " " + timer + (Number(valTimer) > 1 ? "s" : "")}
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
            General knowledge ({" "}
            {edit ? (
              <Input
                type="text"
                value={point}
                onChange={(e) => {
                  if (!isNaN(Number(e.target.value))) setPoint(e.target.value);
                }}
                css={`
                  padding: 3px;
                  width: 45px;
                  border-radius: 5px;
                  margin-right: 3px;
                `}
              />
            ) : (
              point
            )}{" "}
            points )
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
          width="auto"
          css={`
            cursor: var(--pointer);
            color: #333;
            padding: 5px 10px;
            background-color: #42c0ff;
            border-radius: 5px;
            margin: 5px 0;
          `}
        >
          <P size="1.3rem">Save</P>
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
              pagination={{
                pageSize: 5,
              }}
            />
          ) : (
            <Table
              style={{ width: "100%" }}
              columns={columns}
              dataSource={dataF}
            />
          )}
        </Div>
        {update && (
          <Div
            css={`
              position: absolute;
              background-color: #141414d4;
              width: 81.9%;
              height: 92%;
            `}
            onClick={() => setUpdate("")}
          >
            <Div onClick={(e) => e.stopPropagation()}>
              <Table
                style={{ width: "75%" }}
                columns={columns}
                dataSource={dataUpdate}
              />
            </Div>
          </Div>
        )}
      </Div>
    </Div>
  );
};

export default Result;
