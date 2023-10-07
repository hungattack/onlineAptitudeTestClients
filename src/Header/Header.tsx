import React, { useEffect, useState } from 'react';
import style from './header.module.scss';
import { Link } from 'react-router-dom';
import Images from '../assets/images';
import UserBar from './UserBar';
import { Div, P } from '../styleComponent/styleComponent';
import { useDispatch, useSelector } from 'react-redux';
import userData, { PropsUserDataRD, login, register, setUser } from '../redux/userData';
const Header = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: { persistedReducer: { userData: PropsUserDataRD } }) => {
        return state.persistedReducer.userData.user;
    });

    const [show, setShow] = useState<boolean>(false);
    const [color, setColor] = useState<string>('/');
    const [menu, setMenu] = useState(() =>
        user
            ? [
                  { src: '/', name: 'Home' },
                  { src: '/testing', name: 'Testing room' },
              ]
            : [
                  { src: '/', name: 'Home' },
                  { src: '/testing', name: 'Testing room' },
              ],
    );
    useEffect(() => {
        if (user) {
            let check = false;
            menu.forEach((item) => {
                if (['Manager', 'Register manager', 'roof'].includes(item.name)) {
                    check = true;
                }
            });
            if (!check) {
                setMenu([
                    ...menu,
                    {
                        src: user?.roles.name === 'admin' ? '/manager' : '/regManager/',
                        name: user?.roles.name === 'admin' ? 'Manager' : 'Register manager',
                    },
                ]);
                if (user.roles.name === 'roof') {
                    menu.push({
                        src: 'roof',
                        name: 'Roof',
                    });
                }
            }
        } else {
            setMenu([
                { src: '/', name: 'Home' },
                { src: '/testing', name: 'Testing room' },
            ]);
        }
    }, [user]);
    console.log(user, 'user');

    return (
        <>
            <div className={style.header}>
                <Link className={style.logo} to="/">
                    <div className={style.logoImg}>
                        <img src={Images.logo} alt="Online Aptitude Test" />
                    </div>
                    <div className={style.logoTitle}>
                        <h3>Online Aptitude Test</h3>
                        <p>Job seeking</p>
                    </div>
                </Link>
                <div className={style.gridAt}>
                    <div className={style.menu}>
                        {menu.map((item) => (
                            <Link key={item.name} to={item.src} onClick={() => setColor(item.src)}>
                                <h5
                                    style={{
                                        width: 'fit-content',
                                        color: item.src === color ? '#92c5fe' : '',
                                    }}
                                >
                                    {item.name}
                                </h5>
                            </Link>
                        ))}
                    </div>
                    <div className={style.menuF}>
                        {user ? (
                            <P css="cursor: var(--pointer)" onClick={() => dispatch(setUser(null))}>
                                Logout
                            </P>
                        ) : (
                            <Div width="160px" justify="space-around">
                                <P css="cursor: var(--pointer)" onClick={() => dispatch(login(''))}>
                                    Login
                                </P>
                                <P css="cursor: var(--pointer)" onClick={() => dispatch(register(''))}>
                                    Register
                                </P>
                            </Div>
                        )}
                    </div>
                </div>

                <UserBar setShow={setShow} />
            </div>
            <div style={{ width: '100%', height: '60px', position: 'relative' }}>
                <div className={show ? style.gridOn : style.gridIN}>
                    <h3></h3>
                    <div className={style.menu}>
                        {menu.map((item) => (
                            <Link key={item.name} to={item.src} onClick={() => setColor(item.src)}>
                                <h5
                                    style={{
                                        width: 'fit-content',
                                        color: item.src === color ? '#92c5fe' : '',
                                    }}
                                >
                                    {item.name}
                                </h5>
                            </Link>
                        ))}
                    </div>
                    <div className={style.menuF}>
                        {user ? (
                            <P css="cursor: var(--pointer)" onClick={() => dispatch(setUser(null))}>
                                Logout
                            </P>
                        ) : (
                            <Div width="160px" justify="space-around">
                                <P css="cursor: var(--pointer)" onClick={() => dispatch(login(''))}>
                                    Login
                                </P>
                                <P css="cursor: var(--pointer)" onClick={() => dispatch(register(''))}>
                                    Register
                                </P>
                            </Div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
