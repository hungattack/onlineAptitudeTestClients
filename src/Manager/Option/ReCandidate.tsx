import React, { useState } from 'react';
import { Div, InputA, P } from '../../styleComponent/styleComponent';
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
    birthday: string;
    email: string;
    occupationId: string;
    phoneNumber: string;
    userName: string;
    userId: string;
    password: string;
    occupation: {
        name: string;
    };
}
const ReCandidate: React.FC<{
    cate: {
        id: string;
        name: string;
    };
}> = ({ cate }) => {
    const { user } = useSelector((state: { persistedReducer: { userData: PropsUserDataRD } }) => {
        return state.persistedReducer.userData;
    });
    const [account, setAccount] = useState<{ userName: string; password: string }>({ userName: '', password: '' });
    const [err, setErr] = useState<{ userName: boolean; password: boolean }>({ userName: false, password: false });
    const [generate, setGenerate] = useState<number | undefined>();
    console.log(cate, 'cate');

    const { data, refetch } = useQuery({
        queryKey: ['Candidates', 1],
        queryFn: async () => {
            const rs: DataType[] = await candidateAPI.get(user?.id);
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
                    <Space size="middle" key={record.id}>
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
                    </Space>
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
        <Div css="overflow-x: overlay;">
            <Table style={{ width: '85%', overflow: 'overlay' }} columns={columns} dataSource={data} />
        </Div>
    );
};

export default ReCandidate;
