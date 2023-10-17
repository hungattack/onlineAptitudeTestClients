'use client';
import React, { useState } from 'react';
import styles from './register.module.scss';
import authAPI from '../../API/authAPI/authAPI';
import { CloseEyeI, OpenEyeI } from '../../assets/Icons/Icons';
import { register } from '../../redux/userData';
import { useDispatch } from 'react-redux';
const Register = () => {
    const dispatch = useDispatch();
    const [gender, setGender] = useState<boolean | null>(null);
    const [eye, setEye] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [err, setErr] = useState<{
        Name: boolean;
        Email: boolean;
        Password: boolean;
        Gender: boolean;
    }>({
        Name: false,
        Email: false,
        Password: false,
        Gender: false,
    });
    const [dataUser, setdataUser] = useState<{
        Name: string;
        Email: string;
        Password: string;
    }>({
        Name: '',
        Email: '',
        Password: '',
    });
    const submit = async () => {
        let check = false;
        if (!dataUser.Name || dataUser.Name.length < 5 || dataUser.Name.length > 40) {
            setErr({ ...err, Name: true });
            check = true;
        }
        if (!dataUser.Email) {
            setErr({ ...err, Email: true });
            check = true;
        }
        if (gender === null) {
            setErr({ ...err, Gender: true });
            check = true;
        }
        if (!dataUser.Password || dataUser.Password.length < 5 || dataUser.Password.length > 40) {
            setErr({ ...err, Password: true });
            check = true;
        }
        if (dataUser.Name && dataUser.Password && dataUser.Email && !check && gender !== null) {
            const res = await authAPI.Register({ ...dataUser, Gender: gender });
            setMessage(res);
        }
        console.log(dataUser);
    };
    const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        const validateEmail = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,5})+$/;
        if (!validateEmail.test(e.target.value)) {
            setErr({ ...err, Email: true });
        } else {
            setErr({ ...err, Email: false });
        }

        setdataUser({ ...dataUser, Email: e.target.value });
    };
    return (
        <div className={styles.login} onClick={() => dispatch(register(''))}>
            <div className={styles.frame} onClick={(e) => e.stopPropagation()}>
                <h3>Register</h3>
                <div className={styles.divInput}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={dataUser.Name}
                        style={{ borderColor: err.Name ? 'red' : '' }}
                        onChange={(e) => {
                            if (e.target.value.length < 40) {
                                setdataUser({ ...dataUser, Name: e.target.value });
                            }
                            setErr({ ...err, Name: false });
                        }}
                    />
                    {err.Name && (
                        <p style={{ color: 'red', fontSize: '1.3rem' }}>
                            The field name must be from 5 to 40 characters long
                        </p>
                    )}
                </div>
                <div className={styles.divInput}>
                    <input
                        type="text"
                        placeholder="Email"
                        value={dataUser.Email}
                        style={{ borderColor: err.Email ? 'red' : '' }}
                        onChange={(e) => handleEmail(e)}
                    />
                    {err.Email && <p style={{ color: 'red', fontSize: '1.3rem' }}>Email is not valid</p>}
                </div>
                {/* <div className={styles.divInput}>
                        <input id="upload" type="file" Name="file[]" hidden onChange={submit} />
                        <label htmlFor="upload">avatar</label>
                    </div> */}
                <div className={styles.divInput}>
                    <input
                        type={eye ? 'text' : 'Password'}
                        placeholder="Password"
                        value={dataUser.Password}
                        style={{ borderColor: err.Password ? 'red' : '' }}
                        onChange={(e) => {
                            if (e.target.value.length < 50) {
                                setdataUser({ ...dataUser, Password: e.target.value });
                            }
                            setErr({ ...err, Password: false });
                        }}
                    />
                    {err.Password && (
                        <p style={{ color: 'red', fontSize: '1.3rem' }}>
                            The field Password must be from 5 to 50 characters long
                        </p>
                    )}
                    {!eye ? (
                        <div className={styles.eyes} onClick={() => setEye(true)}>
                            <OpenEyeI />
                        </div>
                    ) : (
                        <div className={styles.eyes} onClick={() => setEye(false)}>
                            <CloseEyeI />
                        </div>
                    )}
                </div>
                <div className={styles.divInput}>
                    <p
                        style={{ color: gender === false ? '#58dc58' : '' }}
                        onClick={() => {
                            setGender(false);
                            setErr({ ...err, Gender: false });
                        }}
                    >
                        Male
                    </p>
                    <p
                        style={{ color: gender ? '#58dc58' : '' }}
                        onClick={() => {
                            setGender(true);
                            setErr({ ...err, Gender: false });
                        }}
                    >
                        Female
                    </p>
                    {err.Gender && <p style={{ color: 'red', fontSize: '1.3rem' }}>Please choose!</p>}
                </div>
                {message && (
                    <p
                        style={{
                            color: message.includes('Create successfully') ? '#69d169' : 'red',
                        }}
                    >
                        {message}
                    </p>
                )}
                <div className={styles.divButton}>
                    <button type="button" onClick={submit}>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;
