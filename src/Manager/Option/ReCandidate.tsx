import React, { useEffect, useState } from 'react';
import { Div, H3, InputA, P } from '../../styleComponent/styleComponent';
import { Button, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { AddI, ReTestI } from '../../assets/Icons/Icons';
import { useQuery } from '@tanstack/react-query';
import candidateAPI from '../../API/candidateAPI/candidateAPI';
import { useSelector } from 'react-redux';
import { PropsUserDataRD } from '../../redux/userData';
import { toast } from 'react-toastify';
import questionHistoryAPI from '../../API/questionHistoryAPI/questionHistoryAPI';
import TextArea from 'antd/es/input/TextArea';
import Input from 'antd/es/input/Input';
interface DataType {
    id: number;
    index: number;
    key: string;
    name: string;
    note: string;
    education: string;
    experience: number;
    address: string;
    birthDay: string;
    email: string;
    occupationId: string;
    phoneNumber: string;
    userName: string;
    userId: string;
    reTest: boolean;
    password: string;
    updatedAt: string;
    start: string;
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
        pointAll: number;
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
    const [search, setSearch] = useState<string>('');
    const [account, setAccount] = useState<{ userName: string; password: string; note: string }>({
        userName: '',
        password: '',
        note: '    ',
    });
    const [err, setErr] = useState<{ userName: boolean; password: boolean; note: boolean }>({
        userName: false,
        password: false,
        note: false,
    });
    const [generate, setGenerate] = useState<number | undefined>();
    const [listExams, setListExams] = useState<PropsListExams | undefined>();
    console.log(cate, 'cate');
    useEffect(() => {
        setSearch('');
    }, [cate]);
    const { data, refetch } = useQuery({
        queryKey: [cate.id, 1],
        enabled: search ? false : true,
        queryFn: async () => {
            if (search) {
                const res: DataType[] = await candidateAPI.searchByName(search, cate.id, user?.id);
                return res;
            } else {
                const rs: DataType[] = await candidateAPI.get(cate.id, user?.id);
                return rs;
            }
        },
    });
    const handleLogin = async (id: number, occupationId: string, userId: string) => {
        let check = err;
        if (!account.userName) {
            check.userName = true;
        } else {
            check.userName = false;
        }
        if (!account.note) {
            check.note = true;
        } else {
            check.note = false;
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
                occupationId,
                id,
                account.note,
                userId,
                user?.id,
            );
            if (res === 'ok') refetch();
            toast(res);
            setGenerate(undefined);
        }
        setErr({ ...check });
    };
    const handleSearch = async () => {
        refetch();
    };
    return (
        <Div display="block" css="overflow-x: overlay; background-color: #272727; position: relative; ">
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
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button type="primary" onClick={handleSearch}>
                    Search
                </Button>
            </Div>
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
                    <Div
                        width="70%"
                        display="block"
                        css={`
                            height: 70%;
                            border-radius: 5px;
                            background-color: #333;
                        `}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Div
                            css={`
                                padding: 10px;
                                justify-content: space-around;
                                font-size: 1.4rem;
                                h3 {
                                    cursor: var(--pointer);
                                }
                            `}
                        >
                            <H3>Week</H3> <H3>Month</H3> <H3>Year</H3>
                        </Div>
                        {listExams.$values.length ? (
                            listExams.$values.map((l) => {
                                const point = l.Results.$values.reduce((v, vl) => {
                                    console.log(JSON.parse(vl.Answer), 'JSON.parse(JSON.parse(vl.Answer)');
                                    JSON.parse(vl.Answer).correct.map((r: any) => {
                                        if (r.type !== 'input')
                                            JSON.parse(r.pointAr).map((po: { id: string; point: string }) => {
                                                v += Number(po.point);
                                            });
                                    });
                                    return v;
                                }, 0);
                                return (
                                    <Div
                                        wrap="wrap"
                                        css={`
                                            padding: 5px;
                                            background-color: #4c4c4c;
                                            h3 {
                                                width: 100%;
                                            }
                                            position: relative;
                                        `}
                                    >
                                        <H3>{l.occupation.Name}</H3>
                                        <P>
                                            {point} / {l.pointAll}🎯
                                        </P>
                                        <Div
                                            width="auto"
                                            css={`
                                                position: absolute;
                                                top: 5px;
                                                right: 10px;
                                            `}
                                            onClick={async () => {
                                                const res = await questionHistoryAPI.delete(
                                                    l.occupationId,
                                                    l.userId,
                                                    user?.id,
                                                );
                                                if (res === 'ok') {
                                                    const res: PropsListExams = await candidateAPI.getExams(
                                                        l.userId,
                                                        user?.id,
                                                    );
                                                    if (res) setListExams(res);
                                                    toast('Delete successfully!');
                                                }
                                            }}
                                        >
                                            <Button type="primary">Delete</Button>
                                        </Div>
                                    </Div>
                                );
                            })
                        ) : (
                            <P color="red">Empty</P>
                        )}
                    </Div>
                </Div>
            )}
            <H3 css="width: 97%; margin: 10px; color: #f2f2f2f7;"> {cate?.jobName}</H3>
            {/* <Table style={{ width: '85%', overflow: 'overlay' }} columns={columns} dataSource={data} /> */}
            {data?.length ? (
                data?.map((d) => (
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
                        {d.userName && d.password && (
                            <>
                                <Div justify="left">
                                    <h4>UserName:</h4>
                                    <P>{d.userName}</P>
                                </Div>
                                <Div justify="left">
                                    <h4>Password:</h4>
                                    <P>{d.password}</P>
                                </Div>{' '}
                                <Div justify="left">
                                    <h4>End of login:</h4>
                                    <P>{d.updatedAt}</P>
                                </Div>
                                <Div justify="left">
                                    <h4>Note:</h4>
                                    <P>{d.note}</P>
                                </Div>
                                {generate === d.id ? (
                                    <Div width="min-content" display="block" css="button{margin: 5px 0;}">
                                        <Button
                                            type="primary"
                                            onClick={() => handleLogin(d.id, d.occupationId, d.userId)}
                                        >
                                            Start update
                                        </Button>
                                        <Button type="default" onClick={() => setGenerate(undefined)}>
                                            Cancel
                                        </Button>
                                    </Div>
                                ) : (
                                    cate.id === 'register' && (
                                        <Button type="primary" onClick={() => setGenerate(d.id)}>
                                            Update generation
                                        </Button>
                                    )
                                )}
                            </>
                        )}
                        {cate.id === 'register' && d.start === 'end' && !d.reTest && (
                            <Div
                                justify="left"
                                onClick={async () => {
                                    if (user) {
                                        const res = await candidateAPI.reTest(d.userId, user.id, d.occupationId);
                                        if (res === 'ok') refetch();
                                    }
                                }}
                            >
                                <Button>Retest</Button>
                            </Div>
                        )}
                        <Div wrap="wrap" width="70%" justify="left" css="margin-top: 10px; input{margin: 0 5px;}">
                            {generate === d.id && (
                                <Div wrap="wrap">
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
                                    <Div
                                        css={`
                                            border-radius: 5px;
                                            margin: 10px;
                                        `}
                                    >
                                        <TextArea
                                            placeholder="Note*"
                                            onChange={(e) => {
                                                setErr({ ...err, note: false });
                                                setAccount({ ...account, note: e.target.value });
                                            }}
                                        />
                                    </Div>
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
                                                    onClick={() => handleLogin(d.id, d.occupationId, d.userId)}
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
                ))
            ) : (
                <P color="red">Empty</P>
            )}
        </Div>
    );
};

export default ReCandidate;
