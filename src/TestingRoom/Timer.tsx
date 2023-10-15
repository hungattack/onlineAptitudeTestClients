import React, { useState } from 'react';
import { useTimer } from 'react-timer-hook';
import { Div, H3 } from '../styleComponent/styleComponent';
import { PropsTestingDataRD, setEnd, setStartRD } from '../redux/testingData';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { PropsRoomData } from './TestingRoom';
import { TbTimeDuration60 } from 'react-icons/tb';
import { TimerI } from '../assets/Icons/Icons';
import { toast } from 'react-toastify';

function MyTimer({
    expiryTimestamp,
    setCatePart,
    roomData,
    catePart,
    setWarning,
}: {
    expiryTimestamp: any;
    setCatePart: React.Dispatch<React.SetStateAction<string>>;
    roomData: PropsRoomData;
    catePart: string;
    setWarning: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const dispatch = useDispatch();
    const { status, startTime, canProcess, id_room } = useSelector(
        (state: { persistedReducer: { testingData: PropsTestingDataRD } }) => state.persistedReducer.testingData,
    );

    const { totalSeconds, seconds, minutes, hours, days, isRunning, start, pause, resume, restart } = useTimer({
        expiryTimestamp,
        onExpire: () => {
            toast('Expire!');
            dispatch(setEnd({ id: catePart }));
            roomData.Cates.$values.map((c, index) => {
                if (c.Id === catePart) {
                    if (roomData.Cates.$values[index + 1]) {
                        const { Id, TimeOut, TimeType } = roomData.Cates.$values[index + 1];
                        const startT = moment(moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss');
                        const type = TimeType === 'Hour' ? 'hours' : TimeType === 'Minute' ? 'minutes' : 'seconds';
                        const newType =
                            TimeOut < 2 ? (type === 'hours' ? 'hour' : type === 'minutes' ? 'minute' : 'second') : type;
                        const end = startT.add(TimeOut, newType);
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
                        }
                    }
                }
            });
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
}: {
    setCatePart: React.Dispatch<React.SetStateAction<string>>;
    roomData: PropsRoomData;
    catePart: string;
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
            />
            <TimerI />
        </Div>
    );
}
