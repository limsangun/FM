import { Nav, Dropdown } from "react-bootstrap";
import "../css/Header.css";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { instance } from "./AxiosConfig/AxiosInterceptor";
import { createContext, useState } from "react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import FindPWModal from "./FindPWModal";

export const loginCreateContext = createContext();
export const registcreateContext = createContext();

function ApiHeader() {

    let navigate = useNavigate();

    const [showRegister, setRegisterShow] = useState(false);
    const [showLogin, setLoginShow] = useState(false);
    const [findpwshow, setFindpwshow] = useState(false);
    const [username, setUsername] = useState(localStorage.getItem('userName'))
    
    const successNotify = (e) => toast.success(e,toast.defaultOption);
    const errorNotify = (e) => toast.error(e,toast.defaultOption);

    const logoutHandler = () => {
        instance({
            method: "post",
            url: "/sign/signout",
            data: {
                email: localStorage.getItem('email'),
                accessToken: localStorage.getItem('accessToken')
            },
        }).then(function (res) {
            localStorage.clear();
            successNotify("로그아웃 되었습니다.");
            navigate('/docs')
        }).catch(function (err) {
            localStorage.clear();
            errorNotify('이미 로그아웃 되어있습니다.')
            navigate('./')
        });
    };

    const showRegisterModal = () => {
        setRegisterShow(true);
        setLoginShow(false);
    };

    const showLoginModal = () => {
        setRegisterShow(false);
        setLoginShow(true);
    };
    const showFindPWModal = () => {
        setRegisterShow(false);
        setLoginShow(false);
        setFindpwshow(true);
    };

    const closeFindPWModal = () => {
        setFindpwshow(false);
    };

    const closeRegisterModal = () => {
        setRegisterShow(false);
    };

    const closeLoginModal = () => {
        setLoginShow(false);
    };

    return (
        <>
            <Navbar expand="lg" className="Header--navbar" fixed='top'>
                <NavLink role="button" to="/" id="Header--Nav__BusinessList">
                    <Navbar.Brand id="Header__mainText">
                        <span style={{ cursor: 'pointer' }}>
                            <img id="Header-LogoImg" alt="메인로고이미지" src="./img/HeaderLogo.png" />
                            <span id="Header-franText">Franchise</span>
                            <span id="Header-ManageText">Management</span>
                        </span>
                    </Navbar.Brand>
                </NavLink>
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav justify variant="pills" style={{ marginRight: "10px" }}>
                        <>
                            <Nav.Item>
                                <NavLink
                                    role="button"
                                    to="/docs"
                                    eventkey="/link-1"
                                    id="Header--Nav__BusinessList"
                                    style={({ isActive }) =>
                                        isActive
                                            ? { backgroundColor: "#217af4" }
                                            : {}
                                    }
                                >
                                    API 문서
                                </NavLink>
                            </Nav.Item>
                            <Nav.Item>
                                {
                                    (() => {
                                        if (localStorage.getItem('accessToken')) {
                                            return (
                                                <NavLink
                                                    role="button"
                                                    to="/application"
                                                    eventkey="/link-1"
                                                    id="Header--Nav__BusinessList"
                                                    style={({ isActive }) =>
                                                        isActive
                                                            ? { backgroundColor: "#217af4" }
                                                            : {}
                                                    }
                                                >
                                                    내 앱 관리
                                                </NavLink>
                                            )
                                        } else {
                                            return (
                                                <button
                                                    id="Header--Nav__BusinessList"
                                                    style={{
                                                        backgroundColor:"rgba(0,0,0,0)"
                                                    }}
                                                    onClick={showLoginModal}
                                                >
                                                    내 앱 관리
                                                </button>
                                            )
                                        }
                                    })()
                                }
                            </Nav.Item>
                        </>
                    </Nav>
                </Navbar.Collapse>
                <Navbar.Text>
                    <div className="header--rightzone">
                        <div className="user__name">
                            <Navbar.Text className="dropdown header--rightzone__dropdown">
                                {localStorage.getItem('userName') ?
                                    <Link to="/mypage" style={{ color: '#FAF8FF' }} type="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                                        <strong>{username} </strong>님
                                    </Link> : null
                                }
                                <ul className="dropdown-menu header-dropdown" aria-labelledby="dropdownMenuLink">
                                    <li role="button" className="dropdown-item">
                                        <Link to="/docs" className="dropdown-item">
                                            API 문서
                                        </Link>
                                    </li>
                                    <li role="button" className="dropdown-item">
                                        <Link to="/application" className="dropdown-item">
                                            내 앱 관리
                                        </Link>
                                    </li>
                                    <Dropdown.Divider />
                                    <li role="button" className="dropdown-item">
                                        <Link
                                            to={() => false}
                                            className="dropdown-item"
                                            onClick={logoutHandler}
                                        >
                                            로그아웃
                                        </Link>
                                    </li>
                                </ul>
                            </Navbar.Text>
                        </div>
                        {localStorage.getItem('userName') ?
                            <>
                                <div className="header__right__sep">|</div>
                                <div className="header__logout" onClick={logoutHandler}>로그아웃</div>
                            </> : <>
                                <div className="header__login" onClick={showLoginModal}>로그인</div>
                                <div className="header__right__sep">|</div>
                                <div className="header__logout" onClick={showRegisterModal}>회원가입</div>
                            </>
                        }
                    </div>
                    <LoginModal
                        showLogin={showLogin}
                        closeLoginModal={closeLoginModal}
                        showFindPWModal = {showFindPWModal} 
                        showRegisterModal={showRegisterModal}
                        setUsername={setUsername}
                    />
                    <RegisterModal showRegister={showRegister} closeRegisterModal={closeRegisterModal} />
                    <FindPWModal findpwshow={findpwshow} closeFindpw={closeFindPWModal} />
                </Navbar.Text>
            </Navbar>
        </>
    );
}

export default ApiHeader;
