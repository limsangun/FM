import React, { useEffect, useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Tab, Tabs, Card, ListGroup, Row, Col, Accordion, Modal, Button, Form, InputGroup, FloatingLabel } from "react-bootstrap";
import "../css/SearchDetail.css";
import { BsTelephoneFill } from 'react-icons/bs';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { BiTimeFive } from 'react-icons/bi';
import { instance } from "./AxiosConfig/AxiosInterceptor";
import { TbBoxOff } from 'react-icons/tb';
import { BsChevronDoubleLeft } from 'react-icons/bs';
import { AiOutlineCamera } from 'react-icons/ai';
import ModalImage from "react-modal-image";
import Skeleton from '@mui/material/Skeleton';

function getMenu(detailTogFun, setDetailMenu, setDefaultMenuShow) {
    instance({
        method: "get",
        url:
            `/franchisee/` + detailTogFun.clickMarkerBN + `/menus`,
    })
        .then(function (res) {
            setDetailMenu(res.data);
            setDefaultMenuShow(false);
        })
        .catch(function (error) {
            if (error.response.status === 404) {
                setDetailMenu([]);
                setDefaultMenuShow(true);
            }
        });
}

function SearchDetail({ detailTogOpen, detailTogClose, detailTogObj }) {
    const [defaultMenuShow, setDefaultMenuShow] = useState(false);

    const [runningTime, setRunningTime] = useState({
        monday: "정보 없음",
        tuesday: "정보 없음",
        wednesday: "정보 없음",
        thursday: "정보 없음",
        friday: "정보 없음",
        saturday: "정보 없음",
        sunday: "정보 없음"
    })

    const [detailInfo, setDetailInfo] = useState({
        firstImg: '/api/v1/file/a70427302ce343c2bd29054e7dd82cc0-default-image.jpg',
        address: {
            postalCode: "",
            road: "",
        },
        tel: '00000000000',
        intro: '',
        name: ''
    });

    const [detailMenu, setDetailMenu] = useState([
        {
            image: { path: "" }
        }
    ]);

    const [outImg, setOutImg] = useState([{
        name: '',
        path: '',
        id: ''
    }]);

    const [key, setKey] = useState('info');

    useEffect(() => {
        // {}으로 초기화가 아닌 default 객체로 초기화
        setDetailInfo({
            firstImg: '/api/v1/file/a70427302ce343c2bd29054e7dd82cc0-default-image.jpg',
            address: {
                postalCode: "",
                road: "",
            },
            tel: '00000000000',
            intro: '',
            name: ''
        });
        setOutImg([]);
        setVisible(false)
        if (detailTogObj.detailTog === true) {
            setKey('info');
            // 외관 이미지 조회통신
            instance({
                method: "get",
                url: `/franchisee/` + detailTogObj.clickMarkerBN + `/images`
            }).then(function (res) {
                // setOutImg([]);
                setOutImg(res.data);
            }).catch(function (error) {
                setOutImg([]);
            })

            instance({
                method: "get",
                url: `/franchisee/` + detailTogObj.clickMarkerBN,
            }).then(function (res) {
                // setTimeout(()=>{setDetailInfo(res.data)},300);
                setDetailInfo(res.data);
            }).then(function () {
                // 영업시간 조회 통신
                instance({
                    method: "get",
                    url: `/franchisee/` + detailTogObj.clickMarkerBN + `/schedule`
                }).then(function (res) {
                    setRunningTime(res.data);
                })
            });
        }
    }, [detailTogOpen])

    const [visible, setVisible] = useState(false);

    const checkStringCount = (value, count) => {
        value = String(value);
        if (value.length > count) {
            return value.substr(0, count - 1) + ' ...';
        } else return value;
    };

    // 메뉴 디테일 모달
    const [showMenuDetail, setShowMenuDetail] = useState(false);
    const [menuNum, setMenuNum] = useState('');
    const menuDetailClose = () => setShowMenuDetail(false);
    const menuDetailShow = (idx) => { setShowMenuDetail(true); setMenuNum(idx); }

    const detailOffOptions = {
        scroll: true,
        backdrop: false
    }
    return (
        <>
            <Offcanvas
                className={"searchDeatil-offcanvas"}
                show={detailTogObj.detailTog}
                onHide={detailTogClose}
                placement={"start"}
                {...detailOffOptions}
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                        {(() => {
                            if (detailInfo.name === '') {
                                return (
                                    <Skeleton variant="rectangular" width={300} height={30} />
                                );
                            } else {
                                return (
                                    detailInfo.name
                                );
                            }
                        })()}
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body
                    className={"searchDeatil-offcanvasbody--bodyzone"}
                >
                    <div className="offcanvas-body--titlezone">
                        <div id="offcanvas-body--firstImg">
                            {(() => {
                                if (detailInfo.name === '') {
                                    return (
                                        <Skeleton variant="rectangular" width={334} height={200} />
                                    );
                                } else {
                                    if (outImg.length !== 0) {
                                        return (
                                            <>
                                                <img
                                                    src={`${process.env.REACT_APP_SERVER_URL}${detailInfo.firstImg}`}
                                                    alt='가맹점 대표이미지'
                                                    id='firstImgzone'
                                                />
                                                <div id="outImgzone">
                                                    {(() => {
                                                        switch (outImg.length) {
                                                            case 1: return (
                                                                <>
                                                                    <img src={process.env.REACT_APP_SERVER_URL + outImg[0].path} alt="외관이미지" style={{ width: '100%', height: '100%' }} />
                                                                </>
                                                            );
                                                            case 2: return (
                                                                <>
                                                                    <img src={process.env.REACT_APP_SERVER_URL + outImg[0].path} alt="외관이미지" style={{ width: '100%', height: '100%' }} />
                                                                </>
                                                            );
                                                            case 3: return (
                                                                <>
                                                                    <img src={process.env.REACT_APP_SERVER_URL + outImg[0].path} alt="외관이미지" style={{ width: '100%', height: '100%' }} />
                                                                </>
                                                            );
                                                            case 4: return (
                                                                <>
                                                                    <img src={process.env.REACT_APP_SERVER_URL + outImg[0].path} alt="외관이미지" style={{ width: '50%', height: '50%' }} />
                                                                    <img src={process.env.REACT_APP_SERVER_URL + outImg[1].path} alt="외관이미지" style={{ width: '50%', height: '50%' }} />
                                                                    <img src={process.env.REACT_APP_SERVER_URL + outImg[2].path} alt="외관이미지" style={{ width: '50%', height: '50%' }} />
                                                                    <img src={process.env.REACT_APP_SERVER_URL + outImg[3].path} alt="외관이미지" style={{ width: '50%', height: '50%' }} />
                                                                </>
                                                            );
                                                            default: return (
                                                                <>
                                                                    <img src={process.env.REACT_APP_SERVER_URL + outImg[0].path} alt="외관이미지" style={{ width: '50%', height: '50%' }} />
                                                                    <img src={process.env.REACT_APP_SERVER_URL + outImg[1].path} alt="외관이미지" style={{ width: '50%', height: '50%' }} />
                                                                    <img src={process.env.REACT_APP_SERVER_URL + outImg[2].path} alt="외관이미지" style={{ width: '50%', height: '50%' }} />
                                                                    <div style={{ width: '50%', height: '50%', backgroundImage: `url(${process.env.REACT_APP_SERVER_URL}${outImg[3].path})`, float: 'right' }} type='button' onClick={() => { setKey('outlook') }}>
                                                                        <div className='searchDetail--outlookImg-label-img' id="fileCircle"><AiOutlineCamera /></div>
                                                                        <div className='searchDetail--outlookImg-label-text'>사진 더보기</div>
                                                                    </div>
                                                                </>
                                                            );

                                                        }
                                                    })()}
                                                </div>
                                            </>
                                        );
                                    } else {
                                        return (
                                            <img
                                                src={`${process.env.REACT_APP_SERVER_URL}${detailInfo.firstImg}`}
                                                alt='가맹점 대표이미지'
                                                id='onlyFirstImgzone'
                                            />
                                        );
                                    }
                                }
                            })()}
                        </div>
                        <div id="offcanvas-body--titlezone--intro">
                            {(() => {
                                if (detailInfo.name === '') {
                                    return (
                                        <h3><Skeleton variant="rectangular" width={336} height={34} /></h3>
                                    );
                                } else {
                                    return (
                                        <h3>{detailInfo.name}</h3>
                                    );
                                }
                            })()}
                            {(() => {
                                if (detailInfo.name === '') {
                                    return (
                                        <p><Skeleton variant="rectangular" width={336} height={25} /></p>
                                    );
                                } else {
                                    return (
                                        visible ?
                                            <p onClick={() => { setVisible(!visible) }}>{detailInfo.intro}</p> :
                                            <p onClick={() => { setVisible(!visible) }}>
                                                {(() => {
                                                    if (detailInfo.intro.length > 47) {
                                                        return (
                                                            <>
                                                                {detailInfo.intro.substring(0, 47)}
                                                                <span style={{ 'fontWeight': 600, 'color': 'blue' }}>...더 보기</span>
                                                            </>
                                                        )
                                                    } else {
                                                        return (
                                                            detailInfo.intro
                                                        )
                                                    }
                                                })()}
                                            </p>
                                    )
                                }
                            })()}
                        </div>
                    </div>
                    <div className="searchDeatil-offcanvasbody--buttonzone">
                        <Tabs
                            activeKey={key}
                            className="mb-2 searchDeatil-offcanvasbody--buttontab"
                            onSelect={(option) => {
                                setKey(option);
                                if (option === "menu") {
                                    getMenu(detailTogObj, setDetailMenu, setDefaultMenuShow);
                                }
                            }}
                        >
                            <Tab eventKey="info" title="정보">
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <Row>
                                            <Col sm='1'>
                                                <HiOutlineLocationMarker style={{ color: '#4287f5' }} />
                                            </Col>
                                            <Col sm='11'>
                                                {detailInfo.address.road}  ({detailInfo.address.postalCode})
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col sm='1'>
                                                <BsTelephoneFill style={{ color: '#4287f5' }} />
                                            </Col>
                                            <Col sm='11'>
                                                {detailInfo.tel.substring(0, 2) === "02" ?
                                                    detailInfo.tel.replace(
                                                        /(\d{2})(\d{3,4})(\d{4})/,
                                                        "$1-$2-$3"
                                                    )
                                                    : detailInfo.tel.replace(
                                                        /(\d{3})(\d{3,4})(\d{4})/,
                                                        "$1-$2-$3"
                                                    )
                                                }
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item style={{ borderBottom: '1px solid rgba(0,0,0,.125)' }}>
                                        <Row id="searchDeatil-offcanvasbody--runtimezome">
                                            <Accordion defaultActiveKey="0">
                                                <Accordion.Item eventKey="0">
                                                    <Accordion.Header>
                                                        <Col sm='1'>
                                                            <BiTimeFive style={{ color: '#4287f5' }} />
                                                        </Col>
                                                        <Col sm='11'>
                                                            영업시간
                                                        </Col>
                                                    </Accordion.Header>
                                                    <Accordion.Body>
                                                        <Row>
                                                            <Col sm='1'>월</Col>
                                                            <Col sm='11'>{runningTime.monday}</Col>
                                                        </Row>
                                                        <Row>
                                                            <Col sm='1'>화</Col>
                                                            <Col sm='11'>{runningTime.tuesday}</Col>
                                                        </Row>
                                                        <Row>
                                                            <Col sm='1'>수</Col>
                                                            <Col sm='11'>{runningTime.wednesday}</Col>
                                                        </Row>
                                                        <Row>
                                                            <Col sm='1'>목</Col>
                                                            <Col sm='11'>{runningTime.thursday}</Col>
                                                        </Row>
                                                        <Row>
                                                            <Col sm='1'>금</Col>
                                                            <Col sm='11'>{runningTime.friday}</Col>
                                                        </Row>
                                                        <Row>
                                                            <Col sm='1'>토</Col>
                                                            <Col sm='11'>{runningTime.saturday}</Col>
                                                        </Row>
                                                        <Row>
                                                            <Col sm='1'>일</Col>
                                                            <Col sm='11'>{runningTime.sunday}</Col>
                                                        </Row>
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            </Accordion>
                                        </Row>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Tab>
                            <Tab eventKey="menu" title="메뉴">
                                {defaultMenuShow ? (
                                    <div className="searchDeatil-offcanvasbody--defaultMenuZone">
                                        <h1><TbBoxOff style={{ color: '#4187f5' }} /></h1>
                                        <p>가맹점에 등록된 메뉴가 없습니다</p>
                                    </div>
                                ) : (
                                    <div>
                                        {Array.from({ length: detailMenu.length }).map((_, idx) => (
                                            <div key={idx}>
                                                <Row type='button' onClick={() => { menuDetailShow(idx) }}>
                                                    <Card
                                                        className={"searchDeatil-offcanvasbody--cardzone mb-3"}
                                                    >
                                                        <Card.Body>
                                                            <Card.Img
                                                                variant="left"
                                                                src={`${process.env.REACT_APP_SERVER_URL}${detailMenu[idx].image.path}`}
                                                                alt="대체이미지"
                                                            />
                                                            <Card.Title>
                                                                {checkStringCount(detailMenu[idx].name, 10)}
                                                            </Card.Title>
                                                            <Card.Subtitle className="mb-2 priceText">
                                                                {`${detailMenu[idx].price}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 원
                                                            </Card.Subtitle>
                                                            <Card.Text>
                                                                {checkStringCount(detailMenu[idx].description, 33)}
                                                            </Card.Text>
                                                        </Card.Body>
                                                    </Card>
                                                </Row>
                                            </div>
                                        ))}
                                        {(() => {
                                            if (showMenuDetail === true) {
                                                return (
                                                    <Modal show={showMenuDetail} onHide={menuDetailClose}>
                                                        <Modal.Header closeButton>
                                                            <Modal.Title>
                                                                {detailMenu[menuNum].name}
                                                            </Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body>
                                                            <Row>
                                                                <Col sm={5}>
                                                                    <div id="addMenu-inputbox">
                                                                        <label id="addMenu-inputbox__imagelabel" style={{ backgroundImage: "url(" + detailMenu[menuNum].image.path + ")", cursor: 'default' }}>
                                                                        </label>
                                                                    </div>
                                                                </Col>
                                                                <Col>
                                                                    <Form.Label>메뉴 이름</Form.Label>
                                                                    <Form.Control name="name" type="text" disabled={true} placeholder="메뉴이름을 적어주세요." id="menuName" maxLength='10' autoFocus value={detailMenu[menuNum].name} />
                                                                    <Form.Label>메뉴 가격</Form.Label>
                                                                    <InputGroup className="mb-3">
                                                                        <Form.Control name="price" type="text" disabled={true} id="onemenuprice" placeholder="메뉴가격을 적어주세요." value={`${detailMenu[menuNum].price}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                                                                        <InputGroup.Text id="basic-addon2">원</InputGroup.Text>
                                                                    </InputGroup>
                                                                </Col>
                                                            </Row>
                                                            <FloatingLabel label="메뉴 소개">
                                                                <Form.Control className="addMenuModalIntro" disabled={true} name="description" as="textarea" placeholder="메뉴 소개" value={detailMenu[menuNum].description} />
                                                            </FloatingLabel>
                                                        </Modal.Body>
                                                        <Modal.Footer>
                                                            <Button variant="secondary" onClick={menuDetailClose}>
                                                                닫기
                                                            </Button>
                                                        </Modal.Footer>
                                                    </Modal>
                                                )
                                            }
                                        })()}

                                    </div>
                                )}

                            </Tab>
                            <Tab eventKey="outlook" title="외관사진">
                                {(() => {
                                    if (outImg.length === 0) {
                                        return (
                                            <div className="searchDeatil-offcanvasbody--defaultMenuZone">
                                                <h1><TbBoxOff style={{ color: '#4187f5' }} /></h1>
                                                <p>가맹점에 등록된 외관사진이 없습니다</p>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div className="searchDeatil-offcanvasbody--outlookzone" style={{ display: 'inline-block' }}>
                                                {Array.from({ length: outImg.length }).map((_, idx) => (
                                                    <ModalImage
                                                        key={idx}
                                                        small={process.env.REACT_APP_SERVER_URL + outImg[idx].path}
                                                        large={process.env.REACT_APP_SERVER_URL + outImg[idx].path}
                                                    />
                                                ))}
                                            </div>
                                        )
                                    }
                                })()}
                            </Tab>
                        </Tabs>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
            {(() => {
                if (detailTogObj.detailTog === true) {
                    return (
                        <button id='btnSearchListClose' style={{ left: '850px' }} onClick={detailTogClose}>
                            <BsChevronDoubleLeft style={{ color: 'gray', marginLeft: '-4px' }} type='button'/>
                        </button>
                    )
                }
            })()}
        </>
    );
}

export default SearchDetail;