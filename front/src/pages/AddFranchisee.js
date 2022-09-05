import "../css/AddFranchisee.css";
import { Container, Form, Row, Col, InputGroup, Button, } from "react-bootstrap";
import useDaumPostcodePopup from "react-daum-postcode/lib/useDaumPostcodePopup";
import "bootstrap/dist/css/bootstrap.css";
import React, { useContext, useState } from "react";
import { franchiseeinfoContext } from "../template/AddFranchiseeModal";
import axios from "axios";
import { modalControllerContext } from "../pages/Mypage";
import { instance } from "../template/AxiosConfig/AxiosInterceptor";
import { Box, Typography, Stepper, Step, StepLabel, } from "@material-ui/core";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NaverMap, Marker } from 'react-naver-maps';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

const steps = ["기본정보", "추가정보", "영업시간"];

function AddFranchisee({ inputElement, setAddFranModal }) {
    const franchiseeInfo = useContext(franchiseeinfoContext);
    const listRefresh = useContext(modalControllerContext);
    let scriptUrl = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    const open = useDaumPostcodePopup(scriptUrl);
    const [mapLatLng, setMapLatLng] = useState({
        lat: "37.5665734",
        lng: "126.978179"
    });

    //  주소선택
    const searchAddress = (data) => {
        axios({
            method: "get",
            url: "https://dapi.kakao.com/v2/local/search/address.json?query=" + data.address,
            headers: {
                Authorization: "KakaoAK f3cb5e756b2d568b25cb2384c8528614", // REST API 키
            },
        }).then(function (res) {
            franchiseeInfo.setFranchiseeinput({ ...franchiseeInfo.franchiseeinput, x: res.data.documents[0].x, y: res.data.documents[0].y });
            setMapLatLng({
                ...mapLatLng,
                lat: res.data.documents[0].y, lng: res.data.documents[0].x
            });
        });

        if (data.userSelectedType === "R") {
            // 사용자가 도로명 주소를 선택했을 경우
            document.getElementById("postcode--address").value = data.roadAddress;
            franchiseeInfo.setFranchiseeinput({ ...franchiseeInfo.franchiseeinput, displayAddress: data.roadAddress, });
            if (data.autoJibunAddress === "") {
                // autoAddress가 없는 경우
                franchiseeInfo.setFranchiseeaddressinfo({ ...franchiseeInfo.franchiseeaddressInfo, jibun: data.jibunAddress, postalCode: data.zonecode, road: data.address, });
            } else {
                // autoAddress가 있는 경우
                franchiseeInfo.setFranchiseeaddressinfo({ ...franchiseeInfo.franchiseeaddressInfo, jibun: data.autoJibunAddress, postalCode: data.zonecode, road: data.address, });
            }
        } else {
            // 사용자가 지번 주소를 선택했을 경우(J)
            document.getElementById("postcode--address").value = data.jibunAddress;
            franchiseeInfo.setFranchiseeinput({ ...franchiseeInfo.franchiseeinput, displayAddress: data.jibunAddress, });
            franchiseeInfo.setFranchiseeaddressinfo({ ...franchiseeInfo.franchiseeaddressInfo, jibun: data.jibunAddress, postalCode: data.zonecode, road: data.address, });
        }
    };

    const searchAddressClick = () => {
        open({ onComplete: searchAddress });
    };

    const onchangeValue = (e) => {
        franchiseeInfo.setFranchiseeinput({ ...franchiseeInfo.franchiseeinput, [e.target.name]: e.target.value, });
    };

    const BusinessTelChange = (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, "").replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, "$1-$2-$3").replace("--", "-");
        franchiseeInfo.setFranchiseeinput({ ...franchiseeInfo.franchiseeinput, [e.target.name]: e.target.value.split("-")[0] + e.target.value.split("-")[1] + e.target.value.split("-")[2] });
    }

    //   이미지 인코딩 및 프리뷰
    let [firstImgsrc, setFirstImgsrc] = useState("");
    let [firstImgId, setFirstImgId] = useState("");
    const onLoadimage = (e) => {
        const imageFile = e.target.files[0];
        encodingImg(imageFile);

        var frm = new FormData();
        frm.append("files", e.target.files[0]);
        if (e.target.files[0].type !== "image/png" && e.target.files[0].type !== "image/jpeg" && e.target.files[0].type !== "image/gif" && e.target.files[0].type !== "image/jpg") {
            toast.error('이미지 형식의 파일을 올려주세요.', toast.toastDefaultOption);
            return;
        }

        instance({
            method: "post",
            url: `/file`,
            data: frm,
        }).then(function (res) {
            setFirstImgsrc(res.data[0].path);
            setFirstImgId(res.data[0].id);
        });

    };

    const [imgsrc, setImgsrc] = useState("");

    const encodingImg = (imgfile) => {
        if (imgfile.type !== "image/png" && imgfile.type !== "image/jpeg" && imgfile.type !== "image/gif" && imgfile.type !== "image/jpg") {
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(imgfile);
        return new Promise((resolve) => {
            reader.onload = () => {
                setImgsrc(reader.result);
                resolve();
            };
        });
    };
    //   이미지 인코딩 및 프리뷰 끝

    //   사업자 등록번호 확인
    const checkID = (e) => {
        e.preventDefault();
        const value = franchiseeInfo.franchiseeinput.businesscode;
        axios
            .post("https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=SkzUgJzO5Ju61s661QVhT7zHnZghYrBq2kymfg8v46g%2FSFN7VcgiWR3KYtaWyjRvZhfoBRizMSz6%2FiOwK9KOtA%3D%3D", { b_no: [value], })
            .then((response) => {
                if (response.data.match_cnt === 1) {
                    instance({
                        method: "get",
                        url: `/franchisee/` + value + `/check`,
                    }).then(function (res) {
                        if (res.data.result === true) {
                            franchiseeInfo.setBusinessChk("a");
                        } else {
                            franchiseeInfo.setBusinessChk("c");
                        }
                    });
                } else {
                    franchiseeInfo.setBusinessChk("b");
                    inputElement.current.focus();
                    toast.error("사업자 번호를 확인해주세요.", toast.toastDefaultOption);
                }
            })
            .catch(function (error) { });
    };
    //영업시간 상태
    const [timeState, setTimeState] = useState("true");

    //외관 이미지 10개
    const [backImgsrc, setBackImgsrc] = useState([]);
    const onLoadBackImg = (e) => {
        var frm = new FormData();
        frm.append("files", e.target.files[0]);
        if (e.target.files[0].type !== "image/png" && e.target.files[0].type !== "image/jpeg" && e.target.files[0].type !== "image/gif" && e.target.files[0].type !== "image/jpg") {
            toast.error('이미지 형식의 파일을 올려주세요.', toast.toastDefaultOption);
            return;
        }
        instance({
            headers: {
                "Content-Type": "multipart/form-data",
            },
            method: "post",
            url: `/file`,
            data: frm,
        }).then(function (res) {
            if (backImgsrc.length < 10) {
                setBackImgsrc([...backImgsrc, res.data]);
            } else {
                toast.error("외관사진은 최대10개까지만 등록가능합니다.", toast.toastDefaultOption);
            }
        });
    };

    // 가맹점 등록
    const addFranchiseeFunction = () => {
        let time = "";
        if (timeState === "true") {
            time = {
                monday: runningTime[0].dayOff === false ? runningTime[0].fromHour + ":" + runningTime[0].fromMinute + "~" + runningTime[0].toHour + ":" + runningTime[0].toMinute : "휴무",
                tuesday: runningTime[1].dayOff === false ? runningTime[1].fromHour + ":" + runningTime[1].fromMinute + "~" + runningTime[1].toHour + ":" + runningTime[1].toMinute : "휴무",
                wednesday: runningTime[2].dayOff === false ? runningTime[2].fromHour + ":" + runningTime[2].fromMinute + "~" + runningTime[2].toHour + ":" + runningTime[2].toMinute : "휴무",
                thursday: runningTime[3].dayOff === false ? runningTime[3].fromHour + ":" + runningTime[3].fromMinute + "~" + runningTime[3].toHour + ":" + runningTime[3].toMinute : "휴무",
                friday: runningTime[4].dayOff === false ? runningTime[4].fromHour + ":" + runningTime[4].fromMinute + "~" + runningTime[4].toHour + ":" + runningTime[4].toMinute : "휴무",
                saturday: runningTime[5].dayOff === false ? runningTime[5].fromHour + ":" + runningTime[5].fromMinute + "~" + runningTime[5].toHour + ":" + runningTime[5].toMinute : "휴무",
                sunday: runningTime[6].dayOff === false ? runningTime[6].fromHour + ":" + runningTime[6].fromMinute + "~" + runningTime[6].toHour + ":" + runningTime[6].toMinute : "휴무",
            };
        } else {
            time = {
                monday: everyTime.dayOff === false ? everyTime.fromHour + ":" + everyTime.fromMinute + "~" + everyTime.toHour + ":" + everyTime.toMinute : "휴무",
                tuesday: everyTime.dayOff === false ? everyTime.fromHour + ":" + everyTime.fromMinute + "~" + everyTime.toHour + ":" + everyTime.toMinute : "휴무",
                wednesday: everyTime.dayOff === false ? everyTime.fromHour + ":" + everyTime.fromMinute + "~" + everyTime.toHour + ":" + everyTime.toMinute : "휴무",
                thursday: everyTime.dayOff === false ? everyTime.fromHour + ":" + everyTime.fromMinute + "~" + everyTime.toHour + ":" + everyTime.toMinute : "휴무",
                friday: everyTime.dayOff === false ? everyTime.fromHour + ":" + everyTime.fromMinute + "~" + everyTime.toHour + ":" + everyTime.toMinute : "휴무",
                saturday: everyTime.dayOff === false ? everyTime.fromHour + ":" + everyTime.fromMinute + "~" + everyTime.toHour + ":" + everyTime.toMinute : "휴무",
                sunday: everyTime.dayOff === false ? everyTime.fromHour + ":" + everyTime.fromMinute + "~" + everyTime.toHour + ":" + everyTime.toMinute : "휴무",
            };
        }

        // 가맹점 추가시 비어있는 값 찾기.

        if (time) {
            instance({
                method: "post",
                url: `/franchisee`,
                data: {
                    address: {
                        detail: franchiseeInfo.franchiseeinput.detailaddress,
                        jibun: franchiseeInfo.franchiseeaddressInfo.jibun,
                        postalCode:
                            franchiseeInfo.franchiseeaddressInfo.postalCode,
                        road: franchiseeInfo.franchiseeaddressInfo.road,
                    },
                    businessNumber: franchiseeInfo.franchiseeinput.businesscode,
                    firstImg: firstImgsrc,
                    firstImgId: firstImgId,
                    hours: time,
                    intro: franchiseeInfo.franchiseeinput.franchiseeintro,
                    name: franchiseeInfo.franchiseeinput.franchiseename,
                    ownerId: localStorage.getItem("userId"),
                    tel: franchiseeInfo.franchiseeinput.phonenumber,
                    x: franchiseeInfo.franchiseeinput.x,
                    y: franchiseeInfo.franchiseeinput.y,
                },
            }).then(function (res) {
                if (listRefresh) {
                    if ((listRefresh.searchCount % 5) === 0) {
                        listRefresh.setFranPage(Math.ceil(listRefresh.searchCount / 5) + 1);
                    } else listRefresh.setFranPage(Math.ceil(listRefresh.searchCount / 5));
                    listRefresh.setAddFrenModalShow(false);
                } else {
                    setAddFranModal(false);
                }
                toast.success("가맹점 등록이 완료되었습니다.", toast.toastDefaultOption);
                franchiseeInfo.setFranchiseeaddressinfo({
                    ...franchiseeInfo.franchiseeaddressInfo,
                    jibun: "",
                    postalCode: "",
                    road: "",
                });
                franchiseeInfo.setFranchiseeinput({
                    ...franchiseeInfo.franchiseeinput,
                    businesscode: "",
                    franchiseename: "",
                    perspectname: "",
                    detailaddress: "",
                    franchiseeintro: "",
                    displayAddress: "",
                    phonenumber: "",
                });
                instance({
                    method: "post",
                    url: `/franchisee/` + franchiseeInfo.franchiseeinput.businesscode + '/images',
                    // data: backImgsrc,
                    data: backImgsrc.map((ele) => {
                        return ele[0].id
                    })
                });
            });
        } else {
            toast.error("영업 시간을 확인해주세요.", toast.toastDefaultOption);
        }
    };

    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        let tempTel = franchiseeInfo.franchiseeinput.phonenumber.substring(0, franchiseeInfo.franchiseeinput.phonenumber.length - 4);
        if (tempTel.substring(0, 2) === "02") {
            tempTel = tempTel.substring(2);
        } else {
            tempTel = tempTel.substring(3);
        }

        if (franchiseeInfo.businessChk === "a") {
            let chknum = /^[0-9]+$/;
            if (franchiseeInfo.franchiseeinput.franchiseename.length > 30) {
                toast.error("가게명은 30글자를 초과할수 없습니다.", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                });
                return;
            }
            const atkchk = '<script>'
            // 가맹점 추가시 비어있는 값 찾기.
            if (franchiseeInfo.franchiseeinput.franchiseename && !franchiseeInfo.franchiseeinput.franchiseename.includes(atkchk)) {
                if (franchiseeInfo.franchiseeinput.phonenumber.length > 8 && franchiseeInfo.franchiseeinput.phonenumber.length < 12 &&
                    chknum.test(franchiseeInfo.franchiseeinput.phonenumber) &&
                    tempTel.length > 2
                ) {
                    if (firstImgsrc && firstImgId) {
                        if (
                            franchiseeInfo.franchiseeaddressInfo.road &&
                            franchiseeInfo.franchiseeaddressInfo.jibun &&
                            franchiseeInfo.franchiseeaddressInfo.postalCode
                        ) {
                            setActiveStep(
                                (prevActiveStep) => prevActiveStep + 1
                            );
                        } else {
                            toast.error("가맹점 주소를 확인해주세요.", toast.toastDefaultOption);
                        }
                    } else {
                        toast.error("가맹점 대표이미지를 확인해주세요.", toast.toastDefaultOption);
                    }
                } else {
                    toast.error("전화번호 란을 확인해 주세요.", toast.toastDefaultOption);

                }
            } else {
                toast.error("가게 명을 확인해주세요.", toast.toastDefaultOption);
            }
        } else {
            inputElement.current.focus();
            toast.error("사업자 번호를 확인해주세요.", toast.toastDefaultOption);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const [everyTime, setEveryTime] = useState({
        fromHour: "09",
        fromMinute: "00",
        toHour: "18",
        toMinute: "00",
        dayOff: false,
    });
    const [runningTime, setRunningTime] = useState([
        {
            id: 0,
            name: "월",
            fromHour: "09",
            fromMinute: "00",
            toHour: "18",
            toMinute: "00",
            dayOff: false,
        },
        {
            id: 1,
            name: "화",
            fromHour: "09",
            fromMinute: "00",
            toHour: "18",
            toMinute: "00",
            dayOff: false,
        },
        {
            id: 2,
            name: "수",
            fromHour: "09",
            fromMinute: "00",
            toHour: "18",
            toMinute: "00",
            dayOff: false,
        },
        {
            id: 3,
            name: "목",
            fromHour: "09",
            fromMinute: "00",
            toHour: "18",
            toMinute: "00",
            dayOff: false,
        },
        {
            id: 4,
            name: "금",
            fromHour: "09",
            fromMinute: "00",
            toHour: "18",
            toMinute: "00",
            dayOff: false,
        },
        {
            id: 5,
            name: "토",
            fromHour: "09",
            fromMinute: "00",
            toHour: "18",
            toMinute: "00",
            dayOff: false,
        },
        {
            id: 6,
            name: "일",
            fromHour: "09",
            fromMinute: "00",
            toHour: "18",
            toMinute: "00",
            dayOff: false,
        },
    ]);

    const setTimeChange = (e, id) => {
        setRunningTime(
            runningTime.map((time) =>
                time.id === id
                    ? { ...time, [e.target.name]: e.target.value }
                    : time
            )
        );
    };

    const onToggle = (id) => {
        setRunningTime(
            runningTime.map((time) =>
                time.id === id ? { ...time, dayOff: !time.dayOff } : time
            )
        );
    };

    const hours = [];
    for (let i = 0; i < 24; i++) {
        if (i < 10) hours.push("0" + i);
        else hours.push(i.toString());
    }

    const minute = ["00", "10", "20", "30", "40", "50"];

    function backImgDel(imageId) {
        setBackImgsrc((backImgsrc).filter((ele) => ele[0].id !== imageId[0].id));
    }

    return (
        <>
            <Container>
                <Row>
                    <Stepper activeStep={activeStep}>
                        {steps.map((label, index) => {
                            const stepProps = {};
                            const labelProps = {};
                            return (
                                <Step key={label} {...stepProps}>
                                    <StepLabel {...labelProps}>
                                        {label}
                                    </StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                    {activeStep === steps.length ? (
                        <React.Fragment>
                            <Typography sx={{ mt: 2, mb: 1 }}>
                                All steps completed - you&apos;re finished
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    pt: 2,
                                }}
                            >
                                <Box sx={{ flex: "1 1 auto" }} />
                            </Box>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            {activeStep === 0 ? (
                                <>
                                    <Row>
                                        <Form.Group
                                            className="mb-3 AddFran"
                                            controlId="formBasicEmail"
                                        >
                                            <Form.Label className="AddFran--BusinessNum">
                                                사업자 번호<span className='mypage__caution AddFran--awesome'><FontAwesomeIcon icon={faExclamationCircle} />필수</span>
                                            </Form.Label>
                                            {franchiseeInfo.franchiseeinput
                                                .businesscode.length === 0 ? (
                                                <></>
                                            ) : null}
                                            {franchiseeInfo.businessChk ===
                                                "a" ? (
                                                <span id="AddFran--BusinessNumTrue">
                                                    (사업자번호 확인완료.)
                                                </span>
                                            ) : franchiseeInfo.franchiseeinput
                                                .businesscode.length === 0 ? (
                                                <></>
                                            ) : franchiseeInfo.businessChk ===
                                                "b" ? (
                                                <span className="AddFran--BusinessNumFalse">
                                                    (국세청에 등록되지 않은
                                                    사업자등록번호입니다.)
                                                </span>
                                            ) : franchiseeInfo.businessChk ===
                                                "c" ? (
                                                <span className="AddFran--BusinessNumFalse">
                                                    (이미 등록된 사업자
                                                    번호입니다.)
                                                </span>
                                            ) : null}
                                            <InputGroup className="mb-3">
                                                <Form.Control
                                                    onChange={onchangeValue}
                                                    ref={franchiseeInfo.inputElement}
                                                    type="input"
                                                    autoFocus
                                                    maxLength="10"
                                                    placeholder="-를 제외한 10자리를 입력해주세요."
                                                    value={franchiseeInfo.franchiseeinput.businesscode.replace(/[^0-9]/g, '')}
                                                    name="businesscode"
                                                    className="AddFran--BusinessNumInput"
                                                    style={
                                                        franchiseeInfo.businessChk ===
                                                            "a"
                                                            ? { background: "#e8f0fe", }
                                                            : null
                                                    }
                                                />
                                                <button className="AddFran--BusinessChkBtn" onClick={checkID}>
                                                    확인
                                                </button>
                                                <div id="AddFran-FirstImg">대표 이미지<span className='mypage__caution AddFran--awesome'><FontAwesomeIcon icon={faExclamationCircle} />필수</span></div>
                                            </InputGroup>
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Col sm={5}>
                                            <div id="addFran-inputbox" onChange={onLoadimage} >
                                                <span id="addFran-inputbox--filebox">
                                                    <label id="addFran-inputbox__imagelabel" htmlFor="ex_file" style={{ backgroundImage: "url(" + imgsrc + ")" }}>
                                                        <div className="addFran-inputbox__text" id="fileCircle">+</div>
                                                    </label>
                                                    <input accept=".gif, .jpg, .png" id="ex_file" type="file" />
                                                </span>
                                            </div>
                                        </Col>
                                        <Col>
                                            <Form.Label>가맹점 이름<span className='mypage__caution AddFran--awesome'><FontAwesomeIcon icon={faExclamationCircle} />필수</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="가맹점명을 적어주세요."
                                                onChange={onchangeValue}
                                                value={franchiseeInfo.franchiseeinput.franchiseename}
                                                maxLength="44"
                                                name="franchiseename"
                                                className="AddFran--input"
                                            />
                                            <Form.Label>전화번호<span className='mypage__caution AddFran--awesome'><FontAwesomeIcon icon={faExclamationCircle} />필수</span></Form.Label>
                                            <Form.Control
                                                placeholder="-를 제외하고 적어주세요."
                                                type="input"
                                                defaultValue={franchiseeInfo.franchiseeinput.phonenumber.replace(/[^0-9]/g, "").replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, "$1-$2-$3").replace("--", "-")}
                                                onChange={(e) => { BusinessTelChange(e) }}
                                                // onChange={onchangeValue}
                                                // value={franchiseeInfo.franchiseeinput.phonenumber.replace(/[^0-9]/g, '').replace(/(^02|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, "$1-$2-$3").replace("--", "-")}
                                                maxLength={13}
                                                className="AddFran--input"
                                                name="phonenumber"
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="franchiseeadd-container--post">
                                        <Col className="mt-3 franchiseeadd-container__postcol">
                                            <InputGroup
                                                style={{ width: "300px" }}
                                            >
                                                <Form.Control
                                                    id="postcode--addressNumber"
                                                    type="text"
                                                    placeholder="우편번호"
                                                    name="postcode"
                                                    className="AddFran--input"
                                                    value={franchiseeInfo.franchiseeaddressInfo.postalCode}
                                                    readOnly
                                                />
                                                <Button
                                                    variant="primary"
                                                    onClick={searchAddressClick}
                                                >
                                                    우편번호 검색
                                                </Button>
                                            </InputGroup>
                                            <Form.Control
                                                type="text"
                                                placeholder="주소"
                                                id="postcode--address"
                                                name="fulladdress"
                                                className="AddFran--input"
                                                value={franchiseeInfo.franchiseeaddressInfo.road}
                                                readOnly
                                            />
                                            <Form.Control
                                                type="text"
                                                placeholder="상세 주소"
                                                id="postcode-detailAddress"
                                                onChange={onchangeValue}
                                                className="AddFran--input"
                                                maxLength="44"
                                                value={franchiseeInfo.franchiseeinput.detailaddress}
                                                name="detailaddress"
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="AddFrenchisee-mapzone">
                                        <NaverMap
                                            className="AddFrenchisee-mapzone__map"
                                            mapDivId={'maps-getting-started-uncontrolled'}
                                            style={{
                                                width: '330px',
                                                height: '200px',
                                            }}
                                            center={{ lat: mapLatLng.lat, lng: mapLatLng.lng }}
                                            defaultZoom={16}
                                            draggable={false}
                                            scaleControl={false}
                                            scrollWheel={false}
                                        >
                                            <Marker
                                                position={{ lat: mapLatLng.lat, lng: mapLatLng.lng }}
                                                draggable={false}
                                            // animation={window.naver.maps.Animation.BOUNCE}
                                            ></Marker>
                                        </NaverMap>
                                    </Row>
                                </>
                            ) : (activeStep === 1 ? (
                                <>
                                    <Row>
                                        <Col>가맹점 외관이미지 <span className='businessDetailInfo--InfoInput-text' id="businessDetailInfo--InfoInput-plusCount" style={backImgsrc.length === 10 ? { color: 'red' } : null}>({backImgsrc.length}/10)</span> <div id="addFranchisee-backImgText">(최대 10개까지 등록가능합니다.)</div></Col>
                                    </Row>
                                    <Row className="AddFran-BackImgRow">
                                        <Col className="AddFran-BackImgCol">
                                            <span className="AddFran--InfoInput-filebox" onChange={onLoadBackImg}>
                                                <label id="AddFran--InfoInput-label" htmlFor="ex_filename">
                                                    <div className='AddFran--InfoInput-label-text' id="fileCircles">+</div>
                                                </label>
                                                <input accept=".gif, .jpg, .png" type="file" id="ex_filename" className="upload-hidden" disabled={backImgsrc.length > 9 ? true : false} />
                                            </span>
                                            {backImgsrc.map((ele, idx) => {
                                                return (
                                                    <>
                                                        <span className="AddFran-backImgZone" key={idx}>
                                                            <img className='AddFran--backImg' key={idx} id={`backImg${idx}`} alt="가게이미지" src={`${process.env.REACT_APP_SERVER_URL}${ele[0].path}`} />
                                                            <button className="AddFran-backImg-DelBtn" onClick={() => { backImgDel(ele) }}>x</button>
                                                        </span>
                                                    </>
                                                )
                                            })}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Control
                                                as="textarea"
                                                type="text"
                                                placeholder="가맹점 소개글을 써주세요"
                                                className="AddFran--FranIntro"
                                                onChange={onchangeValue}
                                                value={franchiseeInfo.franchiseeinput.franchiseeintro}
                                                name="franchiseeintro"
                                            />
                                        </Col>
                                    </Row>
                                </>) : (
                                <>
                                    <Row>
                                        <Col>
                                            <Button
                                                className="AddFran--timeBtn"
                                                onClick={() => { setTimeState("true"); }}
                                                style={
                                                    timeState === "true"
                                                        ? {
                                                            background:
                                                                "#0b5ed7",
                                                            color: "white",
                                                            border: "1px solid #0b5ed7",
                                                        }
                                                        : null
                                                }
                                            >
                                                요일별로 다름
                                            </Button>
                                        </Col>
                                        <Col>
                                            <Button
                                                className="AddFran--timeBtn"
                                                onClick={() => { setTimeState("false"); }}
                                                style={
                                                    timeState === "false"
                                                        ? {
                                                            background:
                                                                "#0b5ed7",
                                                            color: "white",
                                                            border: "1px solid #0b5ed7",
                                                        }
                                                        : null
                                                }
                                            >
                                                모든 영업일이 같음
                                            </Button>
                                        </Col>
                                        {timeState === "true" ? (
                                            <>
                                                {runningTime.map((ele, idx) => {
                                                    return (
                                                        <div className="runningTime" key={idx}>
                                                            <span className="runningTime--dayLabel">
                                                                {ele.name} :
                                                            </span>
                                                            <select
                                                                className="runningTime--Time"
                                                                disabled={ele.dayOff}
                                                                name="fromHour"
                                                                defaultValue={ele.fromHour}
                                                                onChange={(e) => { setTimeChange(e, idx); }}
                                                            >
                                                                {hours.map((ele, idx) => {
                                                                    return (
                                                                        <option className="runningTime--Hours" key={idx}>{ele}</option>
                                                                    );
                                                                }
                                                                )}
                                                            </select>
                                                            <span>:</span>
                                                            <select
                                                                className="runningTime--Time"
                                                                name="fromMinute"
                                                                disabled={ele.dayOff}
                                                                defaultValue={ele.fromMinute}
                                                                onChange={(e) => {
                                                                    setTimeChange(e, idx);
                                                                }}
                                                            >
                                                                {minute.map((ele, idx) => {
                                                                    return (
                                                                        <option className="runningTime--Minute" key={idx}>{ele}</option>
                                                                    );
                                                                }
                                                                )}
                                                            </select>
                                                            <span className="runningTime--middle">
                                                                ~
                                                            </span>
                                                            <select
                                                                className="runningTime--Time"
                                                                name="toHour"
                                                                disabled={ele.dayOff}
                                                                defaultValue={ele.toHour}
                                                                onChange={(e) => { setTimeChange(e, idx); }}
                                                            >
                                                                {hours.map((ele, idx) => {
                                                                    return (
                                                                        <option className="runningTime--Hours" key={idx}>{ele}</option>
                                                                    );
                                                                }
                                                                )}
                                                            </select>
                                                            <span>:</span>
                                                            <select
                                                                className="runningTime--Time"
                                                                name="toMinute"
                                                                disabled={ele.dayOff}
                                                                defaultValue={ele.toMinute}
                                                                onChange={(e) => { setTimeChange(e, idx); }}
                                                            >
                                                                {minute.map((ele, idx) => {
                                                                    return (
                                                                        <option className="runningTime--Minute" key={idx}>{ele}</option>
                                                                    );
                                                                }
                                                                )}
                                                            </select>
                                                            <input
                                                                className="runningTime--dayOff"
                                                                type="checkbox"
                                                                value="휴무"
                                                                checked={ele.dayOff || ""}
                                                                id={`${ele.id}`}
                                                                onChange={() => { onToggle(idx); }}
                                                            />
                                                            <label htmlFor={`${ele.id}`}>
                                                                휴무
                                                            </label>
                                                        </div>
                                                    );
                                                })}
                                            </>
                                        ) : timeState === "false" ? (
                                            <div className="runningTime">
                                                <select
                                                    className="runningTime--Time"
                                                    disabled={everyTime.dayOff}
                                                    name="fromHour"
                                                    defaultValue={everyTime.fromHour}
                                                    onChange={(e) =>
                                                        setEveryTime({
                                                            ...everyTime,
                                                            [e.target.name]: e.target.value,
                                                        })
                                                    }
                                                >
                                                    {hours.map((ele, idx) => {
                                                        return (
                                                            <option className="runningTime--Hours">
                                                                {ele}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                                <span>:</span>
                                                <select
                                                    className="runningTime--Time"
                                                    disabled={everyTime.dayOff}
                                                    defaultValue={everyTime.fromMinute}
                                                    name="fromMinute"
                                                    onChange={(e) =>
                                                        setEveryTime({
                                                            ...everyTime,
                                                            [e.target.name]: e.target.value,
                                                        })
                                                    }
                                                >
                                                    {minute.map((ele, idx) => {
                                                        return (
                                                            <option className="runningTime--Minute">
                                                                {ele}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                                <span className="runningTime--middle">
                                                    ~
                                                </span>
                                                <select
                                                    className="runningTime--Time"
                                                    disabled={everyTime.dayOff}
                                                    defaultValue={everyTime.toHour}
                                                    name="toHour"
                                                    onChange={(e) =>
                                                        setEveryTime({
                                                            ...everyTime,
                                                            [e.target.name]: e.target.value,
                                                        })
                                                    }
                                                >
                                                    {hours.map((ele, idx) => {
                                                        return (
                                                            <option className="runningTime--Hours">
                                                                {ele}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                                <span>:</span>
                                                <select
                                                    className="runningTime--Time"
                                                    name="toMinute"
                                                    defaultValue={everyTime.toMinute}
                                                    disabled={everyTime.dayOff}
                                                    onChange={(e) =>
                                                        setEveryTime({
                                                            ...everyTime,
                                                            [e.target.name]: e.target.value,
                                                        })
                                                    }
                                                >
                                                    {minute.map((ele, idx) => {
                                                        return (
                                                            <option className="runningTime--Minute">
                                                                {ele}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                                <input
                                                    name="dayOff"
                                                    type="checkbox"
                                                    id="dayOff"
                                                    value="휴무"
                                                    checked={everyTime.dayOff || ""}
                                                    onChange={(e) =>
                                                        setEveryTime({
                                                            ...everyTime,
                                                            [e.target.name]: !everyTime.dayOff,
                                                        })
                                                    }
                                                />
                                                <label htmlFor="dayOff">휴무</label>
                                            </div>
                                        ) : null}
                                    </Row>
                                </>))
                            }
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    pt: 2,
                                }}
                            >
                                <button
                                    color="inherit"
                                    disabled={activeStep === 0}
                                    className="AddFran--handleBtn"
                                    onClick={handleBack}
                                    sx={{ mr: 1 }}
                                    style={
                                        activeStep === 0
                                            ? {
                                                opacity: "1",
                                                cursor: "default",
                                            }
                                            : null
                                    }
                                >
                                    뒤로
                                </button>
                                <Box sx={{ flex: "1 1 auto" }} />
                                {activeStep === 0 ? (
                                    <button onClick={handleNext} className="AddFran--handleBtn">
                                        다음
                                    </button>
                                ) : (activeStep === 1 ? (<button onClick={handleNext} className="AddFran--handleBtn">
                                    다음
                                </button>) : (<button onClick={addFranchiseeFunction} className="AddFran--handleBtn">
                                    등록
                                </button>))}
                            </Box>
                        </React.Fragment >
                    )}
                </Row >
            </Container >
        </>
    );
}

export default AddFranchisee;