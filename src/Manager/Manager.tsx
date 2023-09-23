import React, { useState } from 'react';
import styles from './manager.module.scss';
import Option from './Option/Option';
import Result from './Option/Result';
const Manager = () => {
    const [result, setResult] = useState<{
        $id: string;
        CreatedAt: string;
        Id: string;
        Name: string;
        AnswerType: string;
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
                        <Option setResult={setResult} />
                    </div>
                </div>
                {result && <Result result={result} />}
            </div>
        </>
    );
};

export default Manager;
