import React from 'react';
import { useSelector } from 'react-redux';
import { PropsTestingDataRD } from '../redux/testingData';
import { Div, H3, P } from '../styleComponent/styleComponent';
import { PropsRoomData } from './TestingRoom';

const Result: React.FC<{ roomData: PropsRoomData | undefined }> = ({ roomData }) => {
    const { calculate } = useSelector(
        (state: { persistedReducer: { testingData: PropsTestingDataRD } }) => state.persistedReducer.testingData,
    );
    console.log(calculate, 'calculate99');
    const totalAll: { point: number; all: number } = { point: 0, all: 0 };
    return (
        <Div
            display="block"
            css={`
                color: #fff;
                height: 100%;
                overflow-y: overlay;
                padding: 5px 2px;
            `}
        >
            <H3>Result for {roomData?.Name}</H3>
            {calculate.map((c, index) => {
                const ques = roomData?.Cates.$values.filter((ca) => ca.Id === c.idCate)[0];
                const total = ques?.Questions.$values.reduce((a, b) => {
                    JSON.parse(b.PointAr).map((p: { id: string; point: number }) => {
                        a += Number(p.point);
                    });
                    return a;
                }, 0);
                totalAll.all += total ?? 0;
                totalAll.point += c.point;
                return (
                    <Div key={c.idCate} display="block">
                        <Div
                            display="block"
                            css={`
                                border: 1px solid #8e8d8d;
                                border-radius: 5px;
                                padding: 5px;
                                background-color: #515151;
                                margin: 10px 0;
                            `}
                        >
                            <Div css="font-size: 1.5rem">
                                <H3>{ques?.Name}</H3>
                            </Div>
                            <Div
                                wrap="wrap"
                                justify="left"
                                css={`
                                    p {
                                        width: 100%;
                                        font-size: 1.3rem;
                                        text-align: left;
                                        padding: 5px;
                                    }
                                    strong {
                                        color: #95ffea;
                                    }
                                `}
                            >
                                <P>There are {ques?.Questions.$values.length} questions in this section.</P>
                                {c.correct && <P>You had answered right of {c.correct} questions in this section.</P>}
                                {c.inCorrect && (
                                    <P>You had answered wrong of {c.inCorrect} questions in this section.</P>
                                )}
                                <P>
                                    Your point is {c.point}/{total}. Congratulations🎯
                                </P>
                                <Div>
                                    <strong>Note*:</strong>
                                    <P color="#cecece">There will be several answers to each question</P>
                                </Div>
                            </Div>
                        </Div>
                        {index + 1 === calculate.length && (
                            <Div>
                                <P>
                                    {totalAll.point}/{totalAll.all}🎯
                                </P>
                            </Div>
                        )}
                    </Div>
                );
            })}
        </Div>
    );
};

export default Result;
