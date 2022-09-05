import { useEffect, useState } from "react";
import { Row, Button, Form, Modal, FloatingLabel, InputGroup, Col, } from "react-bootstrap";
import { instance } from "../template/AxiosConfig/AxiosInterceptor";
import "../css/MenuModal.css";
import { ToastContainer, toast } from 'react-toastify';

export const AddMenuModal = ({ menuModalshow, setMenuModalshow, businessNumber, setMenuList, menuList, oneMenu, setOneMenu }) => {
    const ModalClose = () => {
        // 모달끌때 상태값지우기
        setOneMenu('');
        setMenuModalshow(false)
    };

    //메뉴 상태
    const [menuImgsrc, setMenuImgsrc] = useState(
        "/api/v1/file/a70427302ce343c2bd29054e7dd82cc0-default-image.jpg"
        // ""
    );
    const [menuImgId, setMenuImgId] = useState("");

    const [menuState, setMenuState] = useState({
        name: '',
        price: '',
        description: ''
    });

    const [menuImgPath, setMenuImgPath] = useState();
    const [menuImgPathid, setMenuImgPathid] = useState();

    useEffect(() => {
        if (oneMenu) {
            setMenuImgPath(oneMenu.image.path)
            setOneMenu({ ...oneMenu, price: (oneMenu.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') })
        } else return;

    }, [])

    const inputPriceFormat = (id, str) => {
        let comma = '';
        let uncomma = '';
        if (id == 'menuprice') {
            comma = (str) => {
                str = String(str);
                return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,");
            };
            uncomma = (str) => {
                str = String(str);
                return str.replace(/[^\d]+/g, "");
            };
            return setMenuState({ ...menuState, price: comma(uncomma(str)) });
        } else
            comma = (str) => {
                str = String(str);
                return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,");
            };
        uncomma = (str) => {
            str = String(str);
            return str.replace(/[^\d]+/g, "");
        };
        return setOneMenu({ ...oneMenu, price: comma(uncomma(str)) });
    };

    //메뉴 추가모달 값 변경
    const menuStateChange = (e) => {
        setMenuState({ ...menuState, [e.target.name]: e.target.value });
    };


    //메뉴 수정모달 값 변경
    const oneMenuStateChange = (e) => {
        setOneMenu({ ...oneMenu, [e.target.name]: e.target.value });
    };

    //메뉴 추가
    const MenuAdd = () => {

        // validation
        if (menuState.name.length === 0 || menuState.price.length === 0) {
            toast.error('메뉴이름 또는 메뉴가격을 확인해주세요.', toast.toastDefaultOption);
            return;
        } else if (menuState.price.split(",").reduce((curr, acc) => curr + acc, "") > 100000000 || menuState.price < 0) {
            toast.error('메뉴가격은 0~1억사이만 가능합니다.', toast.toastDefaultOption);
            return;
        } else if (menuState.name.length > 10) {
            toast.error('메뉴이름은 10글자를 초과할 수 없습니다.', toast.toastDefaultOption);
            return;
        } else if (menuState.description.length > 150) {
            toast.error('메뉴설명은 150자를 초과할 수 없습니다.', toast.toastDefaultOption);
            return;
        }
        if (menuImgsrc === "/api/v1/file/a70427302ce343c2bd29054e7dd82cc0-default-image.jpg") {
            instance({
                method: "post",
                url: `/franchisee/` + businessNumber.businessNumber + `/menu`,
                data: {
                    description: menuState.description,
                    name: menuState.name,
                    price: menuState.price.split(",").reduce((curr, acc) => curr + acc, ""),
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
                toast.success('메뉴가 등록되었습니다.', toast.toastDefaultOption);
            });
        } else {
            instance({
                method: "post",
                url: `/franchisee/` + businessNumber.businessNumber + `/menu`,
                data: {
                    description: menuState.description,
                    name: menuState.name,
                    price: menuState.price.split(",").reduce((curr, acc) => curr + acc, ""),
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
                    toast.success('메뉴가 등록되었습니다.', toast.toastDefaultOption);
                })
                .catch((err) => { });
        }
        // toast.success('메뉴가 등록되었습니다.', toast.toastDefaultOption);
        setMenuModalshow(false);
    }

    //메뉴 이미지 변경
    const onLoadMenuimage = (e) => {
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
            if (oneMenu) {
                setMenuImgPath(res.data[0].path);
                setMenuImgPathid(res.data[0].id);
            } else {
                //메뉴추가 이미지 추가
                setMenuImgsrc(res.data[0].path);
                setMenuImgId(res.data[0].id);
            }

        });
    };
    //메뉴 수정 통신
    const MenuEdit = () => {
        // validation
        if (oneMenu.name.length === 0 || oneMenu.price.length === 0) {
            toast.error('메뉴이름 또는 메뉴가격을 확인해주세요.', toast.toastDefaultOption);
            return;
        } else if (oneMenu.price.split(",").reduce((curr, acc) => curr + acc, "") > 100000000 || oneMenu.price < 0) {
            toast.error('메뉴가격은 0~1억사이만 가능합니다.', toast.toastDefaultOption);
            return;
        } else if (oneMenu.name.length > 10) {
            toast.error('메뉴이름은 10글자를 초과할 수 없습니다.', toast.toastDefaultOption);
            return;
        } else if (oneMenu.description.length > 150) {
            toast.error('메뉴설명은 150자를 초과할 수 없습니다.', toast.toastDefaultOption);
            return;
        }

        instance({
            method: "put",
            url: `/menu/` + oneMenu.id,
            data: {
                description: oneMenu.description,
                name: oneMenu.name,
                price: oneMenu.price.split(",").reduce((curr, acc) => curr + acc, ""),
                imageId: menuImgPathid,
            },
        }).then(function (res) {
            setOneMenu((oneMenu) => {
                let obj = { ...oneMenu }
                let imgObj = oneMenu.image

                imgObj.path = menuImgPath
                obj.image = imgObj
                return obj
            })
            setMenuModalshow(false);
            let tempArr = [...menuList];
            menuList.map((ele, idx) => {
                if (ele.id === oneMenu.id) {
                    tempArr[idx] = oneMenu;
                }
                return setMenuList(tempArr);
            });
            toast.success('메뉴가 수정되었습니다.', toast.toastDefaultOption);
            setOneMenu('');

        });
    };

    return (
        <>
            <Modal show={menuModalshow} onHide={ModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {oneMenu ? "메뉴 수정" : '메뉴 추가'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={5}>
                            <div id="addMenu-inputbox" onChange={onLoadMenuimage} >
                                <span id="addMenu-inputbox--filebox">
                                    {oneMenu ? (
                                        <label id="addMenu-inputbox__imagelabel" htmlFor="ex_file" style={{ backgroundImage: "url(" + menuImgPath + ")" }}>
                                            <div className="AddMenu-inputbox__text" id="fileCircle">+</div>
                                        </label>
                                    ) :
                                        (
                                            <label id="addMenu-inputbox__imagelabel" htmlFor="ex_file" style={{ backgroundImage: `url(${process.env.REACT_APP_SERVER_URL}${menuImgsrc})` }}>
                                                <div className="AddMenu-inputbox__text" id="fileCircle">+</div>
                                            </label>
                                        )}
                                    <input accept=".gif, .jpg, .png" id="ex_file" type="file" />
                                </span>
                            </div>
                        </Col>
                        <Col>
                            <Form.Label>메뉴 이름</Form.Label>
                            {oneMenu ? (<Form.Control name="name" type="text" placeholder="메뉴이름을 적어주세요." id="menuName" maxLength='10' autoFocus value={oneMenu.name} onChange={(e) => { oneMenuStateChange(e) }} />) :
                                (<Form.Control name="name" type="text" placeholder="메뉴이름을 적어주세요." id="menuName" maxLength='10' autoFocus value={menuState.name} onChange={(e) => { menuStateChange(e) }} />)}
                            <Form.Label>메뉴 가격</Form.Label>
                            <InputGroup className="mb-3">
                                {oneMenu ? (<Form.Control name="price" type="text" id="onemenuprice" placeholder="메뉴가격을 적어주세요." value={oneMenu.price} onChange={(e) => inputPriceFormat(e.target.id, e.target.value)} />) :
                                    (
                                        <Form.Control name="price" type="text" id="menuprice" placeholder="메뉴가격을 적어주세요." value={menuState.price}
                                            onChange={(e) => inputPriceFormat(e.target.id, e.target.value)} />
                                    )}
                                <InputGroup.Text id="basic-addon2">원</InputGroup.Text>
                            </InputGroup>
                        </Col>
                    </Row>
                    <FloatingLabel label="메뉴 소개">
                        {oneMenu ? (<Form.Control className="addMenuModalIntro" name="description" as="textarea" placeholder="메뉴 소개" value={oneMenu.description} onChange={(e) => { oneMenuStateChange(e) }} />) :
                            (<Form.Control className="addMenuModalIntro" name="description" as="textarea" placeholder="메뉴 소개" value={menuState.description} onChange={(e) => { menuStateChange(e) }} />)}
                    </FloatingLabel>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={ModalClose}>
                        뒤로
                    </Button>
                    {oneMenu ? (<Button variant="primary" onClick={MenuEdit}>
                        수정
                    </Button>) :
                        (<Button variant="primary" onClick={MenuAdd}>
                            등록
                        </Button>)}
                </Modal.Footer>
            </Modal>
        </>
    )
}