import React, { useEffect, useRef, useState } from 'react';
import { Div, H3, P } from '../styleComponent/styleComponent';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { CheckI, TimerI } from '../assets/Icons/Icons';
import { Button, Checkbox, Input, Radio, RadioChangeEvent } from 'antd';
import { PropsRoomData } from './TestingRoom';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import Timer from './Timer';
import TextArea from 'antd/es/input/TextArea';
import { useDispatch, useSelector } from 'react-redux';
import {
    PropsTestingDataRD,
    setCandidateProcess,
    setChoiceRD,
    setEnd,
    setValueInputRD,
    setValueRD,
} from '../redux/testingData';
const InCharger: React.FC<{
    roomData: PropsRoomData;
    catePart: string; // first section
    setCatePart: React.Dispatch<React.SetStateAction<string>>;
}> = ({ roomData, catePart, setCatePart }) => {
    const dispatch = useDispatch();
    const { status, startTime, valueRD, valueInputRD, choicesRD } = useSelector(
        (state: { persistedReducer: { testingData: PropsTestingDataRD } }) => state.persistedReducer.testingData,
    );
    const [process, setProcess] = useState<{ id: string; index: number }[]>([]);
    const defaultCheckedList = ['Apple', 'Orange'];
    const [checkedList, setCheckedList] = useState<CheckboxValueType[]>(defaultCheckedList);
    // value
    const [valueInput, setValueInput] = useState<{ id: string; value: string; index: number }[]>(() => {
        let data: { id: string; value: string; index: number }[] = [];
        if (valueInputRD) {
            data = JSON.parse(valueInputRD);
        } else {
            roomData.Cates.$values.map((c) => {
                if (c.Id === catePart) {
                    c.Questions.$values.map((q, index) => {
                        if (q.AnswerType === 'string') {
                            data.push({ id: q.Id, value: '', index });
                        }
                    });
                }
            });
        }
        return data;
    }); // for text
    const [value, setValue] = useState<{ id: string; value: string[]; index: number }[]>(() => {
        let data: { id: string; value: string[]; index: number }[] = [];
        if (valueRD) {
            data = JSON.parse(valueRD);
        } else {
            roomData.Cates.$values.map((c) => {
                if (c.Id === catePart)
                    c.Questions.$values.map((q, index) => {
                        if (JSON.parse(q.Answer)?.length === 1 && q.AnswerType !== 'string') {
                            data.push({ id: q.Id, value: [], index });
                        }
                    });
            });
        }
        return data;
    }); // for radio
    //
    const [indexQ, setIndex] = useState<{ id: string; index: number }>({
        id: roomData.Cates.$values[0].Questions.$values[0].Id,
        index: 0,
    }); // question
    const swiperRef = useRef<any>(null);
    const [choice, setChoice] = useState<{ id: string; value: string[]; index: number }[]>(() => {
        let data: { id: string; value: string[]; index: number }[] = [];
        if (choicesRD) {
            data = JSON.parse(choicesRD);
        } else {
            roomData.Cates.$values.map((c) => {
                if (c.Id === catePart)
                    c.Questions.$values.map((q, index) => {
                        if (JSON.parse(q.Answer)?.length > 1 && q.AnswerType !== 'string') {
                            data.push({ id: q.Id, value: [], index });
                        }
                    });
            });
        }
        return data;
    }); // for checkbox;
    useEffect(() => {
        if (!valueRD && !choicesRD && !valueInputRD) {
            console.log('ccc');
            dispatch(
                setCandidateProcess({
                    value: JSON.stringify(value),
                    valueInput: JSON.stringify(valueInput),
                    choices: JSON.stringify(choice),
                }),
            );
        } else {
            console.log(choice, 'choice', value, 'value', valueInput, 'valueInput');

            if (JSON.stringify(valueRD) !== JSON.stringify(value)) {
                let check = false;
                const newD = JSON.parse(valueRD).map((v: any) => {
                    if (v.id === catePart) {
                        v.others = value;
                    }
                    return v;
                });
                // if (!check) dispatch(setValueRD({ value: JSON.stringify(JSON.parse(valueRD).push({id: catePart, others: })) }));
                if (!check) dispatch(setValueRD({ value: JSON.stringify(newD) }));
            }
            if (JSON.stringify(valueInputRD) !== JSON.stringify(valueInput)) {
                let check = false;
                const newD = JSON.parse(valueInputRD).map((v: any) => {
                    if (v.id === catePart) {
                        v.others = valueInput;
                    }
                    return v;
                });
                dispatch(setValueInputRD({ valueInput: JSON.stringify(valueInput) }));
            }
            if (JSON.stringify(choicesRD) !== JSON.stringify(choice)) {
                dispatch(setChoiceRD({ choices: JSON.stringify(choice) }));
            }
        }
    }, [choice, value, valueInput]);
    const onChange = (e: RadioChangeEvent, id: string) => {
        console.log('radio checked', e.target.value);
        let checkF = false;
        const newValue = value.map((c) => {
            if (c.id === id) {
                c.value = e.target.value;
                checkF = true;
            }
            return c;
        });
        if (!checkF) {
            setValue([...value, { id, value: e.target.value, index: indexQ.index }]);
        } else {
            setValue(newValue);
        }
    };
    const handleNext = (
        id: string,
        index: number,
        Questions: {
            $values: {
                Answer: string;
                AnswerArray: string;
                AnswerType: string;
                Cate: boolean;
                CreatedAt: string;
                Id: string;
                PartId: string;
                Point: 20;
                QuestionName: string;
                UpdatedAt: string;
            }[];
        },
    ) => {
        index += 1;
        if (index < Questions.$values.length) {
            setIndex({ id, index: index });
            swiperRef.current.slideTo(index);
        }
    };
    const handlePre = (id: string, index: number) => {
        index -= 1;
        if (index >= 0) {
            setIndex({ id, index: index });
            swiperRef.current.slideTo(index);
        }
    };
    const onChangeBox = (list: any, id: string, index: number) => {
        let check = false;
        const newChoice = choice.map((c) => {
            if (c.id === id) {
                c.value = list;
                check = true;
            }
            return c;
        });
        console.log(list);
        if (!check) {
            setChoice([...choice, { value: list, id: id, index }]);
        } else {
            setChoice(newChoice);
        }
        setCheckedList(list);
    };

    return (
        <Div display="block" css="height: 100%; color: #fff">
            <Div
                css={`
                    height: 35px;
                    border-radius: 5px;
                    color: #fff;
                    border: 1px solid #39a7c6;
                    box-shadow: 0 0 8px #39a7c6;
                    .mySwiper {
                        width: 100%;
                        height: 100%;
                        .swiper-wrapper {
                            height: 100%;
                        }
                    }
                `}
            >
                <Swiper slidesPerView={3} spaceBetween={30} className="mySwiper">
                    {roomData.Cates.$values.map((c) => {
                        return (
                            <SwiperSlide
                                key={c.Id}
                                onClick={() => {
                                    if (startTime.some((s) => s.id === c.Id && s.finish)) setCatePart(c.Id);
                                }}
                            >
                                <Div
                                    css={`
                                        height: 100%;
                                        display: flex;
                                        align-items: center;
                                        width: 100%;
                                        justify-content: center;
                                        cursor: var(--pointer);
                                        ${c.Id === catePart ? 'color: #68eee4;' : 'color: #919191; cursor: no-drop;'}
                                    `}
                                >
                                    <H3 size="1.6rem">{c.Name}</H3>
                                    <Div width="auto" display="block" css="font-size: 1.4rem">
                                        ( {c.TimeOut} <TimerI /> {c.TimeType ?? 'minutes'} )
                                    </Div>
                                </Div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </Div>
            <Div wrap="wrap" align="baseline" css="height: 94%; margin-top: 5px;  color: #fff; border-radius: 5px;">
                <Div width="90%" css="height: 35px;">
                    {roomData.Cates.$values.map((c) => {
                        if (c.Id === catePart) {
                            return (
                                <Div
                                    key={c.Id}
                                    width="auto"
                                    css={`
                                        border: 1px solid #39a7c6;
                                        margin-top: 9px;
                                        border-radius: 5px;
                                        margin-right: 10px;
                                        font-size: 1.4rem;
                                        cursor: var(--pointer);
                                        padding: 0 10px;
                                        box-shadow: 0 0 7px #39a7c6;
                                        height: 35px;
                                        &:hover {
                                            background-color: #1d374d;
                                        }
                                    `}
                                    onClick={() => {
                                        const ok = window.confirm('You want to submit this part?');
                                        if (ok) {
                                            dispatch(setEnd({ id: catePart }));
                                        }
                                    }}
                                >
                                    Submit
                                </Div>
                            );
                        }
                    })}
                    <Div
                        width="90%"
                        justify="left"
                        css={`
                            padding-left: 5px;
                            height: auto;
                            padding: 3px 0;
                            border: 1px solid #b26cd6;
                            margin-top: 9px;
                            border-radius: 5px;
                            box-shadow: 0 0 2px #b08bbb;
                            .mySwiper {
                                width: 100%;
                                height: 100%;
                                .swiper-wrapper {
                                    height: 100%;
                                    position: relative;
                                }
                            }
                        `}
                    >
                        <Div width="100%">
                            <Swiper slidesPerView={8} spaceBetween={5} className="mySwiper">
                                {roomData.Cates.$values.map((c) => {
                                    if (c.Id === catePart) {
                                        return c.Questions.$values.map((q, index) => (
                                            <SwiperSlide key={q.Id}>
                                                <Div>
                                                    <P
                                                        size="1.3rem"
                                                        css={`
                                                            ${index === indexQ.index
                                                                ? 'color: #68eee4 !important;'
                                                                : ''}
                                                            cursor: var(--pointer);
                                                            ${process.some((p) => p.id === q.Id) ? 'color: red;' : ''}
                                                        `}
                                                        onClick={() => {
                                                            swiperRef.current.slideTo(index);
                                                            setIndex({ id: q.Id, index });
                                                        }}
                                                    >
                                                        Q{index + 1}
                                                    </P>
                                                    {value.some((v) => v.value.length && v.id === q.Id) ||
                                                    valueInput.some((v) => v.value && v.id === q.Id) ||
                                                    choice.some((v) => v.value.length && v.id === q.Id) ? (
                                                        <Div width="auto" css="font-size: 15px; color: #83fb83">
                                                            <CheckI />
                                                        </Div>
                                                    ) : (
                                                        ''
                                                    )}
                                                </Div>
                                            </SwiperSlide>
                                        ));
                                    }
                                })}
                            </Swiper>
                        </Div>
                    </Div>
                    {roomData.Cates.$values.map((c) => {
                        if (c.Id === catePart) {
                            const { id, start, end } = startTime.filter((s) => s.id === catePart)[0];
                            return (
                                <Div
                                    key={c.Id}
                                    width="auto"
                                    css={`
                                        border: 1px solid #39a7c6;
                                        margin-top: 9px;
                                        border-radius: 5px;
                                        margin-left: 10px;
                                        padding: 0 10px;
                                        box-shadow: 0 0 7px #39a7c6;
                                        height: 35px;
                                    `}
                                >
                                    <Timer start={start} end={end} />
                                    <TimerI />
                                </Div>
                            );
                        }
                    })}
                </Div>

                <Div width="80%" css=".swiper{padding: 3px; .slideQue{width: 100% !important;}}">
                    <Swiper
                        slidesPerView={1}
                        aria-colindex={indexQ.index}
                        spaceBetween={25}
                        onActiveIndexChange={() => console.log('yess')}
                        onSwiper={(swiper: any) => (swiperRef.current = swiper)}
                        className="mySwiper"
                        onSlideChange={(e: any) => {
                            console.log('zooo');

                            let pr = process;
                            console.log(e.slides[e.activeIndex].getAttribute('id'), 'active');
                            if (value.length) {
                                console.log(indexQ, 'value');
                                value.forEach((v) => {
                                    if (
                                        (process.some((p) => p.id === v.id) || indexQ.id === v.id) &&
                                        e.activeIndex > v.index &&
                                        !v.value.length
                                    ) {
                                        if (!pr.some((p) => p.id === v.id))
                                            pr = [...pr, { id: v.id, index: indexQ.index }];
                                        console.log('value xoo');
                                    } else {
                                        const newPr = pr.filter((p) => p.id !== v.id);
                                        console.log('value noo', newPr);
                                        pr = newPr;
                                    }
                                });
                            } else {
                                if (
                                    !choice.some((p) => p.id === indexQ.id) &&
                                    !valueInput.some((p) => p.id === indexQ.id)
                                ) {
                                    if (indexQ.index < e.activeIndex) {
                                        console.log(indexQ, 'indexQ Value', process);
                                        if (!pr.some((p) => p.id === indexQ.id)) {
                                            pr = [...pr, indexQ];
                                            console.log(indexQ, 'indexQ Value after zoo');
                                        }
                                        console.log(indexQ, 'indexQ Value after', process);
                                    } else {
                                        console.log(indexQ, 'indexQ Value del');

                                        const newPr = pr.filter((p) => p.id !== indexQ.id);
                                        pr = newPr;
                                    }
                                }
                            }
                            if (valueInput.length) {
                                console.log(valueInput, 'valueInput');

                                valueInput.forEach((v) => {
                                    if (
                                        (process.some((p) => p.id === v.id) || indexQ.id === v.id) &&
                                        e.activeIndex > v.index &&
                                        !v.value
                                    ) {
                                        console.log('valueInput zoo');
                                        if (!pr.some((p) => p.id === v.id))
                                            pr = [...pr, { id: v.id, index: indexQ.index }];
                                    } else {
                                        const newPr = pr.filter((p) => p.id !== v.id);
                                        console.log('valueInput noo', newPr);
                                        pr = newPr;
                                    }
                                });
                            } else {
                                if (!choice.some((p) => p.id === indexQ.id) && !value.some((p) => p.id === indexQ.id))
                                    if (indexQ.index < e.activeIndex) {
                                        console.log(indexQ, 'indexQ Input');
                                        if (!pr.some((p) => p.id === indexQ.id)) pr = [...pr, indexQ];
                                    } else {
                                        console.log(indexQ, 'indexQ Input del');

                                        const newPr = pr.filter((p) => p.id !== indexQ.id);
                                        pr = newPr;
                                    }
                            }
                            if (choice.length) {
                                console.log(indexQ, 'choice');
                                choice.forEach((v) => {
                                    if (
                                        (process.some((p) => p.id === v.id) || indexQ.id === v.id) &&
                                        e.activeIndex > v.index &&
                                        !v.value.length
                                    ) {
                                        if (!pr.some((p) => p.id === v.id))
                                            pr = [...pr, { id: v.id, index: indexQ.index }];
                                        console.log('choice xoo');
                                    } else {
                                        const newPr = pr.filter((p) => p.id !== v.id);
                                        console.log('choice noo', newPr);
                                        pr = newPr;
                                    }
                                });
                            } else {
                                if (
                                    !value.some((p) => p.id === indexQ.id) &&
                                    !valueInput.some((p) => p.id === indexQ.id)
                                )
                                    if (indexQ.index < e.activeIndex) {
                                        console.log(indexQ, 'indexQ choice');
                                        if (!pr.some((p) => p.id === indexQ.id)) pr = [...pr, indexQ];
                                    } else {
                                        console.log(indexQ, 'indexQ choice del');
                                        const newPr = pr.filter((p) => p.id !== indexQ.id);
                                        pr = newPr;
                                    }
                            }
                            setProcess(pr);
                            setIndex({ id: e.slides[e.activeIndex].getAttribute('id'), index: e.activeIndex });
                        }}
                    >
                        {roomData.Cates.$values.map((c) => {
                            if (c.Id === catePart) {
                                return c.Questions.$values.map((q, index) => {
                                    return (
                                        <SwiperSlide id={q.Id} key={q.Id} className="slideQue">
                                            <Div
                                                wrap="wrap"
                                                width="100%"
                                                align="baseline"
                                                css={`
                                                    position: relative;
                                                    padding: 10px;
                                                    border: 1px solid
                                                        ${value.some((v) => v.id === q.Id && v.value.length) ||
                                                        choice.some((v) => v.id === q.Id && v.value.length) ||
                                                        valueInput.some((v) => v.id === q.Id && v.value)
                                                            ? '#94ee9c'
                                                            : 'wheat'};
                                                    border-radius: 5px;
                                                    box-shadow: 0 0 5px
                                                        ${value.some((v) => v.id === q.Id && v.value) ||
                                                        choice.some((v) => v.id === q.Id && v.value.length) ||
                                                        valueInput.some((v) => v.id === q.Id && v.value)
                                                            ? '#94ee9c'
                                                            : 'wheat'};
                                                    span {
                                                        color: #fff;
                                                    }
                                                    .buttOne {
                                                        position: absolute;
                                                        bottom: 10px;
                                                        left: 10px;
                                                    }
                                                    .buttTwo {
                                                        position: absolute;
                                                        bottom: 10px;
                                                        right: 10px;
                                                    }
                                                `}
                                            >
                                                <Div css="">
                                                    <P
                                                        size="1.5rem"
                                                        css={`
                                                            width: 100%;
                                                            border-bottom: 1px solid;
                                                            padding-bottom: 22px;
                                                            strong {
                                                                font-size: 1.5rem;
                                                                position: absolute;
                                                                top: 4px;
                                                                left: 7px;
                                                                color: #efefef;
                                                            }
                                                        `}
                                                    >
                                                        <strong>Question</strong>
                                                        {q.QuestionName}
                                                    </P>
                                                </Div>
                                                <Div
                                                    css={`
                                                        position: relative;
                                                        height: 50%;
                                                        strong {
                                                            font-size: 1.5rem;
                                                            position: absolute;
                                                            top: 4px;
                                                            left: 7px;
                                                            color: #efefef;
                                                        }
                                                        .aaaa {
                                                            width: 100%;
                                                            height: 100%;
                                                            margin: 40px 33px;
                                                            display: flex;
                                                            flex-wrap: wrap;
                                                            align-items: baseline;
                                                            padding: 12px;
                                                            .labelRadio {
                                                                width: 100%;
                                                                margin: 7px 0;
                                                            }
                                                        }
                                                    `}
                                                >
                                                    <strong>Answer</strong>
                                                    {q.AnswerType === 'array' ? (
                                                        JSON.parse(q.Answer)?.length > 1 ? (
                                                            <Checkbox.Group
                                                                options={JSON.parse(q.AnswerArray)}
                                                                value={checkedList}
                                                                onChange={(e) => onChangeBox(e, q.Id, index)}
                                                                className="aaaa"
                                                            />
                                                        ) : (
                                                            <Radio.Group
                                                                onChange={(e) => onChange(e, q.Id)}
                                                                value={value.filter((v) => v.id === q.Id)[0]?.value}
                                                                className="aaaa"
                                                            >
                                                                {JSON.parse(q.AnswerArray)?.map((answer: string) => (
                                                                    <Radio
                                                                        value={answer}
                                                                        className="labelRadio"
                                                                        key={answer}
                                                                    >
                                                                        {answer}
                                                                    </Radio>
                                                                ))}
                                                            </Radio.Group>
                                                        )
                                                    ) : (
                                                        <Div css="padding: 50px;">
                                                            <TextArea
                                                                placeholder="Your answer"
                                                                value={
                                                                    valueInput.filter((v) => v.id === q.Id)[0]?.value
                                                                }
                                                                onChange={(e) => {
                                                                    let check = false;
                                                                    const newIn = valueInput.map((i) => {
                                                                        if (i.id === q.Id) {
                                                                            i.value = e.target.value;
                                                                            check = true;
                                                                        }
                                                                        return i;
                                                                    });
                                                                    if (!check) {
                                                                        setValueInput([
                                                                            ...valueInput,
                                                                            {
                                                                                id: q.Id,
                                                                                value: e.target.value,
                                                                                index: indexQ.index,
                                                                            },
                                                                        ]);
                                                                    } else {
                                                                        setValueInput(newIn);
                                                                    }
                                                                }}
                                                            />
                                                        </Div>
                                                    )}
                                                </Div>
                                                <H3
                                                    css={`
                                                        position: absolute;
                                                        top: 4px;
                                                        right: 6px;
                                                        font-size: 1.5rem;
                                                    `}
                                                >
                                                    Point: {q.Point}
                                                </H3>
                                                <Button
                                                    type="primary"
                                                    className="buttOne"
                                                    disabled={index === 0}
                                                    onClick={() => handlePre(q.Id, index)}
                                                >
                                                    Prev
                                                </Button>
                                                <Button
                                                    type="primary"
                                                    className="buttTwo"
                                                    disabled={index === c.Questions.$values.length - 1}
                                                    onClick={() => handleNext(q.Id, index, c.Questions)}
                                                >
                                                    Next
                                                </Button>
                                            </Div>
                                        </SwiperSlide>
                                    );
                                });
                            }
                        })}
                    </Swiper>
                </Div>
            </Div>
        </Div>
    );
};

export default InCharger;
