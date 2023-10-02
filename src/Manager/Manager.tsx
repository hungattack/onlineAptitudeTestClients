import React, { useState } from 'react';
import styles from './manager.module.scss';
import Option from './Option/Option';
import Result from './Option/Result';
import Information from './Option/Information';
import ReCandidate from './Option/ReCandidate';
const Manager = () => {
    const [reChange, setReChange] = useState<{ id: string; name: string; val: number | string }[]>();
    const [cate, setCate] = useState<{ id: string; name: string; jobName?: string }>();
    const [result, setResult] = useState<{
        $id: string;
        CreatedAt: string;
        Id: string;
        Name: string;
        OccupationId: string;
        TimeOut: number;
        TimeType: string;
        UpdatedAt: string;
    }>();
    return (
        <>
            <div className={styles.manager}>
                <div className={styles.optionBar}>
                    <div className={styles.itemPart}>
                        <Option
                            setResult={setResult}
                            reChange={reChange}
                            result={result}
                            setCateJob={setCate}
                            catePart={cate}
                        />
                    </div>
                </div>
                {cate?.name === 'Question' && result && <Result result={result} setReChange={setReChange} />}
                {cate && cate?.name === 'Information' && <Information cate={cate} />}
                {cate?.name === 'candidate' && <ReCandidate cate={cate} />}
            </div>
        </>
    );
};

export default Manager;
