import React, { useState, useEffect, createContext } from "react";
import { Container, Row, Col, ListGroup, Form, Modal, Dropdown } from "react-bootstrap";
import MainHeader from "../template/MainHeader";
import Footer from "../template/Footer";
import "../css/Mypage.css";
import ScrollToTop from '../template/ScrollToTop';
import AddFranchiseeModal from "../template/AddFranchiseeModal";
import Button from "react-bootstrap/Button";
import DelFranModals from "./DelFranModals";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { Link } from "react-router-dom";
import { instance } from "../template/AxiosConfig/AxiosInterceptor";
import { TbBoxOff } from "react-icons/tb";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Pagination, Stack } from "@mui/material";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { Input } from "@material-ui/core";

export const modalControllerContext = createContext();

function MypageForm() {

    //createContext()에 대한 넒길 정보 useState
    const [showAddFrenModal, setAddFrenModalShow] = useState(false);

    //유저 정보 변경 디폴트 셋팅 및 통신 이전의 값 저장.
    const [beforeTel, setBeforeTel] = useState({
        phoneNumber: ""
    });

    //유저 정보 업데이트 함수
    function UpdateUserInfo(
        userInfo,
        userInfoAddress,
        setUserInfo,
        beforeTel
    ) {
        const phonRegx = /^(010)?([0-9]{4})?([0-9]{4})$/;
        if (document.getElementById('user-phoneNumber').value.length === 0) {
            toast.error('전화번호칸은 필수입니다.', toast.toastdefaultOption);
            document.getElementById('user-phoneNumber').value = userInfo.phoneNumber.replace(/[^0-9]/g, "").replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, "$1-$2-$3").replace("--", "-");
        }
        else if (userInfo.address.detail === document.getElementById('detailAddress').value && userInfo.phoneNumber === beforeTel.phoneNumber && userInfo.address.road === document.getElementById("postcode--Address").value) {
            toast.error('변경된 값이 없습니다', toast.toastdefaultOption);
        }
        else if (
            userInfoAddress &&
            document.getElementById('user-phoneNumber').value.length === 13 &&
            phonRegx.test(beforeTel.phoneNumber)
        ) {
            instance({
                method: "put",
                url: `/member/` + localStorage.getItem("userId"),
                data: {
                    address: {
                        detail: document.getElementById('detailAddress').value,
                        jibun: userInfoAddress.jibun,
                        postalCode: userInfoAddress.postalCode,
                        road: userInfoAddress.road,
                    },
                    phoneNumber: document.getElementById('user-phoneNumber').value.split('-')[0] + document.getElementById('user-phoneNumber').value.split('-')[1] + document.getElementById('user-phoneNumber').value.split('-')[2],
                },
            }).then(function (res) {
                setUserInfo(res.data);
                setUserInfoAddress(res.data.address);
                toast.success('유저정보가 수정되었습니다.', toast.toastdefaultOption);
            }).catch(function (err) {
                toast.error('전화번호란을 확인해주세요.', toast.toastdefaultOption);
                setUserInfo({
                    ...userInfo,
                    phoneNumber: userInfo.phoneNumber
                })
            });
        } else {
            toast.error('전화번호란을 확인해주세요.', toast.toastdefaultOption);
            setUserInfoAddress({ ...userInfoAddress, detail: userInfoAddress.detail, road: userInfoAddress.road })
        }
    }

    //가맹점 등록 모달 출력
    const showAddFrenModalFunction = () => {
        setAddFrenModalShow(true);
        document.getElementById('franSearchbar').value='';
        setQuery('');
    };

    const [list, setList] = useState([]);
    const [userInfo, setUserInfo] = useState({
        phoneNumber: "",
        address: {
            detail: "",
            jibun: "",
            postalCode: "",
            road: "",
        },
    });
    const [userInfoAddress, setUserInfoAddress] = useState({
        detail: "",
        jibun: "",
        postalCode: "",
        road: "",
    });
    const [createDate, setCreatedate] = useState();
    const [businessdata, setBusinessData] = useState({});
    const [searchCount, setSearchCount] = useState(0);

    //모달 띄우기
    const [show, setShow] = useState(false);
    //유저 정보 받아오는 통신
    useEffect(() => {
        instance({
            method: "get",
            url: `/member/` + localStorage.getItem("userId"),
        })
            .then(function (res) {
                setUserInfo(res.data);
                setUserInfoAddress(res.data.address);
                setBeforeTel({ phoneNumber: res.data.phoneNumber });
                setCreatedate(res.data.createDate.split(" ")[0]);
            })
    }, []);

    //주소변경
    let scriptUrl =
        "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    const open = useDaumPostcodePopup(scriptUrl);

    const handleComplete = (data) => {
        if (data.userSelectedType === "R") {
            // 사용자가 도로명 주소를 선택했을 경우
            document.getElementById("postcode--Address").value =
                data.roadAddress;

            if (data.autoJibunAddress === "") {
                setUserInfoAddress({
                    detail: userInfo.address.detail,
                    jibun: data.jibunAddress,
                    postalCode: data.zonecode,
                    road: data.address,
                });
            } else {
                setUserInfoAddress({
                    detail: userInfo.address.detail,
                    jibun: data.autoJibunAddress,
                    postalCode: data.zonecode,
                    road: data.address,
                });
            }
        } else {
            // 사용자가 지번 주소를 선택했을 경우(J)
            document.getElementById("postcode--Address").value =
                data.jibunAddress;
            setUserInfoAddress({
                detail: userInfo.address.detail,
                jibun: data.jibunAddress,
                postalCode: data.zonecode,
                road: data.address,
            });
        }
    };

    const handleClick = (e) => {
        e.preventDefault();
        open({ onComplete: handleComplete });
    };

    const [deleteModalshow, setDeleteModalshow] = useState(false);
    let delChk = false;
    const deleteModalClose = () => {
        setDeleteModalshow(false);
    };
    const delchkmsg = (e) => {
        let msg = "회원탈퇴";
        if (msg === e.target.value) {
            delChk = true;
        }
    };
    const deleteMember = () => {
        if (delChk && deleteModalshow) {
            instance({
                method: "delete",
                url: "/member/" + localStorage.getItem("userId"),
            }).then((res) => {
                localStorage.clear();
                window.location.href = "/";
            });
        }
    };

    //가맹점 페이징
    const [franPage, setFranPage] = React.useState(1);
    const [click, setClick] = useState(true);
    const [order, setOrder] = useState('business_number');
    const [query, setQuery] = useState('');
    const [queryCount, setQueryCount] = useState(0);
    const [queryList, setQueryList] = useState([]);
    const [sortArrow, setSortArrow] = useState('businessNum');

    useEffect(() => {
        let option;
        if (click) option = 'ASC';
        else option = 'DESC';
        // setList([])
        instance({
            method: "get",
            url: "/member/" + localStorage.getItem("userId") + "/franchisee",
            params: { page: franPage, option: option, order: order, query: query },
        })
            .then(function (res) {
                if (query) {
                    setQueryCount(res.data.searchCount);
                    setQueryList(res.data.franchisees);
                }
                else {
                    setSearchCount(res.data.searchCount);
                    setList(res.data.franchisees);
                }
            })
            .catch((err) => {
                // console.log(err)
            });
    }, [click, franPage, query, queryCount, showAddFrenModal, show])

    //전화번호 onchnage 부분
    const handlePhonePress = (e) => {
        e.value = e.value.replace(/[^0-9]/g, "").replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
        setBeforeTel({
            ...beforeTel,
            phoneNumber: e.value.split("-")[0] + e.value.split("-")[1] + e.value.split("-")[2]
        })
    }

    const addressChange = (e) => {
        setUserInfoAddress({
            ...userInfoAddress,
            [e.target.name]:
                e.target.value,
        });
    }

    return (
        <>
            <ScrollToTop />
            <modalControllerContext.Provider
                value={{
                    showAddFrenModal,
                    setAddFrenModalShow,
                    setList,
                    list,
                    setFranPage,
                    franPage,
                    searchCount,
                    setQuery
                }}
            >
                <MainHeader />
                <Container className="Mypage--Container">
                    <div className="main-body">
                        <div className="row mb-3 userinfozone">
                            <div className="col-sm-4 userinfozone--headerzone">
                                <div className="card userinfozone--usertitle">
                                    <div className="card-body" style={{ marginTop: "18%" }}>
                                        <div className="d-flex flex-column align-items-center text-center mb-2">
                                            <div>
                                                <p className='mypage__image'><FontAwesomeIcon icon={faUser} /></p>
                                            </div>
                                            <div className='mypage__info'>
                                                <p className='mypage__nickname'>{localStorage.getItem('userName')}</p>
                                                <p className='mypage__email'><FontAwesomeIcon icon={faEnvelope} /> {localStorage.getItem('email')}</p>
                                            </div>
                                            <Dropdown className='mypage__dropdown'>
                                                <Dropdown.Toggle variant="secondary" id="dropdown-basic" className='mypage__dropdown__item'></Dropdown.Toggle>
                                                {/* <button className='mypage__dropdown__item dropdown-toggle btn btn-secondary' id="dropdown-basic" aria-expanded='false'/> */}
                                                <Dropdown.Menu>
                                                    <Dropdown.Item
                                                        className='mypage__dropdown__delete'
                                                        onClick={() => { setDeleteModalshow(true); }}
                                                    >회원탈퇴</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-8 userinfozone--bodyzone">
                                <div className="card userinfozone--usertitle">
                                    <div className="card-body">
                                        <div className='row mypage__section mypage__section__birth'>
                                            <span className='mypage__title'>생년월일</span>
                                            <div className="col-sm-10 text-secondary mypageInput">
                                                <input
                                                    className='mypage__imput'
                                                    name='birth'
                                                    type='text'
                                                    readOnly
                                                    style={{ backgroundColor: '#b3b4b5' }}
                                                    defaultValue={createDate}
                                                />
                                            </div>
                                        </div>

                                        <div className='row mypage__section mypage__section__address' style={{ height: '150px' }}>
                                            <div>
                                                <span className='mypage__title mypage__title__suv'>주소</span>
                                                <Form.Group className='mb-3'>
                                                    <span className='mypage__title__address'>기본주소&nbsp;
                                                        <span className='mypage__caution'><FontAwesomeIcon icon={faExclamationCircle} />필수</span>
                                                    </span>
                                                    <Form.Control
                                                        className='mypage__imput mypage__address__input mypage__address__input__cursor'
                                                        type='text'
                                                        id='postcode--Address'
                                                        readOnly={true}
                                                        defaultValue={userInfoAddress.road}
                                                        style={{ backgroundColor: '#b3b4b5' }}
                                                        onClick={handleClick}
                                                        placeholder='주소'
                                                    ></Form.Control>
                                                    <span className='mypage__title__address'>상세주소</span>
                                                    <Form.Control
                                                        className='mypage__imput'
                                                        type='text'
                                                        id="detailAddress"
                                                        name='detail'
                                                        maxLength={44}
                                                        defaultValue={userInfoAddress.detail}
                                                        onChange={(e) => addressChange(e)}
                                                        placeholder='상세주소'
                                                    ></Form.Control>
                                                </Form.Group>
                                            </div>
                                        </div>
                                        <div className="row mypage__section mypage__section__phone">
                                            <span className="mypage__title">전화번호&nbsp;
                                                <span className='mypage__caution'><FontAwesomeIcon icon={faExclamationCircle} />필수</span>
                                            </span>
                                            <div className="col-sm-10 text-secondary mypageInput">
                                                <input
                                                    maxLength={13}
                                                    className='mypage__imput'
                                                    name="phoneNumber"
                                                    id="user-phoneNumber"
                                                    type="text"
                                                    onChange={(e) => handlePhonePress(e.target)}
                                                    defaultValue={beforeTel.phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')}
                                                />
                                            </div>
                                        </div>
                                        <button
                                            className="mypage__update__button"
                                            onClick={() => {
                                                UpdateUserInfo(
                                                    userInfo,
                                                    userInfoAddress,
                                                    setUserInfo,
                                                    beforeTel
                                                );
                                            }}
                                        >
                                            정보수정
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card mb-3 fransimpledatazone">
                            <div className="card-body" id="mypage-FranList">
                                <div className="row fransimpledatazone--headerzone">
                                    <div
                                        className="col-sm-10"
                                        style={{ textAlign: "left" }}
                                        id="franList"
                                    >
                                        <h6>가맹점 리스트</h6>
                                    </div>
                                    <button
                                        id="Mypage-newBtn"
                                        className="btn btnMenu btnAddMenu"
                                        onClick={showAddFrenModalFunction}
                                    >
                                        업체 신규 등록
                                    </button>
                                </div>
                                <hr />
                                <div className="row fransimpledatazone--bodyzone">
                                    <div
                                        className="fransimpledatazone--franlistzone"
                                        style={{
                                            textAlign: "center",
                                        }}
                                    >
                                        <Row style={{ marginLeft: "10px", backgroundColor: "rgb(245, 240, 240)", marginRight: "0px", }}>
                                            <Col md={3}
                                                className="Mypage-FranText"
                                                onClick={(e) => {
                                                    setClick(!click);
                                                    setOrder('business_number');
                                                    setSortArrow('businessNum')
                                                }}>
                                                사업자 번호
                                                <span style={{ fontSize: '8pt', marginLeft: '5px' }}>
                                                    {sortArrow === 'businessNum' ? click ? '▼' : '▲' : '▼'}
                                                </span>
                                            </Col>
                                            <Col md={3}
                                                className="Mypage-FranText"
                                                onClick={(e) => {
                                                    setClick(!click);
                                                    setOrder('name');
                                                    setSortArrow('franName')
                                                }}>
                                                가맹점 이름
                                                <span style={{ fontSize: '8pt', marginLeft: '5px' }}>
                                                    {sortArrow === 'franName' ? click ? '▼' : '▲' : '▼'}
                                                </span>
                                            </Col>
                                            <Col md={5}
                                                className="Mypage-FranText"
                                                onClick={(e) => {
                                                    setClick(!click);
                                                    setOrder('tel');
                                                    setSortArrow('tel')
                                                }}>
                                                전화번호
                                                <span style={{ fontSize: '8pt', marginLeft: '5px' }}>
                                                    {sortArrow === 'tel' ? click ? '▼' : '▲' : '▼'}
                                                </span>
                                            </Col>
                                            <Col md={1}></Col>
                                        </Row>
                                        {list.length > 0 ? (
                                            <ListGroup>
                                                {!query ? list.map((ele, idx) => {
                                                    return (
                                                        <ListGroup.Item key={idx}>
                                                            <Link
                                                                className="Mypage-FranDetail"
                                                                to={"/businessDetail"}
                                                                state={{ businessNumber: `${ele.businessNumber}`, list: { list }, searchCount: { searchCount }, data: { ele }, franPage: { franPage } }}
                                                                style={{
                                                                    textDecoration: "none",
                                                                    color: "black",
                                                                }}
                                                            >
                                                                <Row className="Mypage-FranDetail">
                                                                    <Col md={3}>
                                                                        {ele.businessNumber.replace(/(\d{3})(\d{5})(\d{2})/, "$1-$2-$3")}
                                                                    </Col>
                                                                    <Col md={3}>
                                                                        {ele.name.length < 10 ? ele.name : ele.name.slice(0, 7) + '...'}
                                                                    </Col>
                                                                    <Col md={5}>
                                                                        {ele.tel.replace(/[^0-9]/g, "").replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, "$1-$2-$3").replace("--", "-")}
                                                                    </Col>
                                                                    <Col
                                                                        md={1}
                                                                        role="button"
                                                                        className="delFranbtn btn btn-danger"
                                                                        style={{ width: "40px", }}
                                                                        onClick={(e) => {
                                                                            e.preventDefault(); setShow(true); setBusinessData(ele);
                                                                        }}>
                                                                        삭제
                                                                    </Col>
                                                                </Row>
                                                            </Link>
                                                        </ListGroup.Item>
                                                    );
                                                }) : queryList.map((ele, idx) => {
                                                    return (
                                                        <ListGroup.Item key={idx}>
                                                            <Link
                                                                className="Mypage-FranDetail"
                                                                to={"/businessDetail"}
                                                                state={{ businessNumber: `${ele.businessNumber}`, query: { queryCount }, list: { list }, searchCount: { searchCount }, data: { ele }, franPage: { franPage } }}
                                                                style={{
                                                                    textDecoration: "none",
                                                                    color: "black",
                                                                }}
                                                            >
                                                                <Row className="Mypage-FranDetail">
                                                                    <Col md={3}>
                                                                        {ele.businessNumber.replace(/(\d{3})(\d{5})(\d{2})/, "$1-$2-$3")}
                                                                    </Col>
                                                                    <Col md={3}>
                                                                        {ele.name.length < 10 ? ele.name : ele.name.slice(0, 7) + '...'}
                                                                    </Col>
                                                                    <Col md={5}>
                                                                        {ele.tel.replace(/[^0-9]/g, "").replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, "$1-$2-$3").replace("--", "-")}
                                                                    </Col>
                                                                    <Col
                                                                        md={1}
                                                                        role="button"
                                                                        className="delFranbtn btn btn-danger"
                                                                        style={{ width: "40px", }}
                                                                        onClick={(e) => {
                                                                            e.preventDefault(); setShow(true); setBusinessData(ele);
                                                                        }}>
                                                                        삭제
                                                                    </Col>
                                                                </Row>
                                                            </Link>
                                                        </ListGroup.Item>
                                                    );
                                                })}
                                            </ListGroup>
                                        ) : (
                                            <div className="fransimpledatazone--franlistzone--defaultFranZone">
                                                <h1>
                                                    <TbBoxOff
                                                        style={{
                                                            color: "#4187f5",
                                                            marginTop: "50px",
                                                        }}
                                                    />
                                                </h1>
                                                <div>
                                                    <p>등록된 가맹점이 없습니다</p>
                                                    <p>
                                                        우측 상단의 상권등록 버튼을
                                                        통해 가맹점을 추가해주세요
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-4"></div>
                                <Input
                                    className="col-sm-4"
                                    id='franSearchbar'
                                    onChange={(e) => {
                                        setQuery(e.target.value)
                                        setFranPage(1)
                                    }}
                                    placeholder='가맹점 이름 검색'
                                    style={{ textAlign: 'center' }}
                                />
                                <div className="col-sm-4"></div>
                            </div>
                            <Stack spacing={2}>
                                <Pagination
                                    count={query.length > 0 ? Math.ceil(queryCount / 5) : Math.ceil(searchCount / 5)}
                                    color="primary"
                                    page={franPage}
                                    siblingCount={3}
                                    onChange={(e, idx) => setFranPage(idx)}
                                />
                            </Stack>
                        </div>
                    </div>
                    {show ? (
                        <DelFranModals
                            show={show}
                            setShow={setShow}
                            data={businessdata}
                            list={list}
                            setList={setList}
                            franPage={franPage}
                            setFranPage={setFranPage}
                            searchCount={searchCount}
                        />
                    ) : null}
                    <AddFranchiseeModal />
                    <Modal show={deleteModalshow} onHide={deleteModalClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Delete Member</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Label className="lab_normal">회원 탈퇴를 원하시면 '회원탈퇴' 를 입력하여 주십시오.</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="회원탈퇴"
                                onChange={delchkmsg}
                                autoFocus
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={deleteMember}>
                                탈퇴
                            </Button>
                            <Button variant="secondary" onClick={deleteModalClose}>
                                취소
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Container>
            </modalControllerContext.Provider >
        </>
    );
}

function Mypage() {
    return (
        <>
            <MypageForm></MypageForm>
            <Footer></Footer>
        </>
    );
}

export default Mypage;