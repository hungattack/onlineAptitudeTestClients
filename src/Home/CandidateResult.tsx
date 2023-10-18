import React, { useState } from 'react';
import { Div, H3 } from '../styleComponent/styleComponent';
import { Avatar } from 'antd';
import Images from '../assets/images';
import { useQuery } from '@tanstack/react-query';
import candidateAPI from '../API/candidateAPI/candidateAPI';

const CandidateResult = () => {
    const [cate, setCate] = useState<string>('new');
    const { data } = useQuery({
        queryKey: [cate, 1],
        queryFn: () => candidateAPI.getType(cate),
    });
    return (
        <Div display="block" css="padding-left: 7px; height: 100%; color: #313131;  color: #fff;">
            <H3
                css={`
                    width: 100%;
                    border: 1px solid #57d9e796;
                    border-radius: 5px;
                    box-shadow: 0 0 3px #57d9e7ba;
                `}
            >
                Candidates's results
            </H3>
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
                <H3 color={cate === 'highest' ? '#57dbe9' : ''}>Highest point</H3>{' '}
                <H3 color={cate === 'new' ? '#57dbe9' : ''}>New time</H3>
            </Div>
            <Div
                display="block"
                css={`
                    height: 90%;
                `}
            >
                There will be in future
                {/* <Div
                    wrap="wrap"
                    css={`
                        background-color: #555555;
                        border-radius: 5px;
                        padding: 10px 0;
                    `}
                >
                    <Avatar src={Images.female} />
                    <Div
                        css={`
                            h3 {
                                font-size: 1.4rem;
                            }
                        `}
                    >
                        <H3>Nguyen Hi Han</H3>
                    </Div>
                    <Div>30 / 50🎯</Div>
                </Div> */}
            </Div>
        </Div>
    );
};

export default CandidateResult;
