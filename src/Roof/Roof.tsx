import React, { useEffect, useRef, useState } from 'react';
import {
    AppstoreOutlined,
    ContainerOutlined,
    DesktopOutlined,
    MailOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PieChartOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Menu, Select, Skeleton, Tag } from 'antd';
import { Div, P } from '../styleComponent/styleComponent';
import { UserI } from '../assets/Icons/Icons';
import { Avatar, List, Radio, Space } from 'antd';
import Images from '../assets/images';
import { Checkbox, Divider } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import candidateAPI from '../API/candidateAPI/candidateAPI';
import TextArea from 'antd/es/input/TextArea';
import userAPI from '../API/userAPI/userAPI';

const CheckboxGroup = Checkbox.Group;

const plainOptions = ['Apple', 'Pear', 'Orange'];
const defaultCheckedList = ['Apple', 'Orange'];
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

const items: MenuItem[] = [getItem('User', 'user', <UserI />), getItem('Admin', 'admin', <UserI />)];
export interface DataType {
    gender?: boolean;
    id: string;
    name: string;
    role?: {
        description: string;
        id: string;
        name: string;
        permissions: string;
    };
    email?: string;
    nat?: string;
    loading: boolean;
}

const count = 3;

const Roof: React.FC<{
    user: {
        id: string;
        avatar: any;
        name: string;
        roleId: string;
        gender: boolean;
        createdAt: string;
        updatedAt: string;
        roles: {
            description: string;
            id: string;
            name: string;
            permissions: string;
        };
    };
    dataRR: React.MutableRefObject<string>; // string because it is always changed one of unusual way
}> = ({ user, dataRR }) => {
    const [collapsed, setCollapsed] = useState<string>('user');
    const [initLoading, setInitLoading] = useState(true);
    const [update, setUpdate] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<DataType[]>([]);
    const [list, setList] = useState<DataType[]>([]);
    const offset = useRef<number>(0);
    const limit = 3;
    const fakeDataUrl = `${process.env.REACT_APP_NEGA}/User/ListingInfoAdmin/${user.id}/${offset.current}/${limit}/${collapsed}`;
    const [checkedList, setCheckedList] = useState<{ id: string; val: string[] }[]>([]);

    const onChange = (listA: any, id: string) => {
        const name = listA.target.name;
        console.log(name, 'name');

        const newL = list.map((l) => {
            if (l.id === id) {
                if (l.role?.permissions) {
                    if (JSON.parse(l.role?.permissions).includes(name)) {
                        l.role.permissions = JSON.stringify(
                            JSON.parse(l.role?.permissions).filter((per: string) => per !== name),
                        );
                    } else {
                        const dd = JSON.parse(l.role?.permissions);
                        dd.push(name);
                        l.role.permissions = JSON.stringify(dd);
                    }
                }
            }
            return l;
        });
        setList(newL);
    };
    console.log(checkedList);

    const onSave = async () => {
        if (update) {
            setLoading(true);
            const that = list.filter((l) => l.id === update);
            const is = JSON.parse(dataRR.current).filter((d: any) => d.id === update);
            let rt: { name?: string; description?: string; permissions?: string } = {};
            if (that[0].role?.permissions !== is[0].role?.permissions) {
                rt.permissions = that[0].role?.permissions;
            }
            if (that[0].role?.name !== is[0].role?.name) {
                rt.name = that[0].role?.name;
            }
            if (that[0].role?.description !== is[0].role?.description) {
                rt.description = that[0].role?.description;
            }
            if (
                (that.length && that[0].role?.permissions !== is[0].role?.permissions) ||
                that[0].role?.name !== is[0].role?.name ||
                that[0].role?.description !== is[0].role?.description
            ) {
                if (that[0].role) {
                    const res = await userAPI.setRule(user.id, update, rt.name, rt.description, rt.permissions);
                    if (res) {
                        dataRR.current = JSON.stringify(list);
                        setUpdate('');
                    }
                }
            }
            setLoading(false);
        }
    };
    const handleDescription = (e: any) => {
        if (list) {
            const newL = list.map((l) => {
                if (l.id === update && l.role) {
                    l.role.description = e.target.value;
                }
                return l;
            });
            setList(newL);
        }
    };
    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
        if (list) {
            const newL = list.map((l) => {
                if (l.id === update && l.role) {
                    l.role.name = value;
                }
                return l;
            });
            setList(newL);
        }
    };

    useEffect(() => {
        fetch(fakeDataUrl)
            .then((res) => res.json())
            .then((res) => {
                offset.current += limit;
                console.log(res, 'res');
                dataRR.current = JSON.stringify(res);
                setInitLoading(false);
                setData(res.results);
                setList(res.results);
            });
    }, [collapsed]);

    useEffect(() => {
        if (dataRR.current) {
            setData(JSON.parse(dataRR.current));
            setList(JSON.parse(dataRR.current));
        }
    }, [dataRR.current]);

    const onLoadMore = () => {
        setLoading(true);
        setList(data.concat([...new Array(count)].map(() => ({ loading: true, name: '', id: '', email: '' }))));
        fetch(fakeDataUrl)
            .then((res) => res.json())
            .then((res) => {
                console.log(res, 'res more');
                if (!res.length) {
                    const newL = list.filter((l) => l.id);
                    setList(newL);
                } else {
                    offset.current += limit;
                    const newData = data.concat(res);
                    dataRR.current = JSON.stringify(newData);
                    // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
                    // In real scene, you can using public method of react-virtualized:
                    // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
                    window.dispatchEvent(new Event('resize'));
                }
                setLoading(false);
            });
    };

    const loadMore =
        list?.length && !initLoading && !loading ? (
            <div
                style={{
                    textAlign: 'center',
                    marginTop: 12,
                    height: 32,
                    lineHeight: '32px',
                }}
            >
                <Button onClick={onLoadMore}>loading more</Button>
            </div>
        ) : null;
    console.log(list, dataRR, 'list');

    return (
        <Div
            css={`
                height: 92%;
            `}
        >
            <Div
                wrap="wrap"
                style={{ width: 256 }}
                css={`
                    height: 100%;
                `}
            >
                {/* <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </Button> */}
                <Menu
                    style={{ height: '100%', paddingTop: '20px' }}
                    defaultSelectedKeys={['user']}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                    theme="dark"
                    onClick={(e) => {
                        offset.current = 0;
                        setCollapsed(e.key);
                    }}
                    items={items}
                />
            </Div>
            <Div css="padding: 20px; height: 100%; overflow-y: overlay">
                <>
                    <List
                        style={{ width: '100%', textAlign: 'left', height: '100%' }}
                        className="demo-loadmore-list"
                        loading={initLoading}
                        itemLayout="horizontal"
                        loadMore={loadMore}
                        dataSource={list}
                        renderItem={(item) => (
                            <List.Item
                                actions={[
                                    update === item.id ? (
                                        <Button
                                            loading={loading}
                                            type="primary"
                                            key="list-loadmore-edit"
                                            onClick={onSave}
                                        >
                                            Save
                                        </Button>
                                    ) : (
                                        []
                                    ),
                                    <Button
                                        danger={update === item.id ? true : false}
                                        type="primary"
                                        key="list-loadmore-edit"
                                        onClick={() => {
                                            if (update === item.id) {
                                                setUpdate('');
                                                const oldData = list.map((l) => {
                                                    if (l.id === item.id) {
                                                        l = JSON.parse(dataRR.current).filter(
                                                            (r: any) => r.id === item.id,
                                                        )[0];
                                                    }
                                                    return l;
                                                });
                                                if (dataRR.current) setList(oldData);
                                            } else {
                                                setUpdate(item.id);
                                            }
                                        }}
                                    >
                                        {update === item.id ? 'Cancel' : 'Edit'}
                                    </Button>,
                                    <Button danger key="list-loadmore-more">
                                        Delete
                                    </Button>,
                                ]}
                            >
                                <Skeleton avatar title={false} loading={item.loading} active>
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.gender ? Images.female : Images.male} />}
                                        title={<a href="https://ant.design">{item.name}</a>}
                                        description={
                                            <Div
                                                wrap="wrap"
                                                css={`
                                                    strong {
                                                        color: #333;
                                                        margin-right: 5px;
                                                    }
                                                    div {
                                                        justify-content: left;
                                                    }
                                                `}
                                            >
                                                <Div>
                                                    <strong>Role: </strong>{' '}
                                                    {update === item.id ? (
                                                        <Space wrap>
                                                            <Select
                                                                defaultValue="Role"
                                                                style={{ width: 120 }}
                                                                onChange={handleChange}
                                                                options={[
                                                                    { value: 'admin', label: 'Admin' },
                                                                    { value: 'user', label: 'User' },
                                                                    {
                                                                        value: 'roof',
                                                                        label: 'Roof',
                                                                        disabled: true,
                                                                    },
                                                                ]}
                                                            />{' '}
                                                        </Space>
                                                    ) : (
                                                        <P size="1.4rem"> {item.role?.name}</P>
                                                    )}
                                                </Div>
                                                <Div>
                                                    <strong>Description: </strong>{' '}
                                                    {update === item.id ? (
                                                        <TextArea
                                                            style={{ margin: '8px 0px' }}
                                                            placeholder="Description"
                                                            onChange={handleDescription}
                                                        />
                                                    ) : (
                                                        <P size="1.4rem"> {item.role?.description}</P>
                                                    )}
                                                </Div>
                                                <Div wrap="wrap">
                                                    <Div>
                                                        <strong>Action: </strong>
                                                        {['create', 'read', 'update', 'delete'].map(
                                                            (p: string, index: number) => (
                                                                <Div
                                                                    width="auto"
                                                                    wrap="wrap"
                                                                    display="block"
                                                                    key={p}
                                                                    css={`
                                                                        margin-right: 5px;
                                                                        font-size: 1.4rem;
                                                                    `}
                                                                >
                                                                    {
                                                                        [
                                                                            <Tag
                                                                                color={
                                                                                    item.role?.permissions.includes(p)
                                                                                        ? 'green'
                                                                                        : 'default'
                                                                                }
                                                                                style={
                                                                                    !item.role?.permissions.includes(p)
                                                                                        ? { cursor: 'no-drop' }
                                                                                        : {}
                                                                                }
                                                                            >
                                                                                {p}
                                                                            </Tag>,
                                                                            <Tag
                                                                                color={
                                                                                    item.role?.permissions.includes(p)
                                                                                        ? 'magenta'
                                                                                        : 'default'
                                                                                }
                                                                                style={
                                                                                    !item.role?.permissions.includes(p)
                                                                                        ? { cursor: 'no-drop' }
                                                                                        : {}
                                                                                }
                                                                            >
                                                                                {p}
                                                                            </Tag>,
                                                                            <Tag
                                                                                color={
                                                                                    item.role?.permissions.includes(p)
                                                                                        ? 'purple'
                                                                                        : 'default'
                                                                                }
                                                                                style={
                                                                                    !item.role?.permissions.includes(p)
                                                                                        ? { cursor: 'no-drop' }
                                                                                        : {}
                                                                                }
                                                                            >
                                                                                {p}
                                                                            </Tag>,
                                                                            <Tag
                                                                                color={
                                                                                    item.role?.permissions.includes(p)
                                                                                        ? 'red'
                                                                                        : 'default'
                                                                                }
                                                                                style={
                                                                                    !item.role?.permissions.includes(p)
                                                                                        ? { cursor: 'no-drop' }
                                                                                        : {}
                                                                                }
                                                                            >
                                                                                {p}
                                                                            </Tag>,
                                                                        ][index]
                                                                    }
                                                                    {update === item.id && (
                                                                        <Div width="auto">
                                                                            <Checkbox
                                                                                onChange={(e) => onChange(e, item.id)}
                                                                                name={p}
                                                                                checked={
                                                                                    item.role?.permissions &&
                                                                                    JSON.parse(
                                                                                        item.role?.permissions,
                                                                                    ).includes(p)
                                                                                }
                                                                            ></Checkbox>
                                                                        </Div>
                                                                    )}
                                                                </Div>
                                                            ),
                                                        )}
                                                    </Div>
                                                </Div>
                                            </Div>
                                        }
                                    />
                                </Skeleton>
                            </List.Item>
                        )}
                    />
                </>
            </Div>
        </Div>
    );
};

export default Roof;
