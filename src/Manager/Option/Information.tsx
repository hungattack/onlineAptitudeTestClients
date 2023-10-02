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
    const [dataF, setData] = useState<{ title: string; intro: string }[]>([]);
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
        user.occupationId = cate.id;
        const res = await occupationAPI.addInfo(cate.id, JSON.stringify([...(data ?? []), { ...user }]));
        if (res === 'ok') {
            toast('Add Information successful');
            refetch();
        }
        console.log(user);
    };
    const handleDelete = async (id: number) => {
        const del = window.confirm('Do you want to delete this item');
        if (del && data) {
            const newD = data.filter((fo, index) => index + 1 !== id);
            const res = await occupationAPI.addInfo(cate.id, JSON.stringify(newD));
            if (res === 'ok') {
                toast('Add Infomation successful');
                refetch();
            }
        }
    };
    console.log(name, 'name');

    return (
        <Div
            display="block"
            css={`
                overflow-y: overlay;
                height: 100%;
                padding: 10px;
                .demo-loadmore-list {
                    background-color: #dadada;
                    border-radius: 5px;
                    margin: 10px 0;
                }
            `}
        >
            <H3 css="width: 100%; margin-bottom: 50px;">Information</H3>
            <List
                className="demo-loadmore-list"
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item, index) => (
                    <>
                        <Div css="position: relative; background-color: #fff;">
                            <H3>{index + 1}</H3>
                            <Div
                                width="auto"
                                css="position: absolute; top: 2px; right: 10px; font-size: 20px; cursor: var(--pointer)"
                                onClick={() => handleDelete(index + 1)}
                            >
                                <MinusI />
                            </Div>
                        </Div>
                        <List.Item>
                            <Skeleton title={false} loading={isLoading} active>
                                <List.Item.Meta title={<P>Position</P>} description={item.position} />
                            </Skeleton>
                        </List.Item>
                        <List.Item>
                            <Skeleton title={false} loading={isLoading} active>
                                <List.Item.Meta title={<P>Address</P>} description={item.address} />
                            </Skeleton>
                        </List.Item>
                        <List.Item>
                            <Skeleton title={false} loading={isLoading} active>
                                <List.Item.Meta title={<P>Company</P>} description={item.company} />
                            </Skeleton>
                        </List.Item>
                        <List.Item>
                            <Skeleton title={false} loading={isLoading} active>
                                <List.Item.Meta title={<P>{item.name}</P>} description={item.contact} />
                            </Skeleton>
                        </List.Item>
                        <List.Item>
                            <Skeleton avatar title={false} loading={isLoading} active>
                                <List.Item.Meta title={<P>Introduction</P>} description={item.introduction} />
                            </Skeleton>
                        </List.Item>
                        <List.Item>
                            <Skeleton avatar title={false} loading={isLoading} active>
                                <List.Item.Meta title={<P>Requirement</P>} description={item.requirement} />
                            </Skeleton>
                        </List.Item>
                    </>
                )}
            />
            <Div>
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
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Div>
        </Div>
    );
};

export default Information;
