import React, { useEffect, useRef, useState } from 'react';
import { Div, DivLoading, H3, P } from '../styleComponent/styleComponent';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { CheckI, DuraI, TimeOutI, TimerI } from '../assets/Icons/Icons';
import { Button, Checkbox, Input, Radio, RadioChangeEvent } from 'antd';
import { PropsRoomData } from './TestingRoom';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import Timer from './Timer';
import TextArea from 'antd/es/input/TextArea';
import { useDispatch, useSelector } from 'react-redux';
import {
    PropsTestingDataRD,
    setCandidateProcess,
    setCateP,
    setChoiceRD,
    setEnd,
    setStartRD,
    setValueInputRD,
    setValueRD,
} from '../redux/testingData';
import moment from 'moment';
const InCharger: React.FC<{
    roomData: PropsRoomData;
    catePart: string; // first section
    setCatePart: React.Dispatch<React.SetStateAction<string>>;
}> = ({ roomData, catePart, setCatePart }) => {
    const dispatch = useDispatch();
    const { status, startTime, canProcess, id_room } = useSelector(
        (state: { persistedReducer: { testingData: PropsTestingDataRD } }) => state.persistedReducer.testingData,
    );
    const [process, setProcess] = useState<{ id: string; index: number }[]>([]);
    const defaultCheckedList = ['Apple', 'Orange'];
    const [checkedList, setCheckedList] = useState<CheckboxValueType[]>(defaultCheckedList);
    // value
    const [valueInput, setValueInput] = useState<{ id: string; value: string; index: number }[]>(() => {
        let data: { id: string; value: string; index: number }[] = [];
        if (canProcess.length && canProcess.some((c) => c.id === catePart)) {
            data = JSON.parse(canProcess.filter((c) => c.id === catePart)[0].valueInputRD);
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
        if (canProcess.length && canProcess.some((c) => c.id === catePart)) {
            data = JSON.parse(canProcess.filter((c) => c.id === catePart)[0].valueRD);
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
        if (canProcess.length && canProcess.some((c) => c.id === catePart)) {
            data = JSON.parse(canProcess.filter((c) => c.id === catePart)[0].choicesRD);
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
        dispatch(setCateP(catePart));
        if (startTime.length > 1 && startTime.some((s) => s.id === catePart)) {
            setValue(() => {
                let data: { id: string; value: string[]; index: number }[] = [];
                roomData.Cates.$values.map((c) => {
                    if (c.Id === catePart || startTime.some((s) => s.id === c.Id)) {
                        if (canProcess.length && canProcess.some((cs) => cs.id === c.Id && cs?.valueRD)) {
                            data = JSON.parse(canProcess.filter((cd) => cd.id === c.Id)[0].valueRD);
                        } else {
                            c.Questions.$values.map((q, index) => {
                                if (JSON.parse(q.Answer)?.length === 1 && q.AnswerType !== 'string') {
                                    data.push({ id: q.Id, value: [], index });
                                }
                            });
                        }
                    }
                });
                return data;
            });
            setValueInput(() => {
                let data: { id: string; value: string; index: number }[] = [];
                roomData.Cates.$values.map((c) => {
                    if (c.Id === catePart || startTime.some((s) => s.id === c.Id)) {
                        if (canProcess.length && canProcess.some((cs) => cs.id === c.Id && cs?.valueInputRD)) {
                            data = JSON.parse(canProcess.filter((cd) => cd.id === c.Id)[0].valueInputRD);
                        } else {
                            c.Questions.$values.map((q, index) => {
                                if (q.AnswerType === 'string') {
                                    data.push({ id: q.Id, value: '', index });
                                }
                            });
                        }
                    }
                });
                return data;
            });
            setChoice(() => {
                let data: { id: string; value: string[]; index: number }[] = [];
                roomData.Cates.$values.map((c) => {
                    if (c.Id === catePart || startTime.some((s) => s.id === c.Id)) {
                        if (canProcess.length && canProcess.some((cs) => cs.id === c.Id && cs?.choicesRD)) {
                            data = JSON.parse(canProcess.filter((cd) => cd.id === c.Id)[0].choicesRD);
                        } else {
                            c.Questions.$values.map((q, index) => {
                                if (JSON.parse(q.Answer)?.length > 1 && q.AnswerType !== 'string') {
                                    data.push({ id: q.Id, value: [], index });
                                }
                            });
                        }
                    }
                });
                return data;
            });
        }
    }, [catePart]);
    useEffect(() => {
        let check = false;
        canProcess.map((c) => {
            if (c.id === catePart) {
                if (c.valueRD && c.valueRD !== JSON.stringify(value)) {
                    dispatch(setValueRD({ value: JSON.stringify(value), id: catePart }));
                }
                if (c.valueInputRD && c.valueInputRD !== JSON.stringify(valueInput)) {
                    dispatch(setValueInputRD({ valueInput: JSON.stringify(valueInput), id: catePart }));
                }
                if (c.choicesRD && c.choicesRD !== JSON.stringify(choice)) {
                    dispatch(setChoiceRD({ choice: JSON.stringify(choice), id: catePart }));
                }
                check = true;
            }
        });
        console.log(canProcess, catePart, 'catepar');

        if (!check) {
            dispatch(
                setCandidateProcess({
                    id: catePart,
                    valueRD: JSON.stringify(value),
                    valueInputRD: JSON.stringify(valueInput),
                    choicesRD: JSON.stringify(choice),
                }),
            );
        }
    }, [choice, value, valueInput]);
    const onChange = (e: RadioChangeEvent, id: string) => {
        console.log('radio checked', e.target.value);
        if (startTime.some((s) => s.id === catePart && !s.finish)) {
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
        if (startTime.some((s) => s.id === catePart && !s.finish)) {
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
        }
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
                    {roomData.Cates.$values.map((c, index) => {
                        return (
                            <SwiperSlide key={c.Id}>
                                <Div
                                    css={`
                                        height: 100%;
                                        display: flex;
                                        align-items: center;
                                        position: relative;
                                        width: 100%;
                                        justify-content: center;
                                        cursor: var(--pointer);
                                        ${c.Id === catePart
                                            ? "&:after {display: block; content: ''; width: 100%; height: 2px; background-color: #dedede; position: absolute; bottom: 0px;}"
                                            : ''}
                                        ${startTime.some((s) => s.id === catePart && c.Id === s.id && !s.finish)
                                            ? 'color: #68eee4;'
                                            : startTime.some((s) => s.id === c.Id && s.finish)
                                            ? 'color: #a9a62d;'
                                            : startTime.some((s) => s.id === c.Id)
                                            ? 'color: #fff;'
                                            : 'color: #858585;'}
                                    `}
                                    onClick={() => {
                                        if (startTime.some((s) => s.id === c.Id && catePart !== c.Id)) {
                                            setCatePart(c.Id);
                                            swiperRef.current.slideTo(0);
                                            setIndex({ id: c.Questions.$values[0].Id, index: 0 });
                                        }
                                    }}
                                >
                                    <H3 size="1.6rem">{c.Name}</H3>
                                    <Div width="auto" display="block" css="font-size: 1.4rem">
                                        ( {c.TimeOut}{' '}
                                        {startTime.some((s) => s.id === c.Id) ? (
                                            startTime.some((s) => s.id === c.Id && s.finish) ? (
                                                <TimeOutI />
                                            ) : (
                                                <DivLoading>
                                                    <DuraI />
                                                </DivLoading>
                                            )
                                        ) : (
                                            <TimerI />
                                        )}
                                        {c.TimeType ?? 'minutes'} )
                                    </Div>
                                </Div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </Div>
            <Div wrap="wrap" align="baseline" css="height: 94%; margin-top: 5px;  color: #fff; border-radius: 5px;">
                <Div width="90%" css="height: 35px;">
                    {roomData.Cates.$values.map((c, index) => {
                        if (c.Id === catePart) {
                            return (
                                <Div
                                    key={c.Id}
                                    width="auto"
                                    css={`
                                        margin-top: 9px;
                                        border-radius: 5px;
                                        margin-right: 10px;
                                        font-size: 1.4rem;
                                        cursor: var(--pointer);
                                        padding: 0 10px;
                                        height: 35px;
                                        ${startTime.some((s) => s.id === catePart && !s.finish)
                                            ? 'border: 1px solid #39a7c6;  box-shadow: 0 0 7px #39a7c6; &:hover {background-color: #1d374d;}'
                                            : 'cursor: no-drop; color: #a5a5a5;'}
                                    `}
                                    onClick={() => {
                                        if (startTime.some((s) => s.id === catePart && !s.finish)) {
                                            const ok = window.confirm('You want to submit this part?');
                                            if (ok) {
                                                dispatch(setEnd({ id: catePart }));
                                                if (roomData.Cates.$values[index + 1]) {
                                                    const { Id, TimeOut, TimeType } = roomData.Cates.$values[index + 1];
                                                    const startT = moment(
                                                        moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                                                        'YYYY-MM-DD HH:mm:ss',
                                                    );
                                                    const type =
                                                        TimeType === 'Hour'
                                                            ? 'hours'
                                                            : TimeType === 'Minute'
                                                            ? 'minutes'
                                                            : 'seconds';
                                                    const newType =
                                                        TimeOut < 2
                                                            ? type === 'hours'
                                                                ? 'hour'
                                                                : type === 'minutes'
                                                                ? 'minute'
                                                                : 'second'
                                                            : type;
                                                    const end = startT.add(TimeOut, newType);
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

                                                    console.log(
                                                        'finish',
                                                        startTime.some((s) => s?.id === c.Id && s.finish),
                                                    );
                                                    setCatePart(roomData.Cates.$values[index + 1].Id);
                                                }
                                            }
                                        }
                                    }}
                                >
                                    Done
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
                            console.log(startTime, 'startTime');

                            const { id, start, end } = startTime.filter((s) => s.id === catePart)[0];
                            return (
                                <Timer
                                    key={c.Id}
                                    start={start}
                                    end={end}
                                    setCatePart={setCatePart}
                                    roomData={roomData}
                                    catePart={catePart}
                                />
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
                            console.log('zooo', process);

                            let pr = process;
                            console.log(e.slides[e.activeIndex].getAttribute('id'), 'active');
                            if (value.length) {
                                let i = indexQ.index;
                                console.log(indexQ, 'value', value);
                                value.forEach((v) => {
                                    if (e.activeIndex > v.index && !v.value.length) {
                                        if (!pr.some((p) => p.id === v.id)) pr = [...pr, { id: v.id, index: i }];
                                        console.log('value xoo');
                                        if (i < e.activeIndex) i++;
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
                                let i = indexQ.index;
                                valueInput.forEach((v, index) => {
                                    if (e.activeIndex > v.index && !v.value) {
                                        console.log('valueInput zoo');
                                        if (!pr.some((p) => p.id === v.id)) pr = [...pr, { id: v.id, index: i }];
                                        if (i < e.activeIndex) i++;
                                    } else {
                                        const newPr = pr.filter((p) => p.id !== v.id);
                                        console.log('valueInput noo', newPr);
                                        pr = newPr;
                                    }
                                });
                                console.log(pr, 'process');
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
                                let i = indexQ.index;
                                console.log(indexQ, 'choice');
                                choice.forEach((v) => {
                                    if (e.activeIndex > v.index && !v.value.length) {
                                        if (!pr.some((p) => p.id === v.id)) pr = [...pr, { id: v.id, index: i }];
                                        if (i < e.activeIndex) i++;
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
                                                                value={choice.filter((c) => c.id === q.Id)[0]?.value}
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
                                                                    if (
                                                                        startTime.some(
                                                                            (s) => s.id === catePart && !s.finish,
                                                                        )
                                                                    ) {
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