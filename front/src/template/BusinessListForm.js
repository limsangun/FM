import { useEffect, useState } from "react";
import { Row, Button, ListGroup, Form, Modal, FloatingLabel, InputGroup, Accordion, Col, } from "react-bootstrap";
// import DelMenuModals from "../pages/DelMenuModals";
import { instance } from "./AxiosConfig/AxiosInterceptor";
import { TbBoxOff } from "react-icons/tb";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 메뉴추가 함수
function menuAdd(franchiseeList, menuDescription, menuName, menuPrice, menuImgId, menuList, setMenuList, setMenuAddModaShow, menuImgsrc) {
    if (menuName.length === 0 || menuPrice.length === 0) {
        toast.error('메뉴이름또는메뉴가격을확인해주세요.', toast.toastdefaultOption);
        return;
    } else if (menuImgsrc === "/api/v1/file/a70427302ce343c2bd29054e7dd82cc0-default-image.jpg") {
        instance({
            method: "post",
            url: `/franchisee/` + franchiseeList.businessNumber + `/menu`,
            data: {
                description: menuDescription,
                name: menuName,
                price: menuPrice,
            },
        }).then(function (res) {
            let tempObj = {
                id: res.data.id,
                businessNumber: res.data.businessNumber,
                description: res.data.description,
                createDate: res.data.createDate,
                name: res.data.name,
                price: res.data.price,
                image: {
                    path: menuImgsrc,
                },
            };
            setMenuList(menuList.concat(tempObj));
        });
    } else {
        instance({
            method: "post",
            url: `/franchisee/` + franchiseeList.businessNumber + `/menu`,
            data: {
                description: menuDescription,
                name: menuName,
                price: menuPrice,
                imageId: menuImgId,
            },
        })
            .then(function (res) {
                //res.data와 menuList의 객체 구조가 다름(res.data에는 image객체가 없음)
                //따라서 같게 만듬
                let tempObj = {
                    id: res.data.id,
                    businessNumber: res.data.businessNumber,
                    description: res.data.description,
                    createDate: res.data.createDate,
                    name: res.data.name,
                    price: res.data.price,
                    image: {
                        path: menuImgsrc,
                    },
                };
                setMenuList(menuList.concat(tempObj));
            })
            .catch((err) => { });
    }
    setMenuAddModaShow(false);
}

//가맹점리스트 정보 수정 함수
function FranUpdate(isEdit, setIsEdit, franchiseeList, firstImgsrc, ordertime, setFranchiseeList, setInput, input) {
    setIsEdit(!isEdit);
    setInput({
        tel: franchiseeList.tel,
        intro: franchiseeList.intro,
    });
    let time = "";
    time = {
        monday: ordertime[0].dayOff === false ? ordertime[0].fromHour + ":" + ordertime[0].fromMinute + "~" + ordertime[0].toHour + ":" + ordertime[0].toMinute : "휴무",
        tuesday: ordertime[1].dayOff === false ? ordertime[1].fromHour + ":" + ordertime[1].fromMinute + "~" + ordertime[1].toHour + ":" + ordertime[1].toMinute : "휴무",
        wednesday: ordertime[2].dayOff === false ? ordertime[2].fromHour + ":" + ordertime[2].fromMinute + "~" + ordertime[2].toHour + ":" + ordertime[2].toMinute : "휴무",
        thursday: ordertime[3].dayOff === false ? ordertime[3].fromHour + ":" + ordertime[3].fromMinute + "~" + ordertime[3].toHour + ":" + ordertime[3].toMinute : "휴무",
        friday: ordertime[4].dayOff === false ? ordertime[4].fromHour + ":" + ordertime[4].fromMinute + "~" + ordertime[4].toHour + ":" + ordertime[4].toMinute : "휴무",
        saturday: ordertime[5].dayOff === false ? ordertime[5].fromHour + ":" + ordertime[5].fromMinute + "~" + ordertime[5].toHour + ":" + ordertime[5].toMinute : "휴무",
        sunday: ordertime[6].dayOff === false ? ordertime[6].fromHour + ":" + ordertime[6].fromMinute + "~" + ordertime[6].toHour + ":" + ordertime[6].toMinute : "휴무",
    };
    let tempTel = franchiseeList.tel.substring(0, franchiseeList.tel.length - 4);

    if (tempTel.substring(0, 2) === "02") {
        tempTel = tempTel.substring(2);
    } else {
        tempTel = tempTel.substring(3);
    }
    if (isEdit === true) {
        let chknum = /^[0-9]+$/;
        if (franchiseeList.tel.length > 8 && franchiseeList.tel.length < 12 && chknum.test(franchiseeList.tel) && tempTel.length > 2) {
            instance({
                method: "put",
                url: `/franchisee/` + franchiseeList.businessNumber,
                data: {
                    firstImg: firstImgsrc,
                    hours: time,
                    intro: input.intro,
                    tel: input.tel,
                },
            }).then(function (res) {
                setFranchiseeList(res.data);
            });
        } else {
            toast.error('전화 번호를 다시 확인하고 입력하여 주십시오', toast.toastdefaultOption);
            setIsEdit(true);
        }
    }
}

function BusinessListForm({ franchiseeList: f }) {
    const [input, setInput] = useState({
        tel: "",
        intro: "",
    });
    //메뉴삭제모달 띄우기
    const [show, setShow] = useState(false);
    //메뉴삭제 데이터
    const [data, setData] = useState({});

    //유효성검사
    const [franchiseeList, setFranchiseeList] = useState(f);
    const [isEdit, setIsEdit] = useState(false);
    const [menuAddModalshow, setMenuAddModaShow] = useState(false);
    //가맹점 대표 이미지 useState
    const [firstImgsrc, setFirstImgsrc] = useState(franchiseeList.firstImg);
    //메뉴 이미지 useState
    const [menuImgsrc, setMenuImgsrc] = useState(
        "/api/v1/file/a70427302ce343c2bd29054e7dd82cc0-default-image.jpg"
    );
    const [menuImgId, setMenuImgId] = useState("");

    const onLoadprofile = (e) => {
        var frm = new FormData();
        frm.append("files", e.target.files[0]);

        instance({
            headers: {
                "Content-Type": "multipart/form-data",
            },
            method: "post",
            url: `/file`,
            data: frm,
        }).then(function (res) {
            //가맹점 대표이미지 src 설정
            setFirstImgsrc(res.data[0].path);
        });
    };

    const onLoadMenuimage = (e) => {
        var frm = new FormData();
        frm.append("files", e.target.files[0]);
        instance({
            headers: {
                "Content-Type": "multipart/form-data",
            },
            method: "post",
            url: `/file`,
            data: frm,
        }).then(function (res) {
            //매뉴 이미지 src 설정
            setMenuImgsrc(res.data[0].path);
            setMenuImgId(res.data[0].id);
        });
    };

    const [menuName, setMenuName] = useState("");
    const [menuPrice, setMenuPrice] = useState("");
    const [menuDescription, setMenuDescription] = useState(0);

    const menuNameChange = (e) => {
        setMenuName(e.target.value);
    };
    const menuPriceChange = (e) => {
        setMenuPrice(e.target.value);
    };
    const menuDescriptionChange = (e) => {
        setMenuDescription(e.target.value);
    };

    //메뉴모달 boolean값으로 상태변경
    const [cardchk, setCardChk] = useState(false);
    const [cardmenu, setCardMenu] = useState();

    const menuAddModalClose = () => {
        setMenuAddModaShow(false);
    };
    function MenuModalShow() {
        setMenuAddModaShow(true);
        setCardChk(false);
        setMenuName("");
        setMenuPrice("");
        setMenuDescription("");
        setMenuImgsrc(
            "/api/v1/file/a70427302ce343c2bd29054e7dd82cc0-default-image.jpg"
        );
    }

    //영업 시간 통신
    const [ordertime, setOrdertime] = useState([{}]);

    //가맹점 메뉴 조회
    const [menuList, setMenuList] = useState([
        {
            image: {
                path: "/api/v1/file/a70427302ce343c2bd29054e7dd82cc0-default-image.jpg",
            },
        },
    ]);
    useEffect(() => {
        instance({
            method: "get",
            url: `/franchisee/` + franchiseeList.businessNumber + `/menus`,
        })
            .then(function (res) {
                setMenuList(res.data);
            })
            .catch(function (err) {
                if (err.response.status === 404) {
                    // 메뉴가 없을 때
                }
                setMenuList([]);
            });
        instance({
            method: "get",
            url: `/franchisee/` + franchiseeList.businessNumber + `/schedule`,
        }).then(function (res) {
            setOrdertime([
                {
                    id: 0,
                    name: "월",
                    time: res.data.monday,
                    fromHour: res.data.monday === "휴무" ? "00" : res.data.monday.split("~")[0].split(":")[0],
                    fromMinute: res.data.monday === "휴무" ? "00" : res.data.monday.split("~")[0].split(":")[1],
                    toHour: res.data.monday === "휴무" ? "00" : res.data.monday.split("~")[1].split(":")[0],
                    toMinute: res.data.monday === "휴무" ? "00" : res.data.monday.split("~")[1].split(":")[1],
                    dayOff: false,
                },

                {
                    id: 1,
                    name: "화",
                    time: res.data.tuesday,
                    fromHour: res.data.tuesday === "휴무" ? "00" : res.data.tuesday.split("~")[0].split(":")[0],
                    fromMinute: res.data.tuesday === "휴무" ? "00" : res.data.tuesday.split("~")[0].split(":")[1],
                    toHour: res.data.tuesday === "휴무" ? "00" : res.data.tuesday.split("~")[1].split(":")[0],
                    toMinute: res.data.tuesday === "휴무" ? "00" : res.data.tuesday.split("~")[1].split(":")[1],
                    dayOff: false,
                },
                {
                    id: 2,
                    name: "수",
                    time: res.data.wednesday,
                    fromHour: res.data.wednesday === "휴무" ? "00" : res.data.wednesday.split("~")[0].split(":")[0],
                    fromMinute: res.data.wednesday === "휴무" ? "00" : res.data.wednesday.split("~")[0].split(":")[1],
                    toHour: res.data.wednesday === "휴무" ? "00" : res.data.wednesday.split("~")[1].split(":")[0],
                    toMinute: res.data.wednesday === "휴무" ? "00" : res.data.wednesday.split("~")[1].split(":")[1],
                    dayOff: false,
                },
                {
                    id: 3,
                    name: "목",
                    time: res.data.thursday,
                    fromHour: res.data.thursday === "휴무" ? "00" : res.data.thursday.split("~")[0].split(":")[0],
                    fromMinute: res.data.thursday === "휴무" ? "00" : res.data.thursday.split("~")[0].split(":")[1],
                    toHour: res.data.thursday === "휴무" ? "00" : res.data.thursday.split("~")[1].split(":")[0],
                    toMinute: res.data.thursday === "휴무" ? "00" : res.data.thursday.split("~")[1].split(":")[1],
                    dayOff: false,
                },
                {
                    id: 4,
                    name: "금",
                    time: res.data.friday,
                    fromHour: res.data.friday === "휴무" ? "00" : res.data.friday.split("~")[0].split(":")[0],
                    fromMinute: res.data.friday === "휴무" ? "00" : res.data.friday.split("~")[0].split(":")[1],
                    toHour: res.data.friday === "휴무" ? "00" : res.data.friday.split("~")[1].split(":")[0],
                    toMinute: res.data.friday === "휴무" ? "00" : res.data.friday.split("~")[1].split(":")[1],
                    dayOff: false,
                },
                {
                    id: 5,
                    name: "토",
                    time: res.data.saturday,
                    fromHour: res.data.saturday === "휴무" ? "00" : res.data.saturday.split("~")[0].split(":")[0],
                    fromMinute: res.data.saturday === "휴무" ? "00" : res.data.saturday.split("~")[0].split(":")[1],
                    toHour: res.data.saturday === "휴무" ? "00" : res.data.saturday.split("~")[1].split(":")[0],
                    toMinute: res.data.saturday === "휴무" ? "00" : res.data.saturday.split("~")[1].split(":")[1],
                    dayOff: false,
                },
                {
                    id: 6,
                    name: "일",
                    time: res.data.sunday,
                    fromHour: res.data.sunday === "휴무" ? "00" : res.data.sunday.split("~")[0].split(":")[0],
                    fromMinute: res.data.sunday === "휴무" ? "00" : res.data.sunday.split("~")[0].split(":")[1],
                    toHour: res.data.sunday === "휴무" ? "00" : res.data.sunday.split("~")[1].split(":")[0],
                    toMinute: res.data.sunday === "휴무" ? "00" : res.data.sunday.split("~")[1].split(":")[1],
                    dayOff: false,
                },
            ]);
        });
    }, [franchiseeList]);

    function CardClick() {
        setCardChk(true);
        setMenuAddModaShow(true);
    }

    //메뉴 수정 통신
    const MenuEdit = () => {
        instance({
            method: "put",
            url: `/menu/` + cardmenu.id,
            data: {
                description: cardmenu.description,
                name: cardmenu.name,
                price: Number(cardmenu.price),
            },
        }).then(function (res) {
            setMenuAddModaShow(false);
            let tempArr = [...menuList];
            menuList.map((ele, idx) => {
                if (ele.id === cardmenu.id) {
                    tempArr[idx] = cardmenu;
                }
                return setMenuList(tempArr);
            });
        });
    };

    //영업 시간 (시)
    const hours = [];
    for (let i = 0; i < 24; i++) {
        if (i < 10) hours.push("0" + i);
        else hours.push(i.toString());
    }

    //영업 시간 (분)
    const minute = ["00", "10", "20", "30", "40", "50"];

    //영업시간 변경
    const setTimeChange = (e, id) => {
        setOrdertime(ordertime.map((time) => time.id === id ? { ...time, [e.target.name]: e.target.value } : time));
    };

    //영업시간 휴무
    const onToggle = (id) => {
        setOrdertime(ordertime.map((time) => time.id === id ? { ...time, dayOff: !time.dayOff } : time));
    };

    function FranBack() {
        setIsEdit(false);
    }

    return (
        <>
            <div className="main-body">
                <div className="row mb-3 franinfozone">
                    {/* 헤더존 */}
                    <div className="col-sm-4 franinfozone--headerzone">
                        <div className="card franinfozone--frantitle">
                            <div className="card-body">
                                <div className="d-flex flex-column align-items-center text-center">
                                    {isEdit ? (
                                        <div className="image-upload" onChange={onLoadprofile}>
                                            <label htmlFor="file-input" id="file-Label">
                                                <img alt="가맹점이미지" className="businessListImg" src={`${process.env.REACT_APP_SERVER_URL}${firstImgsrc}`} />
                                            </label>
                                            <input id="file-input" type="file" />
                                        </div>
                                    ) : (<img alt="가맹점이미지" className="businessListImg" src={`${process.env.REACT_APP_SERVER_URL}${firstImgsrc}`} />)}
                                    <h4 id="businessList--franName">{franchiseeList.name}</h4>
                                    <p className="text-secondary">
                                        <textarea className="franchiseeIntro" name="intro" style={isEdit ? { border: "1px solid black", height: "250px", } : null}
                                            value={!isEdit ? franchiseeList.intro : input.intro}
                                            rows="3"
                                            cols="40"
                                            readOnly={!isEdit}
                                            onChange={(e) => { setInput({ ...input, [e.target.name]: e.target.value, }); }} />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 바디존 */}
                    <div className="col-sm-8 franinfozone--bodyzone">
                        <div className="card franinfozone--frantitle">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-2">
                                        <h6>사업자번호</h6>
                                    </div>
                                    <div className={isEdit ? "col-sm-8 text-secondary businessListInput" : "col-sm-9 text-secondary businessListInput"}>
                                        {franchiseeList.businessNumber.replace(/(\d{3})(\d{5})(\d{2})/, "$1-$2-$3")}
                                    </div>
                                    <div className="col-sm-1 btn btnEditInfo" role="button" onClick={() => { FranUpdate(isEdit, setIsEdit, franchiseeList, firstImgsrc, ordertime, setFranchiseeList, setInput, input); }}>
                                        수정
                                    </div>
                                    {isEdit ? (<div className="col-sm-1 btn btnEditInfo" onClick={() => { FranBack(franchiseeList); }}>취소</div>) : null}
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-2">
                                        <h6>주소</h6>
                                    </div>
                                    <div className="col-sm-10 text-secondary businessListInput">
                                        {franchiseeList.address.road + " " + franchiseeList.address.detail}
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-2">
                                        <h6>전화번호</h6>
                                    </div>
                                    <div className="col-sm-10 text-secondary telZone">
                                        {isEdit ? (
                                            <input name="tel" type="text" value={input.tel} onChange={(e) => { setInput({ ...input, [e.target.name]: e.target.value, }); }} />
                                        ) : (
                                            <div className="businessListInput">
                                                {franchiseeList.tel.substring(0, 2) === "02" ? franchiseeList.tel.replace(/(\d{2})(\d{3,4})(\d{4})/, "$1-$2-$3") : franchiseeList.tel.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3")}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <hr />
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <Row id="searchDeatil-offcanvasbody--runtimezome">
                                            <Accordion defaultActiveKey="0">
                                                <Accordion.Item eventKey="0">
                                                    <Accordion.Header>
                                                        <h6 className="businessList--franTime">
                                                            영업시간
                                                        </h6>
                                                    </Accordion.Header>
                                                    <Accordion.Body>
                                                        {!isEdit ? (
                                                            <>
                                                                {ordertime.map((ele, idx) => {
                                                                    return (
                                                                        <Row key={idx}>
                                                                            <Col sm="1">{ele.name} :</Col>
                                                                            <Col sm="11">{ele.time}</Col>
                                                                        </Row>
                                                                    );
                                                                })}
                                                            </>) : (
                                                            <>
                                                                {ordertime.map((ele, idx) => {
                                                                    return (
                                                                        <div className="runningTime" key={idx}>{ele.name}{" "}:
                                                                            <select className="runningTime--Time" defaultValue={ele.fromHour} disabled={ele.dayOff} name="fromHour" onChange={(e) => { setTimeChange(e, idx); }}>
                                                                                {hours.map((ele, idx) => {
                                                                                    return (
                                                                                        <option className="runningTime--Hours" key={idx}>
                                                                                            {ele}
                                                                                        </option>
                                                                                    );
                                                                                })}
                                                                            </select>
                                                                            <span>:</span>
                                                                            <select className="runningTime--Time" name="fromMinute" defaultValue={ele.fromMinute} disabled={ele.dayOff} onChange={(e) => { setTimeChange(e, idx); }}>
                                                                                {minute.map((ele, idx) => {
                                                                                    return (
                                                                                        <option className="runningTime--Minute" key={idx}>
                                                                                            {ele}
                                                                                        </option>
                                                                                    );
                                                                                })}
                                                                            </select>
                                                                            <span className="runningTime--middle">~</span>
                                                                            <select name="toHour" value={ele.toHour} className="runningTime--Time" disabled={ele.dayOff} onChange={(e) => { setTimeChange(e, idx); }}>
                                                                                {hours.map((ele, idx) => {
                                                                                    return (
                                                                                        <option className="runningTime--Hours" key={idx}>
                                                                                            {ele}
                                                                                        </option>
                                                                                    );
                                                                                })}
                                                                            </select>
                                                                            <span>:</span>
                                                                            <select name="toMinute" value={ele.toMinute} className="runningTime--Time"
                                                                                disabled={ele.dayOff}
                                                                                onChange={(e) => { setTimeChange(e, idx); }}>
                                                                                {minute.map((ele, idx) => {
                                                                                    return (
                                                                                        <option className="runningTime--Minute" key={idx}>
                                                                                            {ele}
                                                                                        </option>
                                                                                    );
                                                                                })}
                                                                            </select>
                                                                            <input type="checkbox" value="휴무" onChange={() => { onToggle(idx); }} /> 휴무
                                                                        </div>
                                                                    );
                                                                })}
                                                            </>
                                                        )}
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            </Accordion>
                                        </Row>
                                    </ListGroup.Item>
                                </ListGroup>
                                <hr />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card mb-3 franmenuzone">
                    <div className="card-body">
                        <div className="row franmenuzone--headerzone">
                            <div className="col-sm-10">
                                <h6>메뉴</h6>
                            </div>
                            <div className="col-sm-2 btnAddMenuArea">
                                <button className="btn btnMenu btnAddMenu" onClick={() => { MenuModalShow(); }}>
                                    메뉴 추가
                                </button>
                            </div>
                            <Modal show={menuAddModalshow} onHide={menuAddModalClose} centered>
                                <Modal.Header closeButton>
                                    <Modal.Title>
                                        {cardchk ? "메뉴 수정" : "메뉴 추가"}
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Row>
                                        <Col sm={5}>
                                            {cardchk ? (
                                                <img className="BusinessList--MenuImg" alt="메뉴이미지" src={cardmenu.image.path} />
                                            ) : (
                                                <img className="BusinessList--MenuImg" alt="메뉴이미지" src={`${process.env.REACT_APP_SERVER_URL}${menuImgsrc}`} />
                                            )}
                                            <Form.Group className="mb-3 filebox">
                                                <Form.Label htmlFor="ex_file">
                                                    이미지 업로드
                                                </Form.Label>
                                                <Form.Control type="file" id="ex_file" onChange={onLoadMenuimage} />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Label>메뉴 이름</Form.Label>
                                            {cardchk ? (
                                                <Form.Control name="name" type="text" value={cardmenu.name} onChange={(e) => { setCardMenu({ ...cardmenu, [e.target.name]: e.target.value, }); }} autoFocus />
                                            ) : (
                                                <Form.Control name="name" type="text" value="메뉴이름을 적어주세요." id="menuName" autoFocus onChange={menuNameChange} />
                                            )}
                                            <Form.Label>메뉴 가격</Form.Label>
                                            {cardchk ? (
                                                <InputGroup className="mb-3">
                                                    <Form.Control name="price" type="Number" value={cardmenu.price} autoFocus onChange={(e) => { setCardMenu({ ...cardmenu, [e.target.name]: e.target.value, }); }} />
                                                    <InputGroup.Text id="basic-addon2">원</InputGroup.Text>
                                                </InputGroup>
                                            ) : (
                                                <InputGroup className="mb-3">
                                                    <Form.Control name="price" type="Number" id="menuprice" value={menuPrice} autoFocus onChange={menuPriceChange} />
                                                    <InputGroup.Text id="basic-addon2">원</InputGroup.Text>
                                                </InputGroup>
                                            )}
                                        </Col>
                                    </Row>
                                    <FloatingLabel label="메뉴 소개">
                                        {cardchk ? (
                                            <Form.Control onChange={(e) => { setCardMenu({ ...cardmenu, [e.target.name]: e.target.value, }); }} className="menuDescription addMenuModalIntro" name="description" as="textarea" value={cardmenu.description} />
                                        ) : (
                                            <Form.Control onChange={menuDescriptionChange} className="addMenuModalIntro" name="description" as="textarea" value={menuDescription} />
                                        )}
                                    </FloatingLabel>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={menuAddModalClose}>
                                        뒤로
                                    </Button>
                                    {cardchk ? (
                                        <Button variant="primary" onClick={MenuEdit}>
                                            수정
                                        </Button>
                                    ) : (
                                        <Button variant="primary" onClick={() => { menuAdd(franchiseeList, menuDescription, menuName, menuPrice, menuImgId, menuList, setMenuList, setMenuAddModaShow, menuImgsrc, setMenuName, setMenuPrice, setMenuDescription); }}>
                                            등록
                                        </Button>
                                    )}
                                </Modal.Footer>
                            </Modal>
                            {/* </div> */}
                        </div>
                        <hr />
                        <div className="row franmenuzone--bodyzone">
                            <div className="franmenuzone--menulistzone">
                                <ListGroup>
                                    <Row>
                                        {menuList.length > 0 ? (
                                            <div>
                                                {menuList.map((ele, idx) => {
                                                    return (
                                                        <div className="menulistIndex" key={idx}>
                                                            <img alt="메뉴이미지" src={`${process.env.REACT_APP_SERVER_URL}${menuList[idx].image.path}`} className="menulistImg" />
                                                            <div className="menulistMenuName">
                                                                <span>{menuList[idx].name}</span>
                                                            </div>
                                                            <span className="menulistButtonZone">
                                                                <span role="button" className="EventText" onClick={() => { setCardMenu(ele); CardClick(); }}>수정</span>
                                                                <span id="menulistBtn--middle">ㅣ</span>
                                                                <span role="button" className="EventText" onClick={() => { setShow(true); setData(ele); }}>삭제</span>
                                                            </span>
                                                            <div className="menulistPriceZone">
                                                                {`${menuList[idx].price}원`}
                                                            </div>
                                                            <div className="menulistIntroZone">
                                                                {menuList[idx].description}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="franmenuzone--menulistzone--defaultMenuZone">
                                                <h1>
                                                    <TbBoxOff style={{ color: "#4187f5", }} />
                                                </h1>
                                                <div>
                                                    <p>가맹점에 등록된 메뉴가 없습니다</p>
                                                    <p>우측 상단의 메뉴추가 버튼을 통해 메뉴를 추가해주세요</p>
                                                </div>
                                            </div>
                                        )}
                                    </Row>
                                </ListGroup>
                            </div>
                        </div>
                    </div>
                </div>
                {/* {show ? (<DelMenuModals show={show} setShow={setShow} data={data} menuList={menuList} setMenuList={setMenuList} />) : null} */}
            </div>
        </>
    );
}

export default BusinessListForm;