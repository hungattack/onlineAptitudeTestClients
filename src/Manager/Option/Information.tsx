import { Button, Form, Input, InputNumber, Card, List, Skeleton } from 'antd';
import { Div, H3, P } from '../../styleComponent/styleComponent';
import { useState } from 'react';
import styles from './option.module.scss';
import occupationAPI from '../../API/occupationAPI/occupationAPI';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { MinusI } from '../../assets/Icons/Icons';
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};
/* eslint-enable no-template-curly-in-string */

const Information: React.FC<{
    cate: {
        id: string;
        name: string;
        jobName?: string;
    };
}> = ({ cate }) => {
    const [add, setAdd] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [name, setName] = useState<string>(cate.jobName ?? '');
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['GetInfor', 1],
        queryFn: async () => {
            const d: {
                introduction: string;
                position: string;
                address: string;
                company: string;
                contact: string;
                name: string;
                requirement: string;
            }[] = await occupationAPI.getInfo(cate.id);
            return d;
        },
    });
    const onFinish = async ({
        user,
    }: {
        user: {
            occupationId: string;
            introduction: string;
            position: string;
            address: string;
            company: string;
            contact: string;
            name: string;
            requirement: string;
        };
    }) => {
        setLoading(true);
        user.occupationId = cate.id;
        const res = await occupationAPI.addInfo(cate.id, JSON.stringify([...(data ?? []), { ...user }]));
        if (res === 'ok') {
            toast('Add Information successful');
            refetch();
            setAdd(false);
        }
        setLoading(false);
    };
    const handleDelete = async (id: number) => {
        setLoading(true);
        const del = window.confirm('Do you want to delete this item');
        if (del && data) {
            const newD = data.filter((fo, index) => index + 1 !== id);
            const res = await occupationAPI.addInfo(cate.id, JSON.stringify(newD));
            if (res === 'ok') {
                toast('Add Infomation successful');
                refetch();
            }
        }
        setLoading(false);
    };
    console.log(data, 'name');

    return (
        <Div
            display="block"
            css={`
                color: #fff;
                overflow-y: overlay;
                height: 100%;
                padding: 10px;
                background-color: #282828;
                position: relative;
                .demo-loadmore-list {
                    background-color: #dadada;
                    border-radius: 5px;
                    margin: 10px 0;
                }
            `}
        >
            <H3 css="width: 100%; margin-bottom: 50px;">Information</H3>
            <Div
                wrap="wrap"
                justify="left"
                css={`
                    padding: 10px;
                    background-color: #404040;
                    border-radius: 5px;
                `}
            >
                {data?.map((fo, index: number) => (
                    <Div
                        key={index}
                        wrap="wrap"
                        width="80%"
                        css={`
                            position: relative;
                            margin: 5px;
                            padding: 20px;
                            background-color: #2f2f2f;
                            border-radius: 5px;
                        `}
                    >
                        <Div width="20px" css="height:100%">
                            {index + 1}
                        </Div>
                        <Div
                            width="auto"
                            css="position: absolute; top: 2px; right: 10px; font-size: 20px; cursor: var(--pointer)"
                            onClick={() => handleDelete(index + 1)}
                        >
                            <MinusI />
                        </Div>
                        <Div justify="left">
                            <H3 size="1.4rem" css="width: fit-content; position: relative; text-align: start; ">
                                Address:
                            </H3>
                            <H3
                                size="1.3rem"
                                css="text-align: left; padding-left: 7px; width: 100%; height: 20px; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;"
                            >
                                {fo.address}
                            </H3>
                        </Div>{' '}
                        <Div justify="left">
                            <H3 size="1.4rem" css="width: fit-content; position: relative; text-align: start;">
                                Company:
                            </H3>
                            <H3
                                size="1.3rem"
                                css="text-align: left; padding-left: 7px; width: 100%; height: 20px; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;"
                            >
                                {fo.company}
                            </H3>
                        </Div>{' '}
                        <Div justify="left" css="border-bottom: 1px solid #333;">
                            <H3 size="1.4rem" css="width: max-content; position: relative; text-align: start;">
                                {fo.name}:
                            </H3>
                            <H3
                                size="1.3rem"
                                css="text-align: left; padding-left: 7px; width: auto; height: 20px; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;"
                            >
                                {fo.contact}
                            </H3>
                        </Div>
                        {fo.introduction && (
                            <P
                                size="1.3rem"
                                css={`
                                    width: 100%;
                                    margin-top: 5px;
                                    text-align: start;
                                `}
                            >
                                <strong>introduction:</strong> {fo.introduction}
                            </P>
                        )}
                        {fo.requirement && (
                            <P
                                size="1.3rem"
                                css={`
                                    width: 100%;
                                    margin-top: 5px;
                                    text-align: start;
                                `}
                            >
                                <strong>Requirement:</strong> {fo.requirement}
                            </P>
                        )}
                    </Div>
                ))}
            </Div>
            {add && (
                <Div
                    css={`
                        position: absolute;
                        top: 0;
                        left: 0;
                        height: 100%;
                        background-color: #1a1a1abd;
                    `}
                    onClick={() => setAdd(false)}
                >
                    <Div
                        wrap="wrap"
                        width="80%"
                        css={`
                            background-color: white;
                            padding: 17px;
                            border-radius: 5px;
                        `}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <H3 css="width: 100%; margin-bottom: 10px; color: #333; ">Add New Information</H3>
                        <Form
                            {...layout}
                            name="nest-messages"
                            onFinish={onFinish}
                            style={{ width: '90%' }}
                            validateMessages={validateMessages}
                            initialValues={{
                                user: {
                                    position: name, // Set the initial value for the 'position' field
                                },
                            }}
                        >
                            <Form.Item name={['user', 'position']} label="Position" required>
                                <Input type="text" placeholder="Position" required />
                            </Form.Item>
                            <Form.Item name={['user', 'address']} label="Address" required>
                                <Input type="text" placeholder="Address" required />
                            </Form.Item>
                            <Form.Item name={['user', 'company']} label="Company" required>
                                <Input type="text" placeholder="Company" required />
                            </Form.Item>{' '}
                            <Form.Item name={['user', 'contact']} label="Contact" required>
                                <Form.Item name={['user', 'name']} label="Name" required>
                                    <Input type="text" placeholder="Name" required />
                                </Form.Item>
                                <Form.Item name={['user', 'contact']} label="Contact" required>
                                    <Input type="text" placeholder="Contact" required />
                                </Form.Item>
                            </Form.Item>
                            <Form.Item name={['user', 'introduction']} label="Introduction" required>
                                <Input.TextArea placeholder="Introduction" required />
                            </Form.Item>
                            <Form.Item name={['user', 'requirement']} label="Requirement" required>
                                <Input.TextArea placeholder="Requirement" required />
                            </Form.Item>
                            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 2 }}>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </Div>
                </Div>
            )}
            <Div width="auto" css="position: absolute; top: 10px; right: 20px;" onClick={() => setAdd(true)}>
                <Button type="primary">Add New</Button>
            </Div>
        </Div>
    );
};

export default Information;
