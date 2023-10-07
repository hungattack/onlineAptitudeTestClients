import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Div } from '../styleComponent/styleComponent';

const Duration: React.FC<{ time: number; setStart: React.Dispatch<React.SetStateAction<string>> }> = ({
    time,
    setStart,
}) => {
    const [dur, setDur] = useState<number>(time);
    useLayoutEffect(() => {
        let timeout: NodeJS.Timeout;
        if (dur > 0) {
            timeout = setTimeout(() => {
                setDur(dur - 1);
            }, 1000);
        } else {
            timeout = setTimeout(() => {
                setStart('inCharger');
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [dur]);
    console.log(dur);

    return <Div css="font-size: 10rem; text-shadow: 0 0 8px #71c2c9;">{dur === 0 ? 'start' : dur}</Div>;
};

export default Duration;
