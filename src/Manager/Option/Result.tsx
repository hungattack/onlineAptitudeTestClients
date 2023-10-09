import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { Div, H3, InputA, P, Textarea } from '../../styleComponent/styleComponent';
import { Space, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { AddI, CloseI, SettingI, TimerI } from '../../assets/Icons/Icons';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import questionAPI from '../../API/questionAPI/questionAPI';
import moment from 'moment';
import { Toast } from 'react-toastify/dist/components';
import { useSelector } from 'react-redux';
import { PropsUserDataRD } from '../../redux/userData';
import catePartsAPI from '../../API/catePartsAPI/catePartsAPI';

const Result: React.FC<{
    result: {
        $id?: string;
        CreatedAt: string;
        Id: string;
        Name: string;
        OccupationId: string;
        TimeOut: number;
        TimeType: string;
        UpdatedAt: string;
    };
    setReChange: React.Dispatch<
        React.SetStateAction<
            | {
                  id: string;
                  name: string;
                  val: number | string;
              }[]
            | undefined
        >
    >;
}> = ({ result, setReChange }) => {
    const user = useSelector((state: { persistedReducer: { userData: PropsUserDataRD } }) => {
        return state.persistedReducer.userData.user;
    });
    const dataq: DataType[] = [];
    const [addData, setAddData] = useState<boolean>(false);
    const [type, setType] = useState<string>('string'); // string or array
    const [showTimerType, setShowTimerType] = useState<boolean>(false);
    const [timer, setTimer] = useState<string>(result.TimeType);
    const [valTimer, setValTimer] = useState<number>(result.TimeOut ?? 0);
    const [catePart, setCatePart] = useState<string>(result.Name);
    const [edit, setEdit] = useState<boolean>(false);
    const [reload, setReload] = useState<string>('ok');
    console.log(timer, 'timer, setTimer] ', result);

    const [updateF, setUpdateF] = useState<string>(''); //for question
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
        answer?: string | ReactElement;
        point: number | ReactElement;
        answerArray?: string[] | ReactElement;
        createdAt?: string;
        answerType?: string;
        id?: string;
    }
    const { data, refetch } = useQuery({
        queryKey: ['ResultQuestion', result.Id + reload + type],
        enabled: result !== undefined,
        queryFn: async () => {
            const rs: {
                answer: string;
                createdAt: string;
                id: string;
                partId: string;
                point: number;
                answerArray: string;
                answerType: string;
                questionName: string;
                updatedAt: string;
            }[] = await questionAPI.getQuestion(result.Id, type);
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
    useEffect(() => {
        if (result.TimeOut && result.TimeOut !== valTimer) {
            setValTimer(result.TimeOut);
        }
        if (result.TimeType && result.TimeType !== timer) {
            setTimer(result.TimeType);
        }
        if (result.Name !== catePart) {
            setCatePart(result.Name);
        }
    }, [result]);
    const handleDelete = async (id: string) => {
        const isDel = window.confirm('Are you sure you want to delete this data!');
        if (isDel) {
            const res = await questionAPI.delete(id, result.Id);
            if (res) {
                setUpdateF('');
                setReload(id);
                toast('Delete successfully!');
            }
        }
    };
    const timerData = ['Hour', 'Minute', 'Second'];
    let columns: ColumnsType<DataType> = [
        {
            title: 'Index',
            dataIndex: 'index',
            key: 'index',
        },
        {
            title: 'Name',
            dataIndex: 'questionName',
            key: 'questionName',
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
                    {updateF && record.key === updateF ? (
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
                                if (record.id) setUpdateF(record.id);
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
                                if (record.id) setUpdateF(record.id);
                                data?.map((d, index) => {
                                    if (d.id === record.id) {
                                        setUpData({
                                            id: record.id,
                                            partId: result.Id,
                                            occupation: result.OccupationId,
                                            questionN: d.questionName,
                                            answerArray: JSON.parse(d.answerArray),
                                            answerSt: JSON.parse(d.answer),
                                            pointS: d.point,
                                        });
                                        isUpdate.current = {
                                            id: record.id,
                                            partId: result.Id,
                                            occupation: result.OccupationId,
                                            questionN: d.questionName,
                                            answerArray: JSON.parse(d.answerArray),
                                            answerSt: JSON.parse(d.answer),
                                            pointS: d.point,
                                        };
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
    if (type === 'string') {
        columns = columns.filter((co) => co.title !== 'Answer' && co.title !== 'Answer Array');
    }
    const [dataRen, setDataRen] = useState<DataType[]>([]);
    // add question here array
    const [answerArray, setAnswerArray] = useState<string[]>([]);
    const [answerArr, setAnswerArr] = useState<string>('');
    const [answerSt, setAnswerSt] = useState<string[]>([]);
    const [answerS, setAnswerS] = useState<string>('');
    // string
    const [questionN, setQuestionN] = useState<string>('');
    const [pointS, setPointS] = useState<string>('');
    const [err, setErr] = useState<{ name: boolean; ansArr: boolean; ansS: boolean; point: boolean }>({
        name: false,
        ansArr: false,
        ansS: false,
        point: false,
    });
    console.log('type', type);

    // update
    const isUpdate = useRef<{
        id: string;
        partId: string;
        occupation: string;
        answerArray: string[];
        answerArr?: string;
        answerSt: string[];
        answerS?: string;
        questionN: string;
        pointS: number;
    }>({
        id: '',
        partId: '',
        occupation: '',
        answerArray: [],
        answerArr: '',
        answerSt: [],
        answerS: '',
        questionN: '',
        pointS: 0,
    });
    const [upData, setUpData] = useState<{
        id: string;
        partId: string;
        occupation: string;
        answerArray: string[];
        answerArr?: string;
        answerSt: string[];
        answerS?: string;
        questionN: string;
        pointS: number;
        which?: {
            aArr?: number;
            aSt?: number;
        };
    }>({
        id: '',
        partId: '',
        occupation: '',
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
        if (type === 'array') {
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
                    Number(pointS),
                    result.Id,
                    'array',
                    JSON.stringify(answerArray),
                    JSON.stringify(answerSt),
                );
                if (res === 'ok') {
                    toast('Add successfully!');
                    setReload(res);
                    setAddData(false);
                    setAnswerArray([]);
                    setAnswerArr('');
                    setAnswerSt([]);
                    setAnswerS('');
                    setQuestionN('');
                    refetch();
                    setPointS('');
                }
            }
        } else {
            if (questionN && pointS) {
                const res = await questionAPI.add(questionN, Number(pointS), result.Id, 'string');
                if (res === 'ok') {
                    toast('Add successfully!');
                    setReload(res);
                    setAddData(false);
                    setQuestionN('');
                    refetch();
                    setPointS('');
                }
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
    let columnsAddArr: ColumnsType<DataType> = [
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
    let columnsAddString: ColumnsType<DataType> = [
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
    const dataAddArray: DataType[] = [
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
                            cursor: var(--pointer);
                        }
                    `}
                >
                    {answerArray.length ? (
                        <Div width="100%" display="block">
                            {answerArray.map((a, index) => (
                                <Div
                                    key={a}
                                    css="position: relative; &:hover{    background-color: #d9d8d6; border-radius: 5px; padding: 2px 5px;}"
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
                    <Div>
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
                                if (answerArr) {
                                    answerArray.forEach((a) => {
                                        if (answerArr === a) checkA = true;
                                    });
                                    if (!checkA) {
                                        setAnswerArray([...answerArray, answerArr]);
                                    }
                                    setAnswerArr('');
                                } else {
                                    setErr({ ...err, ansArr: true });
                                }
                            }}
                        >
                            <AddI />
                        </button>
                    </Div>
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
                            cursor: var(--pointer);
                        }
                    `}
                >
                    {answerSt.length ? (
                        <Div width="100%" display="block">
                            {answerSt.map((a, index) => (
                                <Div
                                    key={a}
                                    css="position: relative; &:hover{    background-color: #d9d8d6; border-radius: 5px; padding: 2px 5px;}"
                                >
                                    <P size="1.4rem" css="width: 100%; ">
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
                    <Div>
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
                                if (answerS) {
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
                                } else {
                                    setErr({ ...err, ansS: true });
                                }
                            }}
                        >
                            <AddI />
                        </button>
                    </Div>
                </Div>
            ),
            point: (
                <InputA
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
    const dataAddString: DataType[] = [
        {
            index: 66,
            key: 'addS',
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

            point: (
                <InputA
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
        console.log('yes array', d);

        if (d.answerType === 'array') {
            console.log('yes array');
            dataq.push({
                id: d.id,
                key: d.questionName + d.id,
                index: index + 1,
                questionName: d.questionName,
                answerType: d.answerType,
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
        } else {
            dataq.push({
                id: d.id,
                key: d.questionName,
                answerType: d.answerType,
                index: index + 1,
                questionName: d.questionName,
                point: d.point,
                createdAt: moment(d.createdAt).format('YYYY-MM-DD HH:mm:ss'),
            });
        }
    });
    const handleUpdate = async (id: string) => {
        let checkUpdata = err;
        if (type === 'array') {
            if (!upData.questionN) checkUpdata.name = true;
            if (!upData.answerArray.length) checkUpdata.ansArr = true;
            if (!upData.answerSt.length) checkUpdata.ansS = true;
            if (!upData.pointS) checkUpdata.point = true;
            if (
                JSON.stringify(isUpdate.current) !== JSON.stringify(upData) &&
                upData.id &&
                upData.partId &&
                upData.occupation &&
                user?.id &&
                upData.answerArray.length &&
                upData.questionN &&
                upData.answerSt.length &&
                upData.pointS
            ) {
                const res = await questionAPI.update(
                    upData.id,
                    user.id,
                    upData.partId,
                    upData.occupation,
                    upData.questionN,
                    upData.pointS,
                    type,
                    JSON.stringify(upData.answerArray),
                    JSON.stringify(upData.answerSt),
                );
                if (res) {
                    setReload(`${Math.random() * 100}updateQuestion`);
                    toast('Update successful');
                    setUpdateF('');
                }
            } else {
                console.log(err);

                setErr({ ...err });
            }
        } else {
            if (!upData.questionN) checkUpdata.name = true;
            if (!upData.pointS) checkUpdata.point = true;
            if (
                JSON.stringify(isUpdate.current) !== JSON.stringify(upData) &&
                upData.id &&
                upData.partId &&
                upData.occupation &&
                user?.id &&
                upData.questionN &&
                upData.pointS
            ) {
                const res = await questionAPI.update(
                    upData.id,
                    user.id,
                    upData.partId,
                    upData.occupation,
                    upData.questionN,
                    upData.pointS,
                    type,
                );
                if (res) {
                    setReload(`${Math.random() * 100}updateQuestion`);
                    toast('Update successful');
                    setUpdateF('');
                }
            } else {
                console.log(err);
                setErr({ ...err });
            }
        }
        console.log(upData, 'update');
    };
    let columnsUpdate: ColumnsType<DataType> = [
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
    if (type === 'string')
        columnsUpdate = columnsUpdate.filter((co) => co.title !== 'Answer' && co.title !== 'Answer Array');
    console.log(dataq, 'dataq');

    const dataUpdate = dataq
        .filter((d) => d.id === updateF)
        .map((d) => {
            if (d.id === updateF) {
                const ddd = upData.answerArray;
                console.log('111', d);

                const fff = upData.answerSt;

                d.questionName = (
                    <Textarea
                        value={upData.questionN}
                        onChange={(e) => {
                            if (!e.target.value) {
                                setErr({ ...err, name: true });
                            } else {
                                setErr({ ...err, name: false });
                            }
                            setUpData({ ...upData, questionN: e.target.value });
                        }}
                        css={`
                            padding: 3px;
                            border-radius: 5px;
                            margin-right: 3px;
                            border-color: ${err.name ? 'red' : ''};
                        `}
                    />
                );
                if (d.answerType === 'array') {
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
                                    cursor: var(--pointer);
                                }
                            `}
                        >
                            {ddd.length ? (
                                <Div width="100%" display="block" css="margin-bottom: 4px;">
                                    {ddd.map((a: string, index: number) => (
                                        <Div
                                            key={a}
                                            css={`
                                                position: relative;
                                                cursor: var(--pointer);
                                                &:hover {
                                                    background-color: #d9d8d6;
                                                }
                                                background-color: ${upData.which?.aArr === index + 1 ? '#dadada' : ''};
                                                padding: 2px 5px;
                                                border-radius: 5px;
                                            `}
                                            onClick={() => {
                                                setUpData({
                                                    ...upData,
                                                    answerArr: a,
                                                    which: { ...upData.which, aArr: index + 1 },
                                                });
                                            }}
                                        >
                                            <P size="1.4rem" css="width: 100%; ">
                                                {index + 1} -- {a}
                                            </P>
                                            <Div
                                                width="auto"
                                                css="font-size: 17px; padding: 2px; cursor: var(--pointer); position: absolute; top: 2px; right: 0;"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const r = upData.answerArray.filter((aR) => aR !== a);
                                                    setUpData((pre) => {
                                                        return { ...pre, answerArray: r };
                                                    });
                                                }}
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
                                value={upData.answerArr}
                                onChange={(e) => {
                                    setUpData({ ...upData, answerArr: e.target.value });
                                    setErr({ ...err, ansArr: false });
                                }}
                                css={`
                                    padding: 3px;
                                    border-radius: 5px;
                                    margin-right: 3px;
                                    border-color: ${err.ansArr ? 'red' : ''};
                                `}
                            />
                            <button
                                onClick={() => {
                                    let checkA = false;
                                    const r = upData.answerArray.map((aR, index) => {
                                        console.log('hehehehe', upData.which, index + 1);
                                        if (index + 1 === upData.which?.aArr && upData.answerArr) {
                                            checkA = true;
                                            aR = upData.answerArr;
                                            return aR;
                                        }
                                        return aR;
                                    });

                                    if (!checkA) {
                                        upData.answerArray.forEach((a) => {
                                            if (upData.answerArr === a) {
                                                checkA = true;
                                            }
                                        });
                                        console.log('dddcheck', checkA);

                                        if (!checkA && upData.answerArr) {
                                            console.log('ddd', checkA);

                                            setUpData({
                                                ...upData,
                                                answerArray: [...upData.answerArray, upData.answerArr],
                                                answerArr: '',
                                            });
                                        }
                                    } else {
                                        setUpData((pre) => {
                                            return {
                                                ...pre,
                                                answerArray: r,
                                                answerArr: '',
                                                which: { ...upData.which, aArr: undefined },
                                            };
                                        });
                                    }
                                }}
                            >
                                {upData.which?.aArr ? `change ${upData.which?.aArr}` : 'add'}
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
                                }
                                button {
                                    margin-top: 5px;
                                    border-radius: 5px;
                                    border: 0;
                                    background-color: #c5c5c5;
                                    padding: 5px 10px;
                                    cursor: var(--pointer);
                                }
                            `}
                        >
                            {fff.length ? (
                                <Div width="100%" display="block" css="margin-bottom: 4px;">
                                    {fff.map((a: string, index: number) => (
                                        <Div
                                            key={a}
                                            css={`
                                                position: relative;
                                                cursor: var(--pointer);
                                                &:hover {
                                                    background-color: #d9d8d6;
                                                }
                                                background-color: ${upData.which?.aSt === index + 1 ? '#dadada' : ''};
                                                padding: 2px 5px;
                                                border-radius: 5px;
                                            `}
                                            onClick={() =>
                                                setUpData({
                                                    ...upData,
                                                    answerS: a,
                                                    which: { ...upData.which, aSt: index + 1 },
                                                })
                                            }
                                        >
                                            <P size="1.4rem" css="width: 100%; ">
                                                {index + 1} -- {a}
                                            </P>
                                            <Div
                                                width="auto"
                                                css="font-size: 17px; padding: 2px; cursor: var(--pointer); position: absolute; top: 2px; right: 0;"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const r = upData.answerSt.filter((aR) => aR !== a);
                                                    setUpData((pre) => {
                                                        return { ...pre, answerSt: r };
                                                    });
                                                }}
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
                                value={upData.answerS}
                                onChange={(e) => {
                                    setErr({ ...err, ansS: false });
                                    setUpData({ ...upData, answerS: e.target.value });
                                }}
                                css={`
                                    padding: 3px;
                                    border-radius: 5px;
                                    margin-right: 3px;
                                    border-color: ${err.ansS ? 'red' : ''};
                                `}
                            />
                            <button
                                onClick={() => {
                                    let checkA = false;
                                    const r = upData.answerSt.map((aR, index) => {
                                        console.log('hehehehe', upData.which, index + 1);
                                        if (
                                            index + 1 === upData.which?.aSt &&
                                            upData.answerS &&
                                            upData.answerArray.includes(upData.answerS)
                                        ) {
                                            checkA = true;
                                            aR = upData.answerS;
                                            return aR;
                                        }
                                        return aR;
                                    });

                                    if (!checkA) {
                                        upData.answerSt.forEach((a) => {
                                            if (upData.answerS === a) checkA = true;
                                        });
                                        console.log();

                                        if (!checkA && upData?.answerS) {
                                            if (upData.answerArray.includes(upData.answerS)) {
                                                setUpData({
                                                    ...upData,
                                                    answerSt: [...upData?.answerSt, upData?.answerS],
                                                    answerS: '',
                                                });
                                            } else {
                                                setErr({ ...err, ansS: true });
                                            }
                                        }
                                    } else {
                                        setUpData((pre) => {
                                            return {
                                                ...pre,
                                                answerSt: r,
                                                answerS: '',
                                                which: { ...upData.which, aSt: undefined },
                                            };
                                        });
                                    }
                                }}
                            >
                                {upData.which?.aSt ? `change ${upData.which?.aSt}` : 'add'}
                            </button>
                        </Div>
                    );
                }
                d.point = (
                    <Textarea
                        value={upData.pointS}
                        onChange={(e) => {
                            if (!isNaN(Number(e.target.value)))
                                setUpData({ ...upData, pointS: Number(e.target.value) });
                            if (!e.target.value) {
                                setErr({ ...err, point: true });
                            } else {
                                setErr({ ...err, point: false });
                            }
                        }}
                        css={`
                            padding: 3px;
                            border-radius: 5px;
                            margin-right: 3px;
                            border-color: ${err.point ? 'red' : ''};
                        `}
                    />
                );
            }
            return d;
        });
    const handleSaveEdit = async (cateId: string) => {
        const mockData: { TimeOut?: number; Name?: string; TimeType?: string } = {};
        let ok = false;
        if ((result.TimeOut ?? 0) !== valTimer) {
            mockData.TimeOut = valTimer;
            console.log('valTimer', result.TimeOut ?? 0, valTimer);

            ok = true;
        }
        console.log(result.TimeType, 'result.TimeType', timer);

        if ((result.TimeType ?? 'Minute') !== timer) {
            mockData.TimeType = timer;
            console.log('timer', timer);
            ok = true;
        }
        if (catePart && result.Name !== catePart) {
            mockData.Name = catePart;
            ok = true;
        }
        if (ok) {
            console.log('up', result.Name, catePart, mockData);
            const res = await catePartsAPI.update({ Id: cateId, ...mockData, OccupationId: result.OccupationId });
            console.log(res);
            if (res) {
                setEdit(false);
                if (mockData?.Name) {
                    const name = mockData.Name;
                    setReChange((pre) => [...(pre ?? []), { id: cateId, name: 'name', val: name }]);
                }
                if (mockData?.TimeOut) {
                    const TimeOut = mockData.TimeOut;
                    setReChange((pre) => [...(pre ?? []), { id: cateId, name: 'timeOut', val: TimeOut }]);
                }
                if (mockData?.TimeType) {
                    const TimeType = mockData.TimeType;
                    setReChange((pre) => [...(pre ?? []), { id: cateId, name: 'timeType', val: TimeType }]);
                }
            }
        }
    };
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
                        onClick={() => setType('string')}
                        css={`
                            width: max-content;
                            ${!(type === 'array') ? 'background-image: linear-gradient(123deg, #37aece, #070101);' : ''}
                        `}
                    >
                        Text Answer
                    </P>
                    <Div
                        width="66%"
                        css={`
                            font-size: 30px;
                        `}
                    >
                        <TimerI />
                        {/* <TimerI /> <P size="1.3rem">2 hours</P> */}
                        {/* <P size="1.3rem">2</P> */}
                        {edit && (
                            <InputA
                                type="text"
                                value={valTimer}
                                onChange={(e) => {
                                    const t = Number(e.target.value);
                                    if (timer === 'Hour' && t < 6) {
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
                                            if (t === 'Hour') setValTimer(5);
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
                        onClick={() => setType('array')}
                        css={`
                            width: max-content;
                            ${type === 'array' ? 'background-image: linear-gradient(123deg, #37aece, #070101);' : ''}
                        `}
                    >
                        Answer Array
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
                        {edit ? (
                            <InputA
                                type="text"
                                value={catePart}
                                onChange={(e) => {
                                    setCatePart(e.target.value);
                                }}
                                css={`
                                    padding: 3px;
                                    width: 200px;
                                    border-radius: 5px;
                                    margin-right: 3px;
                                `}
                            />
                        ) : (
                            catePart
                        )}{' '}
                        ( {point} points )
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
                {edit && (
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
                        onClick={() => handleSaveEdit(result.Id)}
                    >
                        <P size="1.3rem">Save</P>
                    </Div>
                )}
                <Div
                    css={`
                        background-image: linear-gradient(45deg, #565656, #d0d0d0);
                        border-radius: 8px;
                        tbody {
                            background-color: #ffffff;
                        }
                    `}
                >
                    {type === 'array' ? ( // string or array
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
                            dataSource={dataq}
                            pagination={{
                                pageSize: 5,
                            }}
                        />
                    )}
                </Div>
                {updateF && (
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
                        onClick={() => setUpdateF('')}
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
                            tbody {
                                background-color: #ffffff;
                            }
                        `}
                        onClick={() => setAddData(false)}
                    >
                        <Div onClick={(e) => e.stopPropagation()}>
                            <Table
                                style={{ width: '75%' }}
                                columns={type === 'string' ? columnsAddString : columnsAddArr}
                                dataSource={type === 'string' ? dataAddString : dataAddArray}
                            />
                        </Div>
                    </Div>
                )}
            </Div>
        </Div>
    );
};

export default Result;
