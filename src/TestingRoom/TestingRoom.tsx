import React, { useEffect, useState } from 'react';
import { Div, DivLoading, H3, P } from '../styleComponent/styleComponent';
import { Avatar, Button, Checkbox, Drawer, Form, Input, List, RadioChangeEvent, Space, Tag } from 'antd';
import roomAPI from '../API/roomAPI/roomAPI';
import candidateAPI from '../API/candidateAPI/candidateAPI';
import { toast } from 'react-toastify';
import moment from 'moment';
import Duration from './Duration';
import InCharger from './InCharger';
import { useDispatch, useSelector } from 'react-redux';
import { PropsTestingDataRD, setDelCalcul, setEnd, setResetAll, setStartRD } from '../redux/testingData';
import { LoadingI } from '../assets/Icons/Icons';
import Result from './Result';
import { PropsUserDataRD } from '../redux/userData';
type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
};
export interface PropsRoomData {
    Id: string;
    Name: string;
    user: {
        Id: string;
        Name: string;
        Gender: number;
    };
    userId: string;
    Cates: {
        $values: {
            CreatedAt: string;
            Id: string;
            Name: string;
            OccupationId: string;
            Questions: {
                $values: {
                    Answer: string;
                    AnswerArray: string;
                    AnswerType: string;
                    Cate: boolean;
                    CreatedAt: string;
                    Id: string;
                    PartId: string;
                    PointAr: string;
                    QuestionName: string;
                    UpdatedAt: string;
                }[];
            };
            TimeOut: number;
            TimeType: string;
            UpdatedAt: string;
            occupation: boolean;
        }[];
    };
}
const TestingRoom = () => {
    const dispatch = useDispatch();
    const { status, startTime, id_room, cateP } = useSelector(
        (state: { persistedReducer: { testingData: PropsTestingDataRD } }) => state.persistedReducer.testingData,
    );
    const { login, register, user } = useSelector((state: { persistedReducer: { userData: PropsUserDataRD } }) => {
        return state.persistedReducer.userData;
    });
    const [start, setStart] = useState<string>('stop');
    const [catePart, setCatePart] = useState<string>(cateP);
    const [roomData, setRoomData] = useState<PropsRoomData>();
    const [code, setCode] = useState<string>(() => id_room ?? '');
    const [err, setErr] = useState<string>('');
    const [empty, setEmpty] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const onFinish = async (values: any) => {
        dispatch(setEnd({ id: catePart }));
        const res = await candidateAPI.login(
            values.username,
            values.password,
            roomData?.Id,
            roomData?.user.Id,
            user?.id,
        );
        if (res === true) {
            if (roomData) {
                roomData.Cates.$values.forEach((c) => {
                    if (c.Id === catePart) {
                        const startT = moment(moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss');
                        const type = c.TimeType === 'Hour' ? 'hours' : c.TimeType === 'Minute' ? 'minutes' : 'seconds';
                        const newType =
                            c.TimeOut < 2
                                ? type === 'hours'
                                    ? 'hour'
                                    : type === 'minutes'
                                    ? 'minute'
                                    : 'second'
                                : type;
                        const end = startT.add(c.TimeOut, newType);
                        dispatch(
                            setStartRD({
                                id_room: code,
                                others: {
                                    id: c.Id,
                                    start: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                                    end: end.format('YYYY-MM-DD HH:mm:ss'),
                                    finish: false,
                                },
                            }),
                        );
                    }
                });
            }
            toast(res);
            setStart('start');
            setErr('');
        } else {
            setErr(res);
        }
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    let timeOut = 0;
    let point = 0;
    const cates = roomData?.Cates?.$values.map((c) => {
        timeOut += c.TimeOut;
        c.Questions?.$values.forEach((q) => {
            JSON.parse(q.PointAr).map((p: { id: number; point: string }) => {
                point += Number(p.point);
            });
        });
    });
    const questions = roomData?.Cates?.$values.map((c) => {
        const arr = `${c.Name} has ${c.Questions?.$values.length} questions`;
        return arr;
    });
    const data = [
        <Div>
            <H3 css="margin-right: 5px">Created by: </H3>
            <List.Item.Meta
                avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${1}`} />}
                title={<H3 css="width: fit-content;">{roomData?.user?.Name}</H3>}
            />
        </Div>,
        `Room code: ${roomData?.Id}`,
        `There are ${
            roomData?.Cates?.$values.length === 1
                ? roomData?.Cates?.$values.length + ' part'
                : roomData?.Cates?.$values.length + ' parts'
        }`,
        ...(questions ?? []),
        `Total time to do is ${timeOut} minutes`,
        `Total point is ${point} points`,
    ];
    useEffect(() => {
        async function fetch() {
            if (code && user) {
                setLoading(true);
                const res: PropsRoomData | string = await roomAPI.getRoom(code, user?.id);
                if (typeof res !== 'string') {
                    setCatePart(cateP);
                    setRoomData(res);
                    setStart('inCharger');
                    setEmpty('');
                } else {
                    setEmpty(res);
                }
                setLoading(false);
            }
        }
        fetch();
    }, []);
    const handleFindRoom = async () => {
        if (code) {
            setLoading(true);
            const res: PropsRoomData | string = await roomAPI.getRoom(code, user?.id);
            if (typeof res !== 'string') {
                dispatch(setDelCalcul());
                setCatePart(res?.Cates.$values[0].Id);
                setRoomData(res);
                setEmpty('');
            } else {
                setEmpty(res);
            }
            setLoading(false);
        }
    };
    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = (e: any) => {
        e.stopPropagation();
        setOpen(false);
    };
    console.log(start, 'start');
    useEffect(() => {
        if (start === 'end') dispatch(setResetAll());
    }, [start]);
    return (
        <Div wrap="wrap" css="height: 92%; ">
            <Div
                justify="left"
                css={`
                    height: 48px;
                    background-image: linear-gradient(355deg, #31656b, #393939);
                    input {
                        width: 40%;
                        background-color: #3d3d3d;
                        color: #fff !important;
                    }
                    button {
                        margin-left: 5px;
                        color: #fff !important;
                    }
                `}
            >
                <Input
                    type="text"
                    placeholder="Search room by code"
                    disabled={start === 'inCharger' ? true : false}
                    value={code}
                    onChange={(e) => setCode(e.target.value.trim())}
                />
                <Button type="primary" onClick={handleFindRoom} disabled={start === 'inCharger' ? true : false}>
                    Search
                </Button>
            </Div>
            <Div
                width="30%"
                css="height: 93%; border-right: 1px solid #878787; background-color: #3d3d3d;"
                onClick={showDrawer}
            >
                <Result roomData={roomData} />
            </Div>
            <Div width="70%" css="height: 93%; background-color: #3d3d3d; padding: 10px; overflow-y: overlay;">
                {start === 'stop' && (
                    <>
                        {loading ? (
                            <DivLoading>
                                <LoadingI />
                            </DivLoading>
                        ) : empty ? (
                            <Div>
                                <P size="1.7rem" color="red">
                                    {empty}
                                </P>
                            </Div>
                        ) : (
                            roomData && (
                                <Div
                                    css={`
                                        height: 100%;
                                        .ant-spin-nested-loading {
                                            height: 323px;
                                            overflow-y: overlay;
                                        }
                                    `}
                                >
                                    <List
                                        style={{ backgroundColor: '#fff', height: '100%' }}
                                        size="small"
                                        header={
                                            <Div>
                                                <H3>{roomData?.Name}</H3>
                                            </Div>
                                        }
                                        footer={
                                            <Div wrap="wrap">
                                                <H3 css="width: 100%">You will have to Login to do this test exam</H3>
                                                <Space
                                                    size={[0, 8]}
                                                    wrap
                                                    style={{
                                                        width: '100%',
                                                        justifyContent: 'center',
                                                        margin: '10px 0',
                                                    }}
                                                >
                                                    <Tag color="magenta">Note*:</Tag>
                                                    <Tag color="purple">
                                                        user name and password are generated by Managers
                                                    </Tag>
                                                </Space>
                                                <Form
                                                    name="basic"
                                                    labelCol={{ span: 8 }}
                                                    wrapperCol={{ span: 16 }}
                                                    style={{ maxWidth: 600 }}
                                                    initialValues={{ remember: true }}
                                                    onFinish={onFinish}
                                                    onFinishFailed={onFinishFailed}
                                                    autoComplete="off"
                                                >
                                                    <Form.Item<FieldType>
                                                        label="Username"
                                                        name="username"
                                                        rules={[
                                                            { required: true, message: 'Please input your username!' },
                                                        ]}
                                                    >
                                                        <Input />
                                                    </Form.Item>

                                                    <Form.Item<FieldType>
                                                        label="Password"
                                                        name="password"
                                                        rules={[
                                                            { required: true, message: 'Please input your password!' },
                                                        ]}
                                                    >
                                                        <Input.Password />
                                                    </Form.Item>
                                                    {err && (
                                                        <P size="1.3rem" css="width: 100%; color: red">
                                                            {err}
                                                        </P>
                                                    )}
                                                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                                        <Button type="primary" htmlType="submit">
                                                            Start now
                                                        </Button>
                                                    </Form.Item>
                                                </Form>
                                            </Div>
                                        }
                                        bordered
                                        dataSource={data}
                                        renderItem={(item) => <List.Item>{item}</List.Item>}
                                    />
                                </Div>
                            )
                        )}
                    </>
                )}
                {start === 'start' && <Duration time={3} setStart={setStart} />}
                {start === 'inCharger' && roomData && (
                    <InCharger roomData={roomData} catePart={catePart} setCatePart={setCatePart} setStart={setStart} />
                )}
                {}
            </Div>
        </Div>
    );
};

export default TestingRoom;
