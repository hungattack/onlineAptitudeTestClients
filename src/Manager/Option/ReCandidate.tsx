import React, { useState } from 'react';
import { Div, H3, InputA, P } from '../../styleComponent/styleComponent';
import { Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { AddI } from '../../assets/Icons/Icons';
import { useQuery } from '@tanstack/react-query';
import candidateAPI from '../../API/candidateAPI/candidateAPI';
import { useSelector } from 'react-redux';
import { PropsUserDataRD } from '../../redux/userData';
import { toast } from 'react-toastify';
interface DataType {
    id: number;
    index: number;
    key: string;
    name: string;
    education: string;
    experience: number;
    address: string;
    birthDay: string;
    email: string;
    occupationId: string;
    phoneNumber: string;
    userName: string;
    userId: string;
    password: string;
    start: boolean;
    occupation: {
        name: string;
    };
}
type PropsListExams = {
    $id: string;
    $values: {
        $id: string;
        CreatedAt: string;
        Id: string;
        Results: {
            $id: string;
            $values: {
                $id: string;
                Answer: string;
                CreatedAt: string;
                Id: number;
                UpdatedAt: string;
                catePart: null;
                catePartId: string;
                occupaionId: string;
                questionHisId: string;
                questionId: string;
            }[];
        };
        UpdatedAt: string;
        occupation: { $id: string; Id: string; Name: string };
        occupationId: string;
        userId: string;
    }[];
};
const ReCandidate: React.FC<{
    cate: {
        id: string;
        name: string;
        jobName?: string;
    };
}> = ({ cate }) => {
    const { user } = useSelector((state: { persistedReducer: { userData: PropsUserDataRD } }) => {
        return state.persistedReducer.userData;
    });
    const [account, setAccount] = useState<{ userName: string; password: string }>({ userName: '', password: '' });
    const [err, setErr] = useState<{ userName: boolean; password: boolean }>({ userName: false, password: false });
    const [generate, setGenerate] = useState<number | undefined>();
    const [listExams, setListExams] = useState<PropsListExams | undefined>();
    console.log(cate, 'cate');

    const { data, refetch } = useQuery({
        queryKey: [cate.id, 1],
        queryFn: async () => {
            const rs: DataType[] = await candidateAPI.get(cate.id, user?.id);
            return rs;
        },
    });
    let columns: ColumnsType<DataType> = [
        {
            title: 'Index',
            key: 'id',
            render: (_, record, index) => index + 1,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Education',
            dataIndex: 'education',
            key: 'education',
        },
        {
            title: 'Experience',
            dataIndex: 'experience',
            key: 'experience',
        },
        {
            title: 'BirthDay',
            dataIndex: 'birthDay',
            key: 'birthDay',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'PhoneNumber',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Room',
            key: 'roomKey',
            render: (_, record) =>
                record.userName && record.password ? (
                    <Space size="middle" key={record.id} style={{ flexWrap: 'wrap' }}>
                        <P css="width: max-content; text-align: left;">
                            <strong>code: </strong>
                            {record.occupationId}
                        </P>
                        <P css="width: max-content; text-align: left;">
                            <strong>Job's Name: </strong>
                            {record.occupation.name}
                        </P>
                        <P css="width: max-content; text-align: left;">
                            <strong>User Name: </strong>
                            {record.userName}
                        </P>
                        <P css="width: max-content; text-align: left;">
                            <strong>Password: </strong>
                            {record.password}
                        </P>
                    </Space>
                ) : generate && record.id === generate ? (
                    <Space size="middle" key={record.id}></Space>
                ) : (
                    ''
                ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {record.id === generate ? (
                        <>
                            {!record.userName && !record.password && (
                                <P
                                    css={`
                                        width: max-content;
                                        padding: 3px 7px;
                                        background-color: #4785d5;
                                        border-radius: 5px;
                                        color: #fff;
                                        font-size: 1.3rem;
                                        cursor: var(--pointer);
                                    `}
                                    onClick={async () => {
                                        let check = err;
                                        if (!account.userName) {
                                            check.userName = true;
                                        } else {
                                            check.userName = false;
                                        }
                                        if (!account.password) {
                                            check.password = true;
                                        } else {
                                            check.password = false;
                                        }
                                        if (account.userName && account.password) {
                                            const res = await candidateAPI.generate(
                                                account.userName,
                                                account.password,
                                                record.occupationId,
                                                record.id,
                                                record.userId,
                                            );
                                            if (res === 'ok') refetch();
                                            toast(res);
                                        }
                                        setErr({ ...check });
                                    }}
                                >
                                    Ready for the Generation
                                </P>
                            )}

                            <P
                                css={`
                                    width: max-content;
                                    padding: 3px 7px;
                                    background-color: #ca4a4a;
                                    border-radius: 5px;
                                    color: #fff;
                                    font-size: 1.3rem;
                                    cursor: var(--pointer);
                                `}
                                onClick={() => {
                                    setGenerate(undefined);
                                }}
                            >
                                Cancel the Generation
                            </P>
                        </>
                    ) : (
                        !record.userName &&
                        !record.password && (
                            <P
                                css={`
                                    padding: 3px 7px;
                                    background-color: #4785d5;
                                    border-radius: 5px;
                                    color: #fff;
                                    font-size: 1.3rem;
                                    cursor: var(--pointer);
                                `}
                                onClick={() => {
                                    setGenerate(record.id);
                                }}
                            >
                                Generate A & P
                            </P>
                        )
                    )}

                    <P
                        css={`
                            padding: 3px 7px;
                            background-color: #c43a68;
                            border-radius: 5px;
                            color: #fff;
                            font-size: 1.3rem;
                            cursor: var(--pointer);
                        `}
                        onClick={async () => {
                            const ok = window.confirm('Do you want to delete this item?');
                            if (ok) {
                                const res = await candidateAPI.delete(record.id, record.userId);
                                if (res === 'ok') {
                                    refetch();
                                    toast('Delete successful!');
                                }
                            }
                        }}
                    >
                        Delete
                    </P>
                </Space>
            ),
        },
    ];

    return (
        <Div display="block" css="overflow-x: overlay; background-color: #272727; position: relative; ">
            {listExams && (
                <Div
                    css={`
                        position: absolute;
                        height: 100%;
                        z-index: 1;
                        top: 50%;
                        right: 50%;
                        left: 50%;
                        background-color: #111111c7;
                        translate: -50% -50%;
                        color: #fff;
                    `}
                    onClick={() => setListExams(undefined)}
                >
                    {listExams.$values.map((l) => {
                        const point = l.Results.$values.reduce((v, vl) => {
                            console.log(JSON.parse(vl.Answer), 'JSON.parse(JSON.parse(vl.Answer)');
                            JSON.parse(JSON.parse(vl.Answer).pointAr).map((r: { id: string; point: string }) => {
                                v += Number(r.point);
                            });
                            return v;
                        }, 0);
                        return (
                            <Div
                                width="70%"
                                css={`
                                    height: 70%;
                                    border-radius: 5px;
                                    background-color: #333;
                                `}
                            >
                                <Div wrap="wrap" css="h3{width: 100%;}">
                                    <H3>{l.occupation.Name}</H3>
                                    <P>{point}🎯</P>
                                </Div>
                            </Div>
                        );
                    })}
                </Div>
            )}
            <H3 css="width: 97%; margin: 10px; color: #f2f2f2f7;"> {cate?.jobName}</H3>
            {/* <Table style={{ width: '85%', overflow: 'overlay' }} columns={columns} dataSource={data} /> */}
            {data?.map((d) => (
                <Div
                    key={d.id}
                    width="80%"
                    wrap="wrap"
                    css={`
                        position: relative;
                        margin: 10px auto;
                        padding: 10px;
                        background-color: #4c5260;
                        border-radius: 5px;
                        color: #f2f2f2f7;
                        h4 {
                            font-size: 1.5rem;
                            margin: 5px 0;
                            margin-right: 10px;
                        }
                        p {
                            font-size: 1.3rem;
                        }
                    `}
                >
                    <Div justify="left">
                        <h4>Name:</h4>
                        <P>{d.name}</P>
                    </Div>{' '}
                    <Div justify="left">
                        <h4>Phone number:</h4>
                        <P>{d.phoneNumber}</P>
                    </Div>{' '}
                    <Div justify="left">
                        <h4>Email:</h4>
                        <P>{d.email}</P>
                    </Div>
                    <Div justify="left">
                        <h4>Education:</h4>
                        <P>{d.education}</P>
                    </Div>
                    <Div justify="left">
                        <h4>Experience:</h4>
                        <P>{d.experience}</P>
                    </Div>
                    <Div justify="left">
                        <h4>BirthDay:</h4>
                        <P>{d.birthDay}</P>
                    </Div>{' '}
                    <Div justify="left">
                        <h4>Address:</h4>
                        <P>{d.address}</P>
                    </Div>{' '}
                    <Div justify="left" css="border-top: 1px solid silver; margin-top: 5px;">
                        <h4>Job's name:</h4>
                        <P>{d.occupation.name}</P>
                    </Div>
                    <Div justify="left">
                        <h4>Room key:</h4>
                        <P>{d.occupationId}</P>
                    </Div>
                    <Div justify="left">
                        <h4>UserName:</h4>
                        <P>{d.userName}</P>
                    </Div>
                    <Div justify="left">
                        <h4>Password:</h4>
                        <P>{d.password}</P>
                    </Div>
                    <Div wrap="wrap" width="70%" justify="left" css="margin-top: 10px; input{margin: 0 5px;}">
                        {generate === d.id && !d.userName && !d.password && (
                            <Div css="margin-top: 10px; input{margin: 0 5px;}">
                                <InputA
                                    type="text"
                                    placeholder="Generate user name"
                                    css={`
                                        padding: 4px;
                                        border-radius: 5px;
                                        border-color: ${err.userName ? 'red' : ''};
                                    `}
                                    value={account.userName}
                                    onChange={(e) => {
                                        setAccount({ ...account, userName: e.target.value });
                                        setErr({ ...err, userName: false });
                                    }}
                                />
                                <InputA
                                    type="text"
                                    placeholder="Generate password"
                                    css={`
                                        padding: 4px;
                                        border-radius: 5px;
                                        border-color: ${err.password ? 'red' : ''};
                                    `}
                                    value={account.password}
                                    onChange={(e) => {
                                        setErr({ ...err, password: false });
                                        setAccount({ ...account, password: e.target.value });
                                    }}
                                />
                            </Div>
                        )}
                        <Div justify="space-around" css="margin-top: 10px; ">
                            {generate === d.id ? (
                                <>
                                    {!d.userName && !d.password && (
                                        <>
                                            <P
                                                css={`
                                                    width: max-content;
                                                    padding: 3px 7px;
                                                    background-color: #4785d5;
                                                    border-radius: 5px;
                                                    color: #fff;
                                                    font-size: 1.3rem;
                                                    cursor: var(--pointer);
                                                `}
                                                onClick={async () => {
                                                    let check = err;
                                                    if (!account.userName) {
                                                        check.userName = true;
                                                    } else {
                                                        check.userName = false;
                                                    }
                                                    if (!account.password) {
                                                        check.password = true;
                                                    } else {
                                                        check.password = false;
                                                    }
                                                    if (account.userName && account.password) {
                                                        const res = await candidateAPI.generate(
                                                            account.userName,
                                                            account.password,
                                                            d.occupationId,
                                                            d.id,
                                                            d.userId,
                                                        );
                                                        if (res === 'ok') refetch();
                                                        toast(res);
                                                    }
                                                    setErr({ ...check });
                                                }}
                                            >
                                                Ready for the Generation
                                            </P>
                                            <P
                                                css={`
                                                    width: max-content;
                                                    padding: 3px 7px;
                                                    background-color: #ca4a4a;
                                                    border-radius: 5px;
                                                    color: #fff;
                                                    font-size: 1.3rem;
                                                    cursor: var(--pointer);
                                                `}
                                                onClick={() => {
                                                    setGenerate(undefined);
                                                }}
                                            >
                                                Cancel the Generation
                                            </P>
                                        </>
                                    )}
                                </>
                            ) : (
                                !d.userName &&
                                !d.password && (
                                    <P
                                        css={`
                                            padding: 3px 7px;
                                            background-color: #4785d5;
                                            border-radius: 5px;
                                            color: #fff;
                                            font-size: 1.3rem;
                                            cursor: var(--pointer);
                                        `}
                                        onClick={() => {
                                            setGenerate(d.id);
                                        }}
                                    >
                                        Generate Account name & Password
                                    </P>
                                )
                            )}

                            <Div
                                display="block"
                                width="auto"
                                css={`
                                    position: absolute;
                                    top: 10px;
                                    right: 15px;
                                `}
                            >
                                <P
                                    css={`
                                        padding: 3px 7px;
                                        background-color: #4d87da;
                                        border-radius: 5px;
                                        color: #fff;
                                        font-size: 1.3rem;
                                        margin: 5px 0;
                                        cursor: var(--pointer);
                                    `}
                                    onClick={async () => {
                                        const res: PropsListExams = await candidateAPI.getExams(d.userId, user?.id);
                                        if (res) setListExams(res);
                                    }}
                                >
                                    The testing exams
                                </P>
                                <P
                                    css={`
                                        padding: 3px 7px;
                                        background-color: #c43a68;
                                        border-radius: 5px;
                                        color: #fff;
                                        font-size: 1.3rem;
                                        cursor: var(--pointer);
                                    `}
                                    onClick={async () => {
                                        const ok = window.confirm('Do you want to delete this item?');
                                        if (ok) {
                                            const res = await candidateAPI.delete(d.id, d.userId);
                                            if (res === 'ok') {
                                                refetch();
                                                toast('Delete successful!');
                                            }
                                        }
                                    }}
                                >
                                    Delete
                                </P>
                            </Div>
                        </Div>
                    </Div>
                </Div>
            ))}
        </Div>
    );
};

export default ReCandidate;
