import React from 'react';
import { useTimer } from 'react-timer-hook';
import { Div, H3 } from '../styleComponent/styleComponent';
import { PropsTestingDataRD } from '../redux/testingData';
import { useSelector } from 'react-redux';
import moment from 'moment';

function MyTimer({ expiryTimestamp }: { expiryTimestamp: any }) {
    const { totalSeconds, seconds, minutes, hours, days, isRunning, start, pause, resume, restart } = useTimer({
        expiryTimestamp,
        onExpire: () => console.warn('onExpire called'),
    });

    return (
        <Div>
            <H3 size="1.6rem">{hours}</H3>:<H3 size="1.6rem">{minutes}</H3>:<H3 size="1.6rem">{seconds}</H3>
        </Div>
    );
}

export default function Timer({ start, end }: { start: string; end: string }) {
    const time = moment(start);
    const dura = moment(end).diff(moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'), 'seconds');
    time.seconds(dura); // 10 minutes timer
    return (
        <div>
            <MyTimer expiryTimestamp={time} />
        </div>
    );
}
