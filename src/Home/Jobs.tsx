import React, { useState } from 'react';
import { Buttons, Div, H3, P } from '../styleComponent/styleComponent';
import { Image } from 'antd';
import Images from '../assets/images';
import { Form, Input, Button } from 'antd';
import type { FormItemProps } from 'antd';
import candidateAPI from '../API/candidateAPI/candidateAPI';
import { PropsUserDataRD } from '../redux/userData';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import occupationAPI from '../API/occupationAPI/occupationAPI';
const Jobs = () => {
    const user = useSelector((state: { persistedReducer: { userData: PropsUserDataRD } }) => {
        return state.persistedReducer.userData.user;
    });
    const [objectFit, setObjectFit] = useState<string>('');
    const [apply, setApply] = useState<string>('');
    const MyFormItemContext = React.createContext<(string | number)[]>([]);

    interface MyFormItemGroupProps {
        prefix: string | number | (string | number)[];
        children: React.ReactNode;
    }

    function toArr(str: string | number | (string | number)[]): (string | number)[] {
        return Array.isArray(str) ? str : [str];
    }

    const MyFormItemGroup = ({ prefix, children }: MyFormItemGroupProps) => {
        const prefixPath = React.useContext(MyFormItemContext);
        const concatPath = React.useMemo(() => [...prefixPath, ...toArr(prefix)], [prefixPath, prefix]);

        return <MyFormItemContext.Provider value={concatPath}>{children}</MyFormItemContext.Provider>;
    };

    const MyFormItem = ({ name, ...props }: FormItemProps) => {
        const prefixPath = React.useContext(MyFormItemContext);
        const concatName = name !== undefined ? [...prefixPath, ...toArr(name)] : undefined;

        return <Form.Item name={concatName} {...props} />;
    };

    const { data } = useQuery({
        queryKey: ['JobApplying', 1],
        queryFn: async () => {
            const result: {
                createdAt: string;
                id: string;
                info: string;
                name: string;
                updatedAt: string;
                user: { id: string; gender: boolean; name: string };
                userId: string;
            }[] = await occupationAPI.getInfoListing();
            return result;
        },
    });
    const onFinish = async (value: {
        user: {
            BirthDay: string;
            Education: string;
            Email: string;
            Experience: string;
            Name: string;
            PhoneNumber: string;
        };
    }) => {
        if (
            user?.id &&
            apply &&
            data?.length &&
            value.user.Name &&
            value.user.Email &&
            value.user.Education &&
            value.user.Experience &&
            value.user.PhoneNumber &&
            value.user.BirthDay
        ) {
            const res: string = await candidateAPI.add({
                userId: user.id,
                managerId: apply,
                occupationId: data[0].id,
                Name: value.user.Name,
                Email: value.user.Email,
                PhoneNumber: value.user.PhoneNumber,
                Experience: value.user.Experience,
                Education: value.user.Education,
                BirthDay: value.user.BirthDay,
            });
            toast(res);
            console.log(value, res);
        }
    };
    return (
        <Div wrap="wrap" css="padding-left: 7px; height: 100%; color: #313131;">
            <H3>Jobs</H3>
            {apply && (
                <Div
                    css={`
                        height: 100%;
                        position: fixed;
                        top: 0;
                        left: 0;
                        background-color: #2d2d2dd6;
                        z-index: 1;
                        form {
                            width: 400px;
                            padding: 10px;
                            background-color: white;
                            border-radius: 5px;
                        }
                    `}
                    onClick={() => setApply('')}
                >
                    <Form
                        name="form_item_path"
                        layout="vertical"
                        onFinish={onFinish}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <H3>Candidate form</H3>
                        <MyFormItemGroup prefix={['user']}>
                            <MyFormItem name="Name" label="First Name">
                                <Input required />
                            </MyFormItem>
                            <MyFormItem name="BirthDay" label="BirthDay">
                                <Input required />
                            </MyFormItem>
                            <MyFormItem name="Education" label="Education">
                                <Input required />
                            </MyFormItem>
                            <MyFormItem name="Experience" label="Experience">
                                <Input required />
                            </MyFormItem>{' '}
                            <MyFormItem name="Address" label="Address">
                                <Input required />
                            </MyFormItem>
                            <MyFormItem name="Email" label="Email">
                                <Input required />
                            </MyFormItem>
                            <MyFormItem name="PhoneNumber" label="Phone Number">
                                <Input required />
                            </MyFormItem>
                        </MyFormItemGroup>

                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form>
                </Div>
            )}
            <Div wrap="wrap" css="overflow-y: overlay; height: 95%; ">
                {objectFit && (
                    <Div
                        css="height: 100%; position: fixed; top: 59px; left: 0; background-color: #000000bd"
                        onClick={() => setObjectFit('')}
                    ></Div>
                )}
                {data?.map((o) => (
                    <Div
                        key={o.id}
                        css={`
                            margin-top: 20px;
                            padding: 5px;
                            background-color: #ffff;
                            border-radius: 5px;
                            cursor: var(--pointer);
                            &:hover {
                                background-color: #dee1e6;
                            }
                            ${objectFit === o.id
                                ? 'z-index: 1; position: absolute; top: 50%; left: 50%; right: 50%; translate: -50% -50%; width: 50%; }'
                                : ''}
                        `}
                        wrap="wrap"
                        onClick={() => setObjectFit(o.id)}
                    >
                        <Div css="position: relative;justify-content: left;">
                            <Div
                                css={`
                                    width: 40px;
                                    height: 40px;
                                    margin-right: 5px;
                                    img {
                                        object-fit: cover;
                                        height: 100% !important;
                                        border-radius: 50%;
                                    }
                                    div {
                                        width: 100%;
                                        height: 100%;
                                    }
                                `}
                            >
                                <Image src={Images.male} />
                            </Div>
                            <P size="1.4rem">{o.user.name}</P>
                            <Buttons
                                type="primary"
                                css="width: auto; position: absolute; top: 5px; right: 10px;  &:hover{background-color: #6bdfe4} font-size: 1.3rem; border-radius: 5px; padding: 4px 8px; "
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setObjectFit('');
                                    setApply('28644857-9bd2-4acc-9033-e27510d0e429');
                                }}
                            >
                                Apply
                            </Buttons>
                        </Div>
                        <Div wrap="wrap">
                            <Div justify="left">
                                <H3 size="1.4rem" css="width: fit-content; position: relative; text-align: start;">
                                    Position:
                                </H3>
                                <H3 size="1.3rem" css="width: 100%; text-align: left; padding-left: 7px">
                                    {o.name}
                                </H3>
                            </Div>{' '}
                            {o.info &&
                                JSON.parse(o.info).map((fo: any, index: number) => (
                                    <Div key={index} wrap="wrap">
                                        <Div justify="left">
                                            <H3
                                                size="1.4rem"
                                                css="width: fit-content; position: relative; text-align: start; "
                                            >
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
                                            <H3
                                                size="1.4rem"
                                                css="width: fit-content; position: relative; text-align: start;"
                                            >
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
                                            <H3
                                                size="1.4rem"
                                                css="width: max-content; position: relative; text-align: start;"
                                            >
                                                {fo.name}:
                                            </H3>
                                            <H3
                                                size="1.3rem"
                                                css="text-align: left; padding-left: 7px; width: auto; height: 20px; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;"
                                            >
                                                {fo.contact}
                                            </H3>
                                        </Div>
                                        {fo.information && (
                                            <P
                                                size="1.3rem"
                                                css={`
                                                    width: 100%;
                                                    margin-top: 5px;
                                                    text-align: start;
                                                    ${objectFit !== 'one'
                                                        ? ' overflow: hidden; height: 43px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;'
                                                        : ''}
                                                `}
                                            >
                                                <strong>Information:</strong> {fo.information}
                                            </P>
                                        )}
                                        {fo.requirement && (
                                            <P
                                                size="1.3rem"
                                                css={`
                                                    width: 100%;
                                                    margin-top: 5px;
                                                    text-align: start;
                                                    ${objectFit !== 'one'
                                                        ? ' overflow: hidden; height: 43px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;'
                                                        : ''}
                                                `}
                                            >
                                                <strong>Requirement:</strong> {fo.requirement}
                                            </P>
                                        )}
                                    </Div>
                                ))}
                        </Div>
                    </Div>
                ))}
            </Div>
        </Div>
    );
};

export default Jobs;
