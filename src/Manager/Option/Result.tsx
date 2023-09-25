import React, { ReactElement, useEffect, useState } from 'react';
import { Div, H3, Input, P, Textarea } from '../../styleComponent/styleComponent';
import { Space, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { AddI, CloseI, SettingI, TimerI } from '../../assets/Icons/Icons';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import questionAPI from '../../API/questionAPI/questionAPI';
import moment from 'moment';
import { Toast } from 'react-toastify/dist/components';

const Result: React.FC<{
    result: {
        $id: string;
        CreatedAt: string;
        Id: string;
        Name: string;
        OccupationId: string;
        AnswerType: string;
        TimeOut: number;
        TimeType: string;
        UpdatedAt: string;
    };
}> = ({ result }) => {
    const dataq: DataType[] = [];
    const [addData, setAddData] = useState<boolean>(false);
    const [type, setType] = useState<boolean>(() => (result.AnswerType === 'string' ? false : true)); // string or array
    const [showTimerType, setShowTimerType] = useState<boolean>(false);
    const [timer, setTimer] = useState<string>(result.TimeType);
    const [valTimer, setValTimer] = useState<number>(result.TimeOut);
    const [edit, setEdit] = useState<boolean>(false);
    const [reload, setReload] = useState<string>('ok');

    const [update, setUpdate] = useState<string>(''); //for question
    const [dataDelete, setDataDelete] = useState<string>('');
    const [question, setQuestion] = useState<{
        index: number;
        Name: string;
        Point: number;
        Answer: string;
        AnswerArray: string;
    }>({ index: 0, Name: '', Answer: '', Point: 0, AnswerArray: '' });
    interface DataType {
        index: number | ReactElement;
        key: string;
        questionName: string | ReactElement;
        answer: string | ReactElement;
        point: number | ReactElement;
        answerArray: string[] | ReactElement;
        createdAt?: string;
        id?: string;
    }
    const { data } = useQuery({
        queryKey: ['ResultQuestion', result.Id + reload],
        enabled: result !== undefined,
        queryFn: async () => {
            const rs: {
                answer: string;
                createdAt: string;
                id: string;
                partId: string;
                point: number;
                answerArray: string;
                questionName: string;
                updatedAt: string;
            }[] = await questionAPI.getQuestion(result.Id);
            return rs;
        },
        staleTime: 60 * 1000,
    });
    const [point, setPoint] = useState<string>(() => {
        const po = data?.reduce((sum, d) => (sum += d.point), 0);
        return po ? String(po) : '0';
    });
    useEffect(() => {
        if (data)
            setPoint(() => {
                const po = data?.reduce((sum, d) => (sum += d.point), 0);
                return po ? String(po) : '0';
            });
    }, [data]);
    const handleDelete = async (id: string) => {
        const isDel = window.confirm('Are you sure you want to delete this data!');
        if (isDel) {
            const res = await questionAPI.delete(id, result.Id);
            if (res) {
                setReload(id);
                toast('Delete successfully!');
            }
        }
    };
    const timerData = ['Hour', 'Minute', 'Second'];
    const columns: ColumnsType<DataType> = [
        {
            title: 'Index',
            dataIndex: 'index',
            key: 'index',
        },
        {
            title: 'Name',
            dataIndex: 'questionName',
            key: 'questionName',
            render: (text) => <P>{text}</P>,
        },
        {
            title: 'Answer Array',
            dataIndex: 'answerArray',
            key: 'answerArray',
        },
        {
            title: 'Answer',
            dataIndex: 'answer',
            key: 'answer',
        },
        {
            title: 'Point',
            dataIndex: 'point',
            key: 'point',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: 'Action',
            key: 'action',
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
                            onClick={() => {
                                if (record.id) setUpdate(record.id);
                            }}
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
                            onClick={() => {
                                if (record.id) setUpdate(record.id);
                                data?.map((d, index) => {
                                    if (d.id === record.id) {
                                        setQuestion({
                                            index: index + 1,
                                            Name: d.questionName,
                                            AnswerArray: d.answerArray,
                                            Answer: d.answer,
                                            Point: d.point,
                                        });
                                    }
                                });
                            }}
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
                            if (record?.id) handleDelete(record.id);
                        }}
                    >
                        Delete
                    </P>
                </Space>
            ),
        },
        {
            title: (
                <Div onClick={() => setAddData(true)} css="cursor: var(--pointer); font-size: 20px;">
                    <AddI />
                </Div>
            ),
            key: 'add',
        },
    ];

    const [dataRen, setDataRen] = useState<DataType[]>([]);
    // add question here
    const [answerArray, setAnswerArray] = useState<string[]>([]);
    const [answerArr, setAnswerArr] = useState<string>('');
    const [answerSt, setAnswerSt] = useState<string[]>([]);
    const [answerS, setAnswerS] = useState<string>('');
    const [questionN, setQuestionN] = useState<string>('');
    const [pointS, setPointS] = useState<string>('');
    const [err, setErr] = useState<{ name: boolean; ansArr: boolean; ansS: boolean; point: boolean }>({
        name: false,
        ansArr: false,
        ansS: false,
        point: false,
    });
    // update
    const [upData, setUpData] = useState<{
        answerArray: string[];
        answerArr: string;
        answerSt: string[];
        answerS: string;
        questionN: string;
        pointS: number;
    }>({
        answerArray: [],
        answerArr: '',
        answerSt: [],
        answerS: '',
        questionN: '',
        pointS: 0,
    });
    const handleAddQuestion = async () => {
        let errF = {
            name: false,
            ansArr: false,
            ansS: false,
            point: false,
        };
        if (
            answerArray.length &&
            JSON.stringify(answerArray).length < 300 &&
            answerSt.length &&
            JSON.stringify(answerSt).length < 300 &&
            questionN &&
            pointS
        ) {
            const res = await questionAPI.add(
                questionN,
                JSON.stringify(answerArray),
                JSON.stringify(answerSt),
                Number(pointS),
                result.Id,
            );
            if (res) {
                toast('Add successfully!');
                setReload(res);
                setAddData(false);
                setAnswerArray([]);
                setAnswerArr('');
                setAnswerSt([]);
                setAnswerS('');
                setQuestionN('');
                setPointS('');
            }
        }
        if (!answerArray.length) {
            errF.ansArr = true;
        }
        if (!answerSt.length) {
            errF.ansS = true;
        }
        if (!questionN) {
            errF.name = true;
        }
        if (!pointS) {
            errF.point = true;
        }
        setErr(errF);
    };
    const columnsAdd: ColumnsType<DataType> = [
        {
            title: 'Index',
            dataIndex: 'index',
            key: 'index',
        },
        {
            title: 'Name',
            dataIndex: 'questionName',
            key: 'questionName',
            render: (text) => <P>{text}</P>,
        },
        {
            title: 'Answer Array',
            dataIndex: 'answerArray',
            key: 'answerArray',
        },
        {
            title: 'Answer',
            dataIndex: 'answer',
            key: 'answer',
        },
        {
            title: 'Point',
            dataIndex: 'point',
            key: 'point',
        },

        {
            title: (
                <Div
                    onClick={handleAddQuestion}
                    css="cursor: var(--pointer); padding: 5px 9px; background-color: #87b0d3; border-radius: 5px;"
                >
                    <P size="1.4rem">Save</P>
                </Div>
            ),
            key: 'add',
        },
    ];

    const dataAdd: DataType[] = [
        {
            index: 66,
            key: 'addA',
            questionName: (
                <Textarea
                    placeholder="Question Name"
                    css={`
                        outline: none;
                        padding: 5px;
                        border-radius: 5px;
                        border-color: ${err.name ? 'red' : ''};
                    `}
                    value={questionN}
                    onChange={(e) => {
                        if (e.target.value.length < 300) {
                            setQuestionN(e.target.value);
                            setErr({ ...err, name: false });
                        }
                    }}
                />
            ),
            answerArray: (
                <Div
                    wrap="wrap"
                    css={`
                        justify-content: space-around;
                        textarea {
                            outline: none;
                            padding: 5px;
                            border-radius: 5px;
                            border-color: ${err.ansArr ? 'red' : ''};
                        }
                        button {
                            margin-top: 5px;
                            border-radius: 5px;
                            border: 0;
                            background-color: #c5c5c5;
                            padding: 5px 10px;
                        }
                    `}
                >
                    {answerArray.length ? (
                        <Div width="100%" display="block">
                            {answerArray.map((a, index) => (
                                <Div css="position: relative; &:hover{    background-color: #d9d8d6; border-radius: 5px; padding: 2px 5px;}">
                                    <P key={a} size="1.4rem" css="width: 100%; ">
                                        {index + 1} -- {a}
                                    </P>
                                    <Div
                                        width="auto"
                                        css="font-size: 17px; padding: 2px; cursor: var(--pointer); position: absolute; top: 2px; right: 0;"
                                        onClick={() => setAnswerArray((pre) => pre.filter((aR) => aR !== a))}
                                    >
                                        <CloseI />
                                    </Div>
                                </Div>
                            ))}
                        </Div>
                    ) : (
                        ''
                    )}
                    <Textarea
                        placeholder="Add Answer"
                        value={answerArr}
                        onChange={(e) => {
                            if (JSON.stringify(answerArray).length < 300) {
                                setErr({ ...err, ansArr: false });
                                setAnswerArr(e.target.value);
                            }
                        }}
                    />
                    <button
                        onClick={() => {
                            let checkA = false;
                            answerArray.forEach((a) => {
                                if (answerArr === a) checkA = true;
                            });
                            if (!checkA) {
                                setAnswerArray([...answerArray, answerArr]);
                            }
                            setAnswerArr('');
                        }}
                    >
                        Add
                    </button>
                </Div>
            ),
            answer: (
                <Div
                    wrap="wrap"
                    css={`
                        justify-content: space-around;
                        textarea {
                            outline: none;
                            padding: 5px;
                            border-radius: 5px;
                            border-color: ${err.ansS ? 'red' : ''};
                        }
                        button {
                            margin-top: 5px;
                            border-radius: 5px;
                            border: 0;
                            background-color: #c5c5c5;
                            padding: 5px 10px;
                        }
                    `}
                >
                    {answerSt.length ? (
                        <Div width="100%" display="block">
                            {answerSt.map((a, index) => (
                                <Div css="position: relative; &:hover{    background-color: #d9d8d6; border-radius: 5px; padding: 2px 5px;}">
                                    <P key={a} size="1.4rem" css="width: 100%; ">
                                        {index + 1} -- {a}
                                    </P>
                                    <Div
                                        width="auto"
                                        css="font-size: 17px; padding: 2px; cursor: var(--pointer); position: absolute; top: 2px; right: 0;"
                                        onClick={() => setAnswerSt((pre) => pre.filter((aR) => aR !== a))}
                                    >
                                        <CloseI />
                                    </Div>
                                </Div>
                            ))}
                        </Div>
                    ) : (
                        ''
                    )}
                    <Textarea
                        placeholder="Correction answer"
                        value={answerS}
                        onChange={(e) => {
                            if (JSON.stringify(answerSt).length < 300) {
                                setAnswerS(e.target.value);
                                setErr({ ...err, ansS: false });
                            }
                        }}
                    />
                    <button
                        onClick={() => {
                            let checkA = false;
                            if (answerArray.some((answer) => answer === answerS)) {
                                answerSt.forEach((a) => {
                                    if (answerArr === a) checkA = true;
                                });
                                if (!checkA) {
                                    setAnswerSt([...answerSt, answerS]);
                                }
                                setAnswerS('');
                            } else {
                                setErr({ ...err, ansS: true });
                            }
                        }}
                    >
                        Add
                    </button>
                </Div>
            ),
            point: (
                <Input
                    type="number"
                    placeholder="Point"
                    value={pointS}
                    css={`
                        padding: 3px 4px;
                        width: 80px;
                        border-color: ${err.point ? 'red' : ''};
                    `}
                    onChange={(e) => {
                        setPointS(e.target.value);
                        setErr({ ...err, point: false });
                    }}
                />
            ),
        },
    ];

    data?.map((d, index) => {
        dataq.push({
            id: d.id,
            key: d.questionName,
            index: index + 1,
            questionName: d.questionName,
            answerArray: (
                <Div width="auto" display="block">
                    {JSON.parse(d.answerArray).map((a: string, index: number) => (
                        <P key={a} size="1.4rem" css="width: 100%;">
                            {index + 1} -- {a}
                        </P>
                    ))}
                </Div>
            ),
            answer: (
                <Div width="auto" display="block">
                    {JSON.parse(d.answer).map((a: string, index: number) => (
                        <P key={a} size="1.4rem" css="width: 100%;">
                            {index + 1} -- {a}
                        </P>
                    ))}
                </Div>
            ),
            point: d.point,
            createdAt: moment(d.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        });
    });
    const handleUpdate = async (id: string) => {};
    const columnsUpdate: ColumnsType<DataType> = [
        {
            title: 'Index',
            dataIndex: 'index',
            key: 'index',
        },
        {
            title: 'Name',
            dataIndex: 'questionName',
            key: 'questionName',
            render: (text) => <P>{text}</P>,
        },
        {
            title: 'Answer Array',
            dataIndex: 'answerArray',
            key: 'answerArray',
        },
        {
            title: 'Answer',
            dataIndex: 'answer',
            key: 'answer',
        },
        {
            title: 'Point',
            dataIndex: 'point',
            key: 'point',
        },

        {
            title: 'Action',
            key: 'action',
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
                        onClick={() => {
                            if (record.id) handleUpdate(record.id);
                        }}
                    >
                        Save
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
                        onClick={() => {
                            if (record.id) handleDelete(record.id);
                        }}
                    >
                        Delete
                    </P>
                </Space>
            ),
        },
    ];
    const dataUpdate = dataq
        .filter((d) => d.id === update)
        .map((d) => {
            if (d.id === update) {
                const ddd = data?.filter((dr) => dr.id === d.id)[0].answerArray
                    ? JSON.parse(data?.filter((dr) => dr.id === d.id)[0].answerArray)
                    : [];
                const fff = data?.filter((dr) => dr.id === d.id)[0].answer
                    ? JSON.parse(data?.filter((dr) => dr.id === d.id)[0].answer)
                    : [];
                d.questionName = (
                    <Textarea
                        value={question.Name}
                        onChange={(e) => setQuestion({ ...question, Name: e.target.value })}
                        css={`
                            padding: 3px;
                            border-radius: 5px;
                            margin-right: 3px;
                        `}
                    />
                );
                d.answerArray = (
                    <Div
                        wrap="wrap"
                        css={`
                            justify-content: space-around;
                            textarea {
                                outline: none;
                                padding: 5px;
                                border-radius: 5px;
                                border-color: ${err.ansArr ? 'red' : ''};
                            }
                            button {
                                margin-top: 5px;
                                border-radius: 5px;
                                border: 0;
                                background-color: #c5c5c5;
                                padding: 5px 10px;
                            }
                        `}
                    >
                        {ddd.length ? (
                            <Div width="100%" display="block" css="margin-bottom: 4px;">
                                {ddd.map((a: string, index: number) => (
                                    <Div
                                        key={a}
                                        css="position: relative; cursor: var(--pointer); &:hover{    background-color: #d9d8d6; border-radius: 5px; padding: 2px 5px;}"
                                    >
                                        <P size="1.4rem" css="width: 100%; ">
                                            {index + 1} -- {a}
                                        </P>
                                        <Div
                                            width="auto"
                                            css="font-size: 17px; padding: 2px; cursor: var(--pointer); position: absolute; top: 2px; right: 0;"
                                            onClick={() => setAnswerArray((pre) => pre.filter((aR) => aR !== a))}
                                        >
                                            <CloseI />
                                        </Div>
                                    </Div>
                                ))}
                            </Div>
                        ) : (
                            ''
                        )}
                        <Textarea
                            value={question.AnswerArray}
                            onChange={(e) => setQuestion({ ...question, Name: e.target.value })}
                            css={`
                                padding: 3px;
                                border-radius: 5px;
                                margin-right: 3px;
                            `}
                        />
                        <button
                            onClick={() => {
                                let checkA = false;
                                answerArray.forEach((a) => {
                                    if (answerArr === a) checkA = true;
                                });
                                if (!checkA) {
                                    setAnswerArray([...answerArray, answerArr]);
                                }
                                setAnswerArr('');
                            }}
                        >
                            Change
                        </button>
                    </Div>
                );
                d.answer = (
                    <Div
                        wrap="wrap"
                        css={`
                            justify-content: space-around;
                            textarea {
                                outline: none;
                                padding: 5px;
                                border-radius: 5px;
                                border-color: ${err.ansArr ? 'red' : ''};
                            }
                            button {
                                margin-top: 5px;
                                border-radius: 5px;
                                border: 0;
                                background-color: #c5c5c5;
                                padding: 5px 10px;
                            }
                        `}
                    >
                        {fff.length ? (
                            <Div width="100%" display="block" css="margin-bottom: 4px;">
                                {fff.map((a: string, index: number) => (
                                    <Div
                                        key={a}
                                        css="position: relative; cursor: var(--pointer); &:hover{    background-color: #d9d8d6; border-radius: 5px; padding: 2px 5px;}"
                                    >
                                        <P size="1.4rem" css="width: 100%; ">
                                            {index + 1} -- {a}
                                        </P>
                                        <Div
                                            width="auto"
                                            css="font-size: 17px; padding: 2px; cursor: var(--pointer); position: absolute; top: 2px; right: 0;"
                                            onClick={() => setAnswerArray((pre) => pre.filter((aR) => aR !== a))}
                                        >
                                            <CloseI />
                                        </Div>
                                    </Div>
                                ))}
                            </Div>
                        ) : (
                            ''
                        )}
                        <Textarea
                            value={question.Answer}
                            onChange={(e) => setQuestion({ ...question, Answer: e.target.value })}
                            css={`
                                padding: 3px;
                                border-radius: 5px;
                                margin-right: 3px;
                            `}
                        />
                        <button
                            onClick={() => {
                                let checkA = false;
                                answerArray.forEach((a) => {
                                    if (answerArr === a) checkA = true;
                                });
                                if (!checkA) {
                                    setAnswerArray([...answerArray, answerArr]);
                                }
                                setAnswerArr('');
                            }}
                        >
                            Change
                        </button>
                    </Div>
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
                            border-radius: 5px;
                            margin-right: 3px;
                        `}
                    />
                );
            }
            return d;
        });
    return (
        <Div width="82%" css="overflow: overlay; position: relative;">
            <Div
                width="90%"
                display="block"
                css={`
                    height: 100%;
                    color: #fff;
                    overflow: overlay;
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
                            ${!type ? 'background-image: linear-gradient(123deg, #37aece, #070101);' : ''}
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
                                    if (timer === 'Hour' && t < 25) {
                                        setValTimer(t);
                                    } else if (timer === 'Minute' && t < 61) {
                                        setValTimer(t);
                                    } else if (timer === 'Second' && t < 60) {
                                        setValTimer(t);
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
                                            background-color: ${timer === t ? '#389f32 ' : '#626262'} !important;
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
                                <P size="1.3rem" css="margin: 0 2px;" onClick={() => setShowTimerType(!showTimerType)}>
                                    {valTimer + ' ' + timer + (Number(valTimer) > 1 ? 's' : '')}
                                </P>
                            )}
                        </Div>
                    </Div>
                    <P
                        onClick={() => setType(true)}
                        css={`
                            ${type ? 'background-image: linear-gradient(123deg, #37aece, #070101);' : ''}
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
                        {result.Name} ({' '}
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
                        )}{' '}
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
                            style={{ width: '100%' }}
                            columns={columns}
                            dataSource={dataq}
                            pagination={{
                                pageSize: 5,
                            }}
                        />
                    ) : (
                        <Table
                            style={{ width: '100%' }}
                            columns={columns}
                            dataSource={[]}
                            pagination={{
                                pageSize: 5,
                            }}
                        />
                    )}
                </Div>
                {update && (
                    <Div
                        css={`
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            position: absolute;
                            background-color: #141414d4;
                            overflow: overlay;
                            tbody {
                                background-color: #ffffff;
                            }
                        `}
                        onClick={() => setUpdate('')}
                    >
                        <Div onClick={(e) => e.stopPropagation()}>
                            <Table style={{ width: '75%' }} columns={columnsUpdate} dataSource={dataUpdate} />
                        </Div>
                    </Div>
                )}
                {addData && (
                    <Div
                        css={`
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            overflow: overlay;
                            position: absolute;
                            background-color: #141414d4;
                        `}
                        onClick={() => setAddData(false)}
                    >
                        <Div onClick={(e) => e.stopPropagation()}>
                            <Table style={{ width: '75%' }} columns={columnsAdd} dataSource={dataAdd} />
                        </Div>
                    </Div>
                )}
            </Div>
        </Div>
    );
};

export default Result;
