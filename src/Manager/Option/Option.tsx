import React, { useEffect, useState } from 'react';
import styles from './option.module.scss';
import { ActiveI, AddI, LoadingI, MinusI, OnlineI } from '../../assets/Icons/Icons';
import { useQuery } from '@tanstack/react-query';
import cateParts from '../../API/catePartsAPI/catePartsAPI';
import catePartsAPI from '../../API/catePartsAPI/catePartsAPI';
import { useSelector } from 'react-redux';
import { PropsUserDataRD } from '../../redux/userData';
import occupationAPI from '../../API/occupationAPI/occupationAPI';
import { Div, DivLoading, P } from '../../styleComponent/styleComponent';
export interface PropsOccupationData {
    Id: string;
    userId: string;
    Name: string;
    Active: boolean;
    createdAt: string;
    updatedAt: string;
    Cates: {
        $id: string;
        $values: {
            $id: string;
            CreatedAt: string;
            Id: string;
            Name: string;
            OccupationId: string;
            TimeOut: number;
            TimeType: string;
            UpdatedAt: string;
        }[];
    };
}
const Option: React.FC<{
    setResult: React.Dispatch<
        React.SetStateAction<
            | {
                  $id: string;
                  CreatedAt: string;
                  Id: string;
                  Name: string;
                  OccupationId: string;
                  TimeOut: number;
                  TimeType: string;
                  UpdatedAt: string;
              }
            | undefined
        >
    >;
    reChange:
        | {
              id: string;
              name: string;
              val: number | string;
          }[]
        | undefined;
    result:
        | {
              $id: string;
              CreatedAt: string;
              Id: string;
              Name: string;
              OccupationId: string;
              TimeOut: number;
              TimeType: string;
              UpdatedAt: string;
          }
        | undefined;
    setCateJob: React.Dispatch<
        React.SetStateAction<
            | {
                  id: string;
                  name: string;
                  jobName?: string;
              }
            | undefined
        >
    >;
    catePart:
        | {
              id: string;
              name: string;
          }
        | undefined;
}> = ({ setResult, reChange, result, setCateJob, catePart }) => {
    const { user } = useSelector((state: { persistedReducer: { userData: PropsUserDataRD } }) => {
        return state.persistedReducer.userData;
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [jobShow, setJobShow] = useState<string>(''); // TO show the Job
    const [showQues, setShowQuest] = useState<string>(''); // to show the Option
    const [addData, setAddData] = useState<string>(''); // add Job
    const [firstData, setFirstData] = useState<string>(''); // data occupation
    const [addDataCate, setAddDataCate] = useState<string>(''); // add Job
    const [cate, setCate] = useState<string>(''); // data catePart
    const [candidate, setCandidate] = useState<{
        title: string;
        position: { id: string; name: string }[];
    }>({
        title: 'Candidates',
        position: [
            { id: 'all', name: 'All candidates' },
            { id: 'register', name: 'Candidates register' },
            { id: 'success', name: 'Success candidates' },
            { id: 'failed', name: 'Failed candidates' },
        ],
    });

    const [dataQue, setDataQue] = useState<PropsOccupationData[]>([]);

    const [datas, setData] = useState<
        {
            id: string;
            title: string;
            position:
                | {
                      id: string;
                      title: string;
                      active: boolean;
                      requirements: (
                          | {
                                title: string;
                                val?: undefined;
                            }
                          | {
                                title: string;
                                val: { id: string; name: string }[];
                            }
                      )[];
                  }[];
        }[]
    >([
        {
            id: 'Jobs',
            title: 'Jobs',
            position: [],
        },
    ]);
    useEffect(() => {
        fetch();
        async function fetch() {
            const data: PropsOccupationData[] = await occupationAPI.getOccupation(user?.id);
            if (data) {
                let items: any = [];
                if (data?.length) {
                    // reFix data option
                    data.forEach((d) => {
                        items = datas.map((dd) => {
                            if (dd.title === 'Jobs') {
                                dd.position.push({
                                    id: d.Id,
                                    title: d.Name,
                                    active: d.Active,
                                    requirements: [
                                        { title: 'Information' },
                                        {
                                            title: 'Question',
                                            val: d.Cates?.$values.map((c) => {
                                                // get Id catePart
                                                return { id: c.Id, name: c.Name };
                                            }),
                                        },
                                    ],
                                });
                                return dd;
                            }
                        });
                    });
                }
                if (data) setDataQue(data);
                setData(items);
            }
        }
    }, []);
    useEffect(() => {
        if (reChange) {
            const newPre = datas.map((d) => {
                d.position.map((p) => {
                    p.requirements.map((r) => {
                        r.val?.map((q) => {
                            reChange.forEach((re) => {
                                if (
                                    typeof re.val === 'string' &&
                                    re.id === q.id &&
                                    re.name === 'name' &&
                                    re.val !== q.name
                                ) {
                                    // the field name will change when update name
                                    q.name = re.val;
                                }
                            });

                            return q;
                        });
                        return r;
                    });
                    return p;
                });
                return d;
            });
            const asd = dataQue.map((d) => {
                d.Cates.$values.map((c) => {
                    reChange.forEach((re) => {
                        if (
                            typeof re.val === 'number' &&
                            re.id === c.Id &&
                            re.name === 'timeOut' &&
                            re.val !== c.TimeOut
                        ) {
                            c.TimeOut = re.val;
                        }
                        if (
                            typeof re.val === 'string' &&
                            re.id === c.Id &&
                            re.name === 'timeType' &&
                            re.val !== c.TimeType
                        ) {
                            c.TimeType = re.val;
                        }
                    });
                    return c;
                });
                return d;
            });
            setDataQue([...asd]);
            setData([...newPre]);
        }
    }, [reChange]);
    const handleAdd = async (title: string) => {
        // Occupation
        setLoading(true);
        if (user?.id && firstData) {
            const res = await occupationAPI.addOccupation(user.id, firstData);
            console.log(res, 'res addnew');

            if (res?.id && title === 'Jobs' && firstData) {
                setData((pre) =>
                    pre.map((t) => {
                        if (t.title === title && typeof t.position === 'object') {
                            // check Does it already exist or not?
                            let check = false;
                            t.position.map((p) => {
                                if (p.title === firstData) check = true;
                            });
                            if (!check)
                                t.position.push({
                                    id: res.id,
                                    title: firstData,
                                    active: false,
                                    requirements: [
                                        { title: 'Information' },
                                        {
                                            title: 'Question',
                                            val: [
                                                { id: res.id_f, name: res.name_f },
                                                { id: res.id_s, name: res.name_s },
                                                { id: res.id_t, name: res.name_t },
                                            ],
                                        },
                                    ],
                                });
                        }
                        return t;
                    }),
                );
            }
            setFirstData('');
            setLoading(false);
        }
    };
    const handleAddCatePart = async (id: string) => {
        setLoading(true);
        if (id && cate) {
            const res = await catePartsAPI.addCatePart(id, cate);
            if (res?.id) {
                setData((pre) =>
                    pre.map((t) => {
                        // check Does it already exist or not?
                        t.position.map((p) => {
                            if (!(p.id === res.id || p.title === cate)) {
                                return p.requirements.map((req) => {
                                    if (req.title === 'Question') {
                                        req.val?.push({ id: res.id, name: cate });
                                        return req;
                                    }
                                });
                            }
                            return p;
                        });

                        return t;
                    }),
                );
                setCate('');
                setLoading(false);
            }
        }
    };
    // if (p.title === jobShow) {
    //   console.log("t.position", t.position);

    //   p.requirements.map((r) => {
    //     console.log("p.requirements", p.requirements);
    //     if (r.title === addDataCate) {
    //       r.val?.push({ id: res.id, name: cate });
    //     }
    //     return r;
    //   });
    //   return p;
    // }
    const handleDeleteCate = async (id: string, occupationId: string, name: string) => {
        const ok = window?.confirm(`Do you wanna delete ${name}?`);
        if (ok) {
            const res = await catePartsAPI.delete(id, occupationId);
            if (res?.id) {
                setData((pre) =>
                    pre.filter((j) =>
                        j.position.map((p) =>
                            p.requirements.map((q) => {
                                if (q.val?.length) {
                                    const s = q.val.filter((c) => c.id !== res.id);
                                    q.val = s;
                                    return q;
                                }
                                return q;
                            }),
                        ),
                    ),
                );
            }
            console.log(res, 'deleted res');
        }
    };
    const handleRemove = async (id: string, name: string) => {
        const ok = window?.confirm(`Do you wanna delete ${name}?`);
        if (ok) {
            const res = await occupationAPI.delete(id);
            if (res?.id) {
                setData((pre) =>
                    pre.map((j) => {
                        j.position = j.position.filter((p) => p.id !== res.id);
                        return j;
                    }),
                );
            }
            console.log(res, 'res delete job');
        }
    };
    const handleActive = async (id: string, active: boolean) => {
        const ok = window.confirm(`Are you sure you want to ${active ? 'private' : 'public'} this job?`);
        if (ok && user?.id && id) {
            const res = await occupationAPI.active(id, user.id);
            if (res.status) {
                const newDD = datas.map((p) => {
                    p.position.map((po) => {
                        if (po.id === id) {
                            po.active = res.active;
                        }
                        return po;
                    });
                    return p;
                });
                setData(newDD);
            }
        }
    };
    return (
        <>
            {datas.map((op) => (
                <div className={styles.question} key={op.title}>
                    <h4>
                        {op.title}
                        {op.title === 'Jobs' && (
                            <span
                                style={{
                                    fontSize: '1.6rem',
                                    cursor: 'var(--pointer)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '5px',
                                }}
                                onClick={() => setAddData((pre) => (pre === op.title ? '' : op.title))}
                            >
                                {addData === op.title ? <MinusI /> : <AddI />}
                            </span>
                        )}
                    </h4>
                    {op.position.map((po) => {
                        return (
                            <div
                                className={styles.itemPosition}
                                key={po.title}
                                style={{
                                    borderBottom: jobShow === po.title ? '1px solid #999999' : '',
                                    marginBottom: jobShow === po.title ? '7px' : '',
                                    paddingBottom: jobShow === po.title ? '5px' : '',
                                }}
                            >
                                <div
                                    className={styles.addTitle}
                                    style={{
                                        borderBottom: jobShow === po.title ? '1px solid #999999' : '',
                                        color: jobShow === po.title ? '#9ef3f7' : '',
                                    }}
                                    onClick={() => {
                                        setJobShow((pre) => (pre === po.title ? '' : po.title));
                                        setAddData('');
                                    }}
                                >
                                    {po.title}
                                    <Div width="auto">
                                        <Div
                                            width="auto"
                                            css={`
                                                font-size: 19px;
                                                color: ${po.active ? '#87ed7c' : '#f74747'};
                                                padding: 3px 7px;
                                                &:hover {
                                                    color: ${po.active ? '#f74747' : '#87ed7c'};
                                                    font-size: 22px;
                                                }
                                            `}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleActive(po.id, po.active);
                                            }}
                                        >
                                            <ActiveI />
                                        </Div>
                                        <Div
                                            width="auto"
                                            css={`
                                                padding: 3px 7px;
                                                &:hover {
                                                    color: #9ef3f7;
                                                    font-size: 20px;
                                                }
                                            `}
                                            onClick={(e) => {
                                                // delete Job
                                                e.stopPropagation();
                                                handleRemove(po.id, po.title);
                                            }}
                                        >
                                            <MinusI />
                                        </Div>
                                    </Div>
                                </div>
                                {jobShow === po.title && (
                                    <>
                                        {po.requirements.map((qs) => (
                                            <div className={styles.questionIn} key={qs.title}>
                                                <div
                                                    className={styles.addTitle}
                                                    style={{
                                                        borderBottom:
                                                            showQues === po.title + qs.title ? '1px solid #999999' : '',
                                                    }}
                                                >
                                                    <p
                                                        style={{
                                                            color: showQues === po.title + qs.title ? '#9ef3f7' : '',
                                                        }}
                                                        className={styles.itemPositionIn}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setCateJob({
                                                                id: po.id,
                                                                name: qs.title,
                                                                jobName: po.title,
                                                            });
                                                            setShowQuest((pre) =>
                                                                pre === po.title + qs.title ? '' : po.title + qs.title,
                                                            );
                                                            dataQue?.forEach((d) => {
                                                                d.Cates.$values.forEach((c) => {
                                                                    if (
                                                                        qs?.val &&
                                                                        c.Id === qs.val[0].id &&
                                                                        JSON.stringify(c) !== JSON.stringify(result)
                                                                    ) {
                                                                        setResult(c);
                                                                    }
                                                                });
                                                            });
                                                        }}
                                                    >
                                                        {qs.title}
                                                    </p>

                                                    {showQues === po.title + qs.title && qs.title === 'Question' && (
                                                        <span
                                                            style={{
                                                                fontSize: '1.6rem',
                                                                cursor: 'var(--pointer)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                padding: '5px',
                                                            }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setAddDataCate((pre) =>
                                                                    pre === qs.title ? '' : qs.title,
                                                                );
                                                            }}
                                                        >
                                                            {addDataCate === qs.title ? <MinusI /> : <AddI />}
                                                        </span>
                                                    )}
                                                </div>
                                                {showQues === po.title + qs.title &&
                                                    qs.val &&
                                                    qs.val.map((v) => (
                                                        <Div
                                                            key={v.id}
                                                            onClick={(e) => e.stopPropagation()}
                                                            justify="left"
                                                            css={`
                                                                padding-left: 20px;
                                                                justify-content: space-between;
                                                                p {
                                                                    color: ${result?.Id === v.id ? '#9ef3f7' : ''};
                                                                }
                                                            `}
                                                        >
                                                            <p
                                                                className={styles.itemPositionIn}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    dataQue?.forEach((d) => {
                                                                        d.Cates.$values.forEach((c) => {
                                                                            if (
                                                                                c.Id === v.id &&
                                                                                JSON.stringify(c) !==
                                                                                    JSON.stringify(result)
                                                                            ) {
                                                                                setResult(c);
                                                                            }
                                                                        });
                                                                    });
                                                                }}
                                                            >
                                                                {v.name}
                                                            </p>
                                                            <Div
                                                                width="auto"
                                                                css={`
                                                                    padding: 3px 7px;
                                                                    &:hover {
                                                                        color: #9ef3f7;
                                                                        font-size: 20px;
                                                                    }
                                                                `}
                                                                onClick={() => handleDeleteCate(v.id, po.id, v.name)}
                                                            >
                                                                <MinusI />
                                                            </Div>
                                                        </Div>
                                                    ))}
                                                {addDataCate === qs.title && (
                                                    <div className={styles.divAdd}>
                                                        <input
                                                            type="text"
                                                            placeholder={qs.title}
                                                            value={cate}
                                                            onChange={(e) => setCate(e.target.value)}
                                                        />
                                                        <button onClick={() => handleAddCatePart(po.id)}>
                                                            {loading ? (
                                                                <DivLoading css="margin: 0;">
                                                                    <LoadingI />
                                                                </DivLoading>
                                                            ) : (
                                                                'Add'
                                                            )}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        );
                    })}
                    {addData === op.title && (
                        <div className={styles.divAdd}>
                            <input
                                type="text"
                                placeholder={op.title}
                                value={firstData}
                                onChange={(e) => setFirstData(e.target.value)}
                            />
                            <button onClick={() => handleAdd(op.title)}>
                                {loading ? (
                                    <DivLoading css="margin: 0;">
                                        <LoadingI />
                                    </DivLoading>
                                ) : (
                                    'Add'
                                )}
                            </button>
                        </div>
                    )}
                </div>
            ))}
            <div className={styles.question} style={{ textAlign: 'start' }}>
                <h4>{candidate.title}</h4>
                {candidate.position.map((po) => {
                    return (
                        <P
                            className={styles.itemPosition}
                            key={po.id}
                            css={`
                                color: ${po.name === catePart?.id ? '#9ef3f7' : ''};
                            `}
                            onClick={() => setCateJob({ id: po.name, name: 'candidate' })}
                        >
                            {po.name}
                        </P>
                    );
                })}
            </div>
        </>
    );
};

export default Option;
