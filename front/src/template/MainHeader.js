import { Nav, Dropdown } from "react-bootstrap";
import "../css/Header.css";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { instance } from "./AxiosConfig/AxiosInterceptor";
import { createContext, useContext, useState } from "react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BusinessContext } from "../pages/Home";
import FindPWModal from "./FindPWModal";

export const loginCreateContext = createContext();
export const registcreateContext = createContext();

function MainHeader() {
    const franchiseeList = useContext(BusinessContext);
    const [showRegister, setRegisterShow] = useState(false);
    const [showLogin, setLoginShow] = useState(false);
    const [findpwshow, setFindpwshow] = useState(false);
    const [username, setUsername] = useState(localStorage.getItem('userName'));

    const successNotify = (e) => toast.success(e, toast.toastdefaultOption);
    const errorNotify = (e) => toast.error(e, toast.toastdefaultOption);

    const showRegisterModal = () => {
        setRegisterShow(true);
        setLoginShow(false);
        setFindpwshow(false);
    };

    const closeRegisterModal = () => {
        setRegisterShow(false);
    };

    const showLoginModal = () => {
        setRegisterShow(false);
        setLoginShow(true);
        setFindpwshow(false);
    };

    const closeLoginModal = () => {
        setLoginShow(false);
    };

    const showFindPWModal = () => {
        setRegisterShow(false);
        setLoginShow(false);
        setFindpwshow(true);
    };

    const closeFindPWModal = () => {
        setFindpwshow(false);
    };

    let navigate = useNavigate();

    const logoutHandler = () => {
        instance({
            method: "post",
            url: "/sign/signout",
            data: {
                email: localStorage.getItem('email'),
                accessToken: localStorage.getItem('accessToken')
            },
        }).then(function (res) {
            if (franchiseeList) {
                franchiseeList.setUserData({});
                franchiseeList.setFranchiseeList({});
            }
            localStorage.clear();
            successNotify('로그아웃이 되었습니다.');
            navigate('/')
        }).catch(function (err) {
            // console.log(err)
            localStorage.clear();
            errorNotify('이미 로그아웃이 되어있습니다.');
            navigate('/')
        });
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
                        {localStorage.getItem("accessToken") && (
                            <>
                                <Nav.Item>
                                    <NavLink role="button" to="/mypage" eventkey="/link-1" id="Header--Nav__BusinessList"
                                        style={({ isActive }) =>
                                            isActive
                                                ? { backgroundColor: "#217af4" }
                                                : {}
                                        }
                                    >
                                        마이페이지
                                    </NavLink>
                                </Nav.Item>
                                <Nav.Item>
                                    <NavLink
                                        role="button"
                                        to="/map"
                                        eventkey="/link-1"
                                        id="Header--Nav__BusinessList"
                                        style={({ isActive }) =>
                                            isActive
                                                ? { backgroundColor: "#217af4" }
                                                : {}
                                        }
                                    >
                                        지도 보기
                                    </NavLink>
                                </Nav.Item>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
                <Navbar.Text>
                    {
                        (() => {
                            if (localStorage.getItem("accessToken")) {
                                return (
                                    <>
                                        <div className="header--rightzone">
                                            <div className="user__name">
                                                <Navbar.Text className="dropdown header--rightzone__dropdown">
                                                    <Link to="/mypage" style={{ color: '#FAF8FF' }} type="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                                                        <strong style={{ cursor: 'pointer' }}> {username ? username : franchiseeList.userData.name} </strong>님
                                                    </Link>
                                                    <ul className="dropdown-menu header-dropdown" aria-labelledby="dropdownMenuLink">
                                                        <li role="button" className="dropdown-item">
                                                            <Link to="/mypage" className="dropdown-item">
                                                                마이페이지
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
                                            <div className="header__right__sep">|</div>
                                            <div className="header__logout" onClick={logoutHandler}>로그아웃</div>
                                        </div>
                                    </>
                                );
                            } else {
                                return (
                                    <>
                                        <div className="header--rightzone">
                                            <div className="header__login" onClick={showLoginModal}>로그인</div>
                                            <div className="header__right__sep">|</div>
                                            <div className="header__logout" onClick={showRegisterModal}>회원가입</div>
                                        </div>
                                        <LoginModal
                                            showLogin={showLogin}
                                            closeLoginModal={closeLoginModal}
                                            showFindPWModal={showFindPWModal}
                                            showRegisterModal={showRegisterModal}
                                            setUsername={setUsername}
                                        />
                                        <RegisterModal showRegister={showRegister} closeRegisterModal={closeRegisterModal} />
                                        <FindPWModal findpwshow={findpwshow} closeFindpw={closeFindPWModal} />
                                    </>
                                );
                            }
                        })()
                    }
                </Navbar.Text>
            </Navbar>
        </>
    );
}

export default MainHeader;