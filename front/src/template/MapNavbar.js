import "../css/MapNavbar.css";
import { Card } from 'react-bootstrap';
import React, { useState } from "react";
import { instance } from "./AxiosConfig/AxiosInterceptor";
import { useNavigate } from "react-router";
import RegisterModal from "./RegisterModal";
import LoginModal from "./LoginModal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dropdown } from "bootstrap";
import FindPWModal from "./FindPWModal";
import { BsChevronDoubleRight } from 'react-icons/bs';

const { naver } = window;

function MapNavbar({ detailTogOpen, detailTogClose, searchMarkerTogOpen }) {
    const [username, setUsername] = useState(localStorage.getItem("userName"));
    const [showLogin, setLoginShow] = useState(false);
    const [showRegister, setRegisterShow] = useState(false);
    const [findpwshow, setFindpwshow] = useState(false);

    const showRegisterModal = () => {
        setRegisterShow(true);
    };

    const closeRegisterModal = () => {
        setRegisterShow(false);
    };


    const showLoginModal = () => {
        setLoginShow(true);
    };

    const closeLoginModal = () => {
        setLoginShow(false);
    };
    const closeFindPWModal = () => {
        setFindpwshow(false);
    };
    const showFindPWModal = () => {
        setRegisterShow(false);
        setLoginShow(false);
        setFindpwshow(true);
    };

    let navigate = useNavigate();
    let placeMarker;
    let placeMarkerList = [];

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
            setUsername("");
            toast.success('로그아웃 되었습니다', toast.toastDefaultOption);
            window.location.reload();
            // navigate('./')

        }).catch(function (err) {
            localStorage.clear();
            setUsername("");
            toast.error('이미 로그인되어져 있습니다', toast.toastDefaultOption);
            navigate('./')
        });
    };

    // 글자수 제한
    const checkStringCount = (value, count) => {
        value=String(value);
        if (value.length > count) {
            return value.substr(0, count-1) + ' ...';
        } else return value;
    };

    const showMyPlace = (e) => {
        if (localStorage.getItem("userId") != null) {

            // 버튼 못누르게
            e.target.setAttribute('disabled', 'disabled');
            if (e.target.getAttribute('disabled')) {
                document.getElementById('showPlacebtn').innerHTML = `<div class="spinner-border text-primary mapnavbar--spinnerzone" role="status"></div><p class="mapnavbar--spinnertextzone">검색 중</p>`;
            }

            test.removeCluster();
            test.movedCenterCircle.setVisible(false);
            instance({
                method: "get",
                url: "/member/" + localStorage.getItem("userId") + "/franchisee/all",
            })
                .then(function (res) {
                    placeMarkerList = [];
                    for (let idx = 0; idx < res.data.length; idx++) {
                        let placeLatLng = new naver.maps.LatLng(res.data[idx].y, res.data[idx].x);
                        placeMarker = new naver.maps.Marker({
                            position: placeLatLng,
                            map: test.map,
                            icon: {
                                content: [
                                    '<div class="naverApiMap-mappingMarker">',
                                    '<div class="naverApiMap-mappingMarker--imageZone">',
                                    '<img src="' + process.env.PUBLIC_URL + '/img/restImg.png">',
                                    "</div>",
                                    '<div class="naverApiMap-mappingMarker--mainZone">',
                                    '<div class="naverApiMap-mappingMarker--titleZone">',
                                    "<span>",
                                    checkStringCount(res.data[idx].name,5),
                                    "</span>",
                                    "</div>",
                                    '<div class="naverApiMap-mappingMarker--phoneNumberZone">',
                                    "<span>",
                                    res.data[idx].tel.substring(0, 2) === "02" ?
                                        res.data[idx].tel.replace(
                                            /(\d{2})(\d{3,4})(\d{4})/,
                                            "$1-$2-$3"
                                        )
                                        : res.data[idx].tel.replace(
                                            /(\d{3})(\d{3,4})(\d{4})/,
                                            "$1-$2-$3"
                                        ),
                                    "</span>",
                                    "</div>",
                                    "</div>",
                                    "</div>",
                                ].join(""),
                                anchor: new naver.maps.Point(25, 60),
                            },
                            title: res.data[idx].businessNumber
                        })
                        naver.maps.Event.addListener(placeMarker, "click", function (e) {
                            searchMarkerTogOpen(res.data);
                            detailTogClose();
                            detailTogOpen(e.overlay.title);
                        })
                        placeMarkerList.push(placeMarker);
                    }
                    test.markers.push(placeMarkerList);
                    test.searchData.push(res.data);
                    test.doCluster();

                    // 버튼 다시 누를수 있도록
                    e.target.removeAttribute('disabled');
                    document.getElementById('showPlacebtn').innerHTML = `<li onClick={{showMyPlace(e)}} id='showPlacebtn'><img src="` + process.env.PUBLIC_URL + `/img/myfrenbtnImg.png" type='button'/><p>내 가맹점</p></li>`;

                    searchMarkerTogOpen(res.data);
                })
                .catch((err) => {
                });
        } else {
            toast.warning('로그인 후 이용 가능합니다', toast.toastDefaultOption);
            showLoginModal();
        }

    }

    const goMypage = () => {
        if (localStorage.getItem("userId") != null) {
            window.location.href ='/mypage';
        }else{
            toast.warning('로그인 후 이용 가능합니다', toast.toastDefaultOption);
            showLoginModal();
        }
    }

    return (
        <>
            <div className="MapNavbar-navArea">
                <ul className="nav flex-column MapNavbar-navArea--listZone">
                    <li className="nav-item MapNavbar-navArea__title">
                        <a className="nav-link MapNavbar-navArea__img" href="/"><img className="MapNav-cursor" src={process.env.PUBLIC_URL + "/favicon.ico"}></img></a>
                    </li>
                    <li className="nav-item MapNavbar-navArea--buttonzone">
                        <ul style={{ listStyle: 'none', padding: '0px' }}>
                            <li id='goMypagebtn' className="MapNav-cursor">
                                <a className="nav-link" onClick={goMypage} role='button'><img className="MapNav-cursor" src={process.env.PUBLIC_URL + "/img/mypagebtnImg.png"} /></a>
                                <p className="MapNav-cursor">마이페이지</p>
                            </li>
                            <li onClick={(e) => { showMyPlace(e) }} id='showPlacebtn' className="MapNav-cursor">
                                <img src={process.env.PUBLIC_URL + "/img/myfrenbtnImg.png"} type='button' />
                                <p className="MapNav-cursor">내 가맹점</p>
                            </li>
                        </ul>
                    </li>
                    <li className="nav-item MapNavbar-navArea__userInfozone btn dropend">
                        <img src={process.env.PUBLIC_URL + '/img/usericonImg.png'} className="dropdown-toggle" type="button" id="userdropdown" data-bs-toggle="dropdown" aria-expanded="false" />
                        <ul className="dropdown-menu MapNavbar-userdropdownzone" aria-labelledby="userdropdown" data-popper-placement="right-start">
                            {(() => {
                                if (localStorage.getItem("accessToken")) {
                                    return (
                                        <>
                                            <Card.Header className="MapNavbar-userinfoTextzone">
                                                <img src={process.env.PUBLIC_URL + "/img/usermarker.png"} style={{ marginBottom: '30px' }} alt="유저사진" />
                                                <div className="MapNavbar-userinfoTextzone__text">
                                                    {username} 님 환영합니다.
                                                    <p>{localStorage.getItem('email')}</p>
                                                </div>
                                                <button onClick={logoutHandler} style={{ position: 'relative', top: '-14px' }}>로그아웃</button>
                                            </Card.Header>
                                            <li role="button" className="dropdown-item">
                                                <a className="dropdown-item" href="/mypage">
                                                    마이페이지
                                                </a>
                                            </li>
                                        </>
                                    )
                                } else {
                                    return (
                                        <>
                                            <li role="button" className="MapNavbar-defaultButton">
                                                <p
                                                    className="dropdown-item"
                                                    onClick={showRegisterModal}
                                                >
                                                    회원가입
                                                </p>
                                                <RegisterModal showRegister={showRegister} closeRegisterModal={closeRegisterModal} />
                                                <FindPWModal findpwshow={findpwshow} closeFindpw={closeFindPWModal} />
                                            </li>
                                            <li role="button" className="MapNavbar-defaultButton">
                                                <p
                                                    className="dropdown-item"
                                                    onClick={showLoginModal}
                                                >
                                                    로그인
                                                </p>
                                                <LoginModal
                                                    showLogin={showLogin}
                                                    closeLoginModal={closeLoginModal}
                                                    showFindPWModal={showFindPWModal}
                                                    showRegisterModal={showRegisterModal}
                                                    setUsername={setUsername}
                                                />
                                            </li>
                                        </>
                                    )
                                }
                            })()
                            }
                        </ul>
                    </li>
                </ul>
            </div>
            <button id='btnSearchListOpen'>
                <BsChevronDoubleRight style={{ color: 'gray', marginLeft: '-4px' }} type='button'/>
            </button>
        </>
    )
}

export default MapNavbar;