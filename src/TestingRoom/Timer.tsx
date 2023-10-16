import React, { useState } from 'react';
import { useTimer } from 'react-timer-hook';
import { Div, H3 } from '../styleComponent/styleComponent';
import { PropsTestingDataRD, setCalculate, setEnd, setResetAll, setStartRD } from '../redux/testingData';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { PropsRoomData } from './TestingRoom';
import { TbTimeDuration60 } from 'react-icons/tb';
import { TimerI } from '../assets/Icons/Icons';
import { toast } from 'react-toastify';
import { PropsUserDataRD } from '../redux/userData';
import questionHistoryAPI from '../API/questionHistoryAPI/questionHistoryAPI';

function MyTimer({
    expiryTimestamp,
    setCatePart,
    roomData,
    catePart,
    setWarning,
    value,
    choice,
    valueInput,
}: {
    expiryTimestamp: any;
    setCatePart: React.Dispatch<React.SetStateAction<string>>;
    roomData: PropsRoomData;
    catePart: string;
    choice: {
        id: string;
        value: string[];
        index: number;
    }[];
    value: {
        id: string;
        value: string;
        index: number;
    }[];
    valueInput: {
        id: string;
        value: string;
        index: number;
    }[];
    setWarning: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const dispatch = useDispatch();
    const { status, startTime, canProcess, id_room } = useSelector(
        (state: { persistedReducer: { testingData: PropsTestingDataRD } }) => state.persistedReducer.testingData,
    );
    const { login, register, user } = useSelector((state: { persistedReducer: { userData: PropsUserDataRD } }) => {
        return state.persistedReducer.userData;
    });
    const { totalSeconds, seconds, minutes, hours, days, isRunning, start, pause, resume, restart } = useTimer({
        expiryTimestamp,
        onExpire: async () => {
            toast('Expire!');
            dispatch(setEnd({ id: catePart }));
            Promise.all(
                roomData.Cates.$values.map(async (c, index) => {
                    if (c.Id === catePart) {
                        if (roomData.Cates.$values[index + 1]) {
                            const { Id, TimeOut, TimeType } = roomData.Cates.$values[index + 1];
                            const startT = moment(
                                moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                                'YYYY-MM-DD HH:mm:ss',
                            );
                            const type = TimeType === 'Hour' ? 'hours' : TimeType === 'Minute' ? 'minutes' : 'seconds';
                            const newType =
                                TimeOut < 2
                                    ? type === 'hours'
                                        ? 'hour'
                                        : type === 'minutes'
                                        ? 'minute'
                                        : 'second'
                                    : type;
                            const end = startT.add(TimeOut, newType);
                            let result: {
                                catePartId: string;
                                cateName: string;
                                question: {
                                    correct: {
                                        id: string;
                                        name: string;
                                        type?: string;
                                        answer: string;
                                        pointAr: string;
                                        user: string | string[];
                                    }[];
                                    inCorrect: {
                                        id: string;
                                        name: string;
                                        answer: string;
                                        type?: string;
                                        pointAr: string;
                                        user: string | string[];
                                    }[];
                                };
                            }[] = [];

                            let vl: {
                                catePartId: string;
                                cateName: string;
                                question: {
                                    correct: {
                                        id: string;
                                        name: string;
                                        answer: string;
                                        pointAr: string;
                                        type?: string;
                                        user: string | string[];
                                    }[];
                                    inCorrect: {
                                        id: string;
                                        name: string;
                                        answer: string;
                                        pointAr: string;
                                        type?: string;
                                        user: string | string[];
                                    }[];
                                };
                            } = { catePartId: '', cateName: '', question: { correct: [], inCorrect: [] } };
                            roomData.Cates.$values.map((c) => {
                                if (c.Id === catePart) {
                                    console.log(c, 'val c');

                                    c.Questions.$values.map((q) => {
                                        console.log(q, 'val q', value, valueInput, choice);
                                        let check = false;
                                        value.map((v) => {
                                            if (
                                                v.id === q.Id &&
                                                q.AnswerType === 'array' &&
                                                JSON.parse(q.Answer).length === 1
                                            ) {
                                                check = true;
                                                console.log(v, 'val VL');
                                                vl.catePartId = catePart;
                                                vl.cateName = c.Name;

                                                if (
                                                    JSON.parse(q.Answer).some(
                                                        (an: { id: string; val: string }) =>
                                                            an.val === v.value && v.value,
                                                    )
                                                ) {
                                                    if (!vl.question.correct.some((vll) => vll.id === v.id)) {
                                                        vl.question.correct.push({
                                                            id: q.Id,
                                                            name: q.QuestionName,
                                                            type: 'radio',
                                                            answer: q.Answer,
                                                            user: v.value,
                                                            pointAr: q.PointAr,
                                                        });
                                                    }
                                                } else {
                                                    if (!vl.question.inCorrect.some((vll) => vll.id === q.Id)) {
                                                        vl.question.inCorrect.push({
                                                            id: q.Id,
                                                            name: q.QuestionName,
                                                            type: 'radio',
                                                            answer: q.Answer,
                                                            user: v.value,
                                                            pointAr: q.PointAr,
                                                        });
                                                    }
                                                }
                                            }
                                        });
                                        choice.map((v) => {
                                            if (v.id === q.Id && q.AnswerType === 'array') {
                                                check = true;
                                                console.log(v, 'val C');
                                                vl.catePartId = catePart;
                                                vl.cateName = c.Name;
                                                let po = 0;
                                                const userA: string[] = [];
                                                const userS: string[] = [];
                                                const pointS: string[] = [];
                                                const pointA: string[] = [];
                                                JSON.parse(q.Answer).map(
                                                    (an: { id: string; val: string }, index: number) => {
                                                        if (v.value.some((val: string) => val === an.val)) {
                                                            po += 1;
                                                            pointS.push(
                                                                JSON.parse(q.PointAr).filter(
                                                                    (p: { id: string }) => p.id === an.id,
                                                                )[0],
                                                            );
                                                            userA.push(an.val);
                                                            if (!vl.question.correct.some((vll) => vll.id === v.id)) {
                                                                vl.question.correct.push({
                                                                    id: q.Id,
                                                                    name: q.QuestionName,
                                                                    type: 'checkbox',
                                                                    answer: q.Answer,
                                                                    user: userA,
                                                                    pointAr: JSON.stringify(pointS),
                                                                });
                                                            }
                                                        } else {
                                                            pointA.push(
                                                                JSON.parse(q.PointAr).filter(
                                                                    (p: { id: string }) => p.id === an.id,
                                                                )[0],
                                                            );
                                                            userS.push(
                                                                v.value.filter((val: string) => val === an.val)[0],
                                                            );
                                                            if (!vl.question.inCorrect.some((vll) => vll.id === q.Id)) {
                                                                JSON.parse(q.AnswerArray).map((an: string) => {
                                                                    if (v.value.some((val) => val === an)) {
                                                                        po += 1;
                                                                    }
                                                                });
                                                                vl.question.inCorrect.push({
                                                                    id: q.Id,
                                                                    name: q.QuestionName,
                                                                    answer: q.Answer,
                                                                    type: 'checkbox',
                                                                    user: userS,
                                                                    pointAr: JSON.stringify(pointA),
                                                                });
                                                            }
                                                        }
                                                    },
                                                );
                                            }
                                        });
                                        valueInput.map((v) => {
                                            if (v.id === q.Id && q.AnswerType === 'string') {
                                                check = true;
                                                console.log(v, 'val I');
                                                vl.catePartId = catePart;
                                                vl.cateName = c.Name;
                                                if (v.value) {
                                                    vl.question.correct.push({
                                                        id: q.Id,
                                                        name: q.QuestionName,
                                                        type: 'input',
                                                        answer: q.Answer,
                                                        user: v.value,
                                                        pointAr: q.PointAr,
                                                    });
                                                } else {
                                                    if (!vl.question.inCorrect.some((vll) => vll.id === q.Id)) {
                                                        vl.question.inCorrect.push({
                                                            id: q.Id,
                                                            type: 'input',
                                                            name: q.QuestionName,
                                                            answer: q.Answer,
                                                            user: v.value,
                                                            pointAr: q.PointAr,
                                                        });
                                                    }
                                                }
                                            }
                                        });
                                        if (!check) {
                                            // if it doesn't exist
                                            if (!vl.question.inCorrect.some((vll) => vll.id === q.Id)) {
                                                vl.question.inCorrect.push({
                                                    id: q.Id,
                                                    type: q.AnswerType,
                                                    name: q.QuestionName,
                                                    answer: q.Answer,
                                                    user: '',
                                                    pointAr: q.PointAr,
                                                });
                                            }
                                        }
                                    });
                                }
                                if (
                                    !result.length ||
                                    (!result.some((va) => va.catePartId === vl?.catePartId) && vl?.catePartId)
                                ) {
                                    result.push(vl);
                                }
                            });
                            console.log(result, 'val');
                            if (result.length && id_room) {
                                let er = '';
                                dispatch(
                                    setCalculate({
                                        idCate: catePart,
                                        point: result
                                            .filter((re) => re.catePartId === catePart)[0]
                                            .question.correct.reduce((calP, vl) => {
                                                if (vl.type !== 'input') {
                                                    JSON.parse(vl.pointAr).map((po: { point: string }) => {
                                                        calP += Number(po.point);
                                                    });
                                                }
                                                return calP;
                                            }, 0),
                                        inCorrect: result.filter((re) => re.catePartId === catePart)[0].question
                                            .inCorrect.length,
                                        correct: result.filter((re) => re.catePartId === catePart)[0].question.correct
                                            .length,
                                    }),
                                );
                                if (user) {
                                    const res = await questionHistoryAPI.add(user.id, id_room);
                                    if (res)
                                        result.map((r) => {
                                            const newAR = [...r.question.correct, ...r.question.inCorrect];
                                            Promise.all(
                                                newAR.map(async (cr, index, ar) => {
                                                    const res = await questionHistoryAPI.addResult(
                                                        user.id,
                                                        id_room,
                                                        catePart,
                                                        cr,
                                                    );
                                                    if (res?.status === 0) {
                                                        er = `Your part of ${r.cateName} has been written`;
                                                    } else if (res === 'ok' || res === 'reTest') {
                                                        er = `Result just had written`;
                                                    } else if (res?.status === 1) {
                                                        er = `Question History is empty`;
                                                    }
                                                    console.log(res, 'okkk');
                                                    if (ar.length - 1 === index) toast(er);
                                                }),
                                            );
                                        });
                                }
                            }
                            if (roomData.Cates.$values[index + 1]?.Questions.$values?.length) {
                                dispatch(
                                    setStartRD({
                                        id_room: id_room,
                                        others: {
                                            id: Id,
                                            start: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                                            end: end.format('YYYY-MM-DD HH:mm:ss'),
                                            finish: false,
                                        },
                                    }),
                                );
                                setCatePart(roomData.Cates.$values[index + 1]?.Id);
                            } else {
                                dispatch(setResetAll());
                            }
                        }
                    }
                }),
            );
        },
    });
    console.log(isRunning, 'isRunning', minutes, expiryTimestamp);
    if (minutes <= 5) setWarning(true);
    return (
        <Div>
            <H3 size="1.6rem">{hours}</H3>:<H3 size="1.6rem">{minutes}</H3>:<H3 size="1.6rem">{seconds}</H3>
        </Div>
    );
}

export default function Timer({
    setCatePart,
    roomData,
    catePart,
    value,
    choice,
    valueInput,
}: {
    setCatePart: React.Dispatch<React.SetStateAction<string>>;
    roomData: PropsRoomData;
    catePart: string;
    choice: {
        id: string;
        value: string[];
        index: number;
    }[];
    value: {
        id: string;
        value: string;
        index: number;
    }[];
    valueInput: {
        id: string;
        value: string;
        index: number;
    }[];
}) {
    const dispatch = useDispatch();
    const { status, startTime, canProcess, id_room } = useSelector(
        (state: { persistedReducer: { testingData: PropsTestingDataRD } }) => state.persistedReducer.testingData,
    );
    console.log(startTime, 'startTime');

    const { id, start, end } = startTime.filter((s) => s.id === catePart)[0];
    const [warning, setWarning] = useState<boolean>(false);
    const time = moment(start);
    const dura = moment(end).diff(moment(Date.now()), 'seconds');
    console.log(dura, 'dora', time);

    time.add(dura, 'seconds'); // 10 minutes timer

    return (
        <Div
            width="auto"
            css={`
                border: 1px solid #39a7c6;
                box-shadow: 0 0 7px #39a7c6;
                margin-top: 9px;
                border-radius: 5px;
                margin-left: 10px;
                padding: 0 10px;
                height: 35px;
                ${warning
                    ? 'animation: loadingB 1.5s linear infinite;@keyframes loadingB {50% {border: 1px solid #dd5353;box-shadow: 0 0 7px #e96c6c;}}'
                    : ''}
            `}
        >
            <MyTimer
                expiryTimestamp={time}
                setCatePart={setCatePart}
                roomData={roomData}
                setWarning={setWarning}
                catePart={catePart}
                choice={choice}
                value={value}
                valueInput={valueInput}
            />
            <TimerI />
        </Div>
    );
}
