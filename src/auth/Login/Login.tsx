'use client';
import React, { useState } from 'react';
import styles from './login.module.scss';
import { useDispatch } from 'react-redux';
import { login, setUser } from '../../redux/userData';
import authAPI from '../../API/authAPI/authAPI';
import { Div, P } from '../../styleComponent/styleComponent';
import { CloseI, EyedI, EyemI } from '../../assets/Icons/Icons';
const Login = () => {
    const dispatch = useDispatch();
    const [value, setValue] = useState<{ Email: string; Password: string }>({
        Email: '',
        Password: '',
    });
    const [err, setErr] = useState<{ Email: boolean; Password: boolean }>({
        Email: false,
        Password: false,
    });
    const [eye, setEye] = useState<boolean>(true);
    const [er, setEr] = useState<string>('');
    const handleLogin = async () => {
        let check = false;
        if (!value.Email) {
            check = true;
            setErr({ ...err, Email: true });
        }
        if (!value.Password) {
            setErr({ ...err, Password: true });
            check = true;
        }
        if (!check) {
            const res = await authAPI.Login({ ...value });
            if (res?.id) {
                dispatch(setUser(res));
                dispatch(login(''));
            } else {
                setEr(res);
            }
        }
    };
    return (
        <div className={styles.login} onClick={() => dispatch(login(''))}>
            <div className={styles.frame} onClick={(e) => e.stopPropagation()}>
                <h3>Login</h3>
                <div className={styles.divInput}>
                    <input
                        type="text"
                        placeholder="email"
                        value={value.Email}
                        style={{ borderColor: err.Email ? 'red' : '' }}
                        onChange={(e) => {
                            setValue({ ...value, Email: e.target.value });
                            setErr({ ...err, Email: false });
                        }}
                    />
                </div>
                <div className={styles.divInput}>
                    <input
                        type={`${eye ? 'password' : 'text'}`}
                        placeholder="password"
                        value={value.Password}
                        style={{ borderColor: err.Password ? 'red' : '' }}
                        onChange={(e) => {
                            setValue({ ...value, Password: e.target.value });
                            setErr({ ...err, Password: false });
                        }}
                    />
                    {eye ? (
                        <Div
                            width="auto"
                            css="position: absolute; top: 10px; right: 11px;"
                            onClick={() => setEye(false)}
                        >
                            <EyemI />
                        </Div>
                    ) : (
                        <Div
                            width="auto"
                            css="position: absolute; top: 10px; right: 11px;"
                            onClick={() => setEye(true)}
                        >
                            <EyedI />
                        </Div>
                    )}
                </div>
                {er && <P color="red">{er}</P>}
                <div className={styles.divButton}>
                    <button type="button" onClick={handleLogin}>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};
export default Login;
