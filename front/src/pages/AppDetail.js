import { Container, Row, Col } from "react-bootstrap";
import Footer from "../template/Footer";
import ApiHeader from "../template/ApiHeader";
import '../css/AppDetail.css'
import ScrollToTop from '../template/ScrollToTop';
import { useState, useEffect} from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useLocation, useNavigate } from "react-router";
import { Link } from 'react-router-dom';
import { instance } from '../template/AxiosConfig/AxiosInterceptor';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ApiDocumentForm() {
    const location = useLocation();     
    const app = location.search.substring(7);

    // useState
    const [appOne, setAppLOne] = useState({});
    const [email, setEmail] = useState('');
    const [updateShow, setUpdateShow] = useState(false);
    const [deleteShow, setDeleteShow] = useState(false);
    const [appName, setAppName] = useState('');
    const [deleteSentence, setDeleteSentence] = useState('');

    // useEffect
    useEffect(()=>{
        setEmail(localStorage.getItem('email'));
        selectAppDetail();
    },[location]); 

    // useNavigate
    const navigate = useNavigate();

    // function
    const goToMain = () => {
        navigate("/application");
    };
    const successNotify = (e) => toast.success(e,toast.defaultOption);
    const errorNotify = (e) => toast.error(e,toast.defaultOption);
    const appInfoName = (e) => {
        setAppName(e.target.value);
    };
    const deleteInfoSentence = (e) => {
        setDeleteSentence(e.target.value);
    };
    const handleUpdateShow = () => setUpdateShow(true);
    const handleUpdateClose = () => {
        setUpdateShow(false);
    }
    const handleDeleteShow = () => setDeleteShow(true);
    const handleDeleteClose = () => {
        setDeleteShow(false);
    }
    const selectAppDetail = () => {
        instance({
            method: "get",
            url: `/application/one/` + app,
        }).then(function (res) {
            setAppLOne(res.data);
        }).catch(function (err){ 
            // console.log(err);
        });
    };
    const reIssueAppKey = () => {
        instance({
            method: "put",
            url: `/application/key/`,
            data: {appId:appOne.id},
        }).then(function (res) {
            setAppLOne(res.data);
            successNotify("앱 키가 재발급 되었습니다.");
        }).catch(function (err){ 
            // console.log(err);
        });
    };
    const updateOnKeyPress = e => {
        if (e.key === 'Enter') {
            appUpdate(); // Enter 입력이 되면 클릭 이벤트 실행
        }
    };
    const appUpdate = () => {
        instance({
            method: "put",
            url: `/application/name`,
            data: {appId:appOne.id, currentName:appOne.name, newName:appName},
        }).then(function (res) {
            setAppLOne(res.data);
            successNotify('앱 이름이 수정 되었습니다.')
        }).catch(function (err){
            // console.log(err);
            if(err.response.data.code == "A001"){
                errorNotify("동일한 앱 이름이 존재합니다.");
            } 
        });
        setUpdateShow(false);
    }
    const deleteOnKeyPress = e => {
        if (e.key === 'Enter') {
            appDelete(); // Enter 입력이 되면 클릭 이벤트 실행
        }
    };
    const appDelete = () => {
        if(appOne.name + ' 삭제합니다.' == deleteSentence){
            instance({
                method: "delete",
                url: `/application`,
                data: {appId:appOne.id},
            }).then(function (res) {
                successNotify('앱이 삭제되었습니다.')
                goToMain();
            }).catch(function (err){
                errorNotify('앱 삭제를 실패했습니다.')
                // console.log(err);
            });
        }else{
            errorNotify('삭제 문장을 다시 한번 확인해주세요.');
        }
    }
    const doCopy = () => {
        // 현재 브라우저가 copy 기능을 지원하는지 확인
        if (!document.queryCommandSupported("copy")) {
            return errorNotify("복사하기가 지원되지 않는 브라우저입니다.");
        }
        // 지원한다면 textarea를 만들어서 내부에 원하는 text를 복사
        const textarea = document.createElement("textarea");
        textarea.value = appOne.apiKey;
        // 복사한 텍스트를 document.body에 appendChild
        document.body.appendChild(textarea);
        // focus() -> 사파리 브라우저 서포팅
        textarea.focus();
        // select() -> 사용자가 입력한 내용을 영역을 설정할 때 필요
        textarea.select();
        // exeCommand를 이용하여 복사
        document.execCommand("copy");
        // 복사 완료했다면 body에 추가한 textarea를 삭제
        document.body.removeChild(textarea);
        successNotify("앱 키가 복사 되었습니다.");
    };

    return (
        <>
            <ScrollToTop/>
            <Modal show={deleteShow} onHide={handleDeleteClose} className="modal_radius">
                <Modal.Header closeButton >
                    <div className="KDC_Dialog__header__1eFei">
                        <strong className="tit_layer modal-header-font">앱 삭제하기</strong>
                    </div>
                </Modal.Header>
                <Modal.Body>
                <Form >
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label className="lab_normal">앱을 삭제하기 위해서는 다음의 문장을 입력해주세요.</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={appOne.name + ' 삭제합니다.'} 
                            className="KDC_Input__root__3kmvC modal_radius"
                            readOnly
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label className="lab_normal">삭제 문장 (공백을 주의 해주세요.)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="삭제 문장"
                            className="KDC_Input__root__3kmvC modal_radius"
                            onChange={deleteInfoSentence}
                            onKeyPress={deleteOnKeyPress}
                            autoFocus
                        />
                    </Form.Group>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteClose} className="modal_radius">
                        취소
                    </Button>
                    <Button variant="primary" onClick={appDelete} className="modal_danger">
                        삭제
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={updateShow} onHide={handleUpdateClose} className="modal_radius">
                <Modal.Header closeButton >
                    <div className="KDC_Dialog__header__1eFei">
                        <strong className="tit_layer modal-header-font">앱 이름 수정하기</strong>
                    </div>
                </Modal.Header>
                <Modal.Body>
                <Form >
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label className="lab_normal">현재 앱 이름</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={appOne.name}
                            className="KDC_Input__root__3kmvC modal_radius"
                            readOnly
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label className="lab_normal">수정 할 앱 이름</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="수정 할 앱 이름"
                            className="KDC_Input__root__3kmvC modal_radius"
                            onChange={appInfoName}
                            onKeyPress={updateOnKeyPress}
                            autoFocus
                        />
                    </Form.Group>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleUpdateClose} className="modal_radius">
                        취소
                    </Button>
                    <Button variant="primary" onClick={appUpdate} className="modal_radius">
                        수정
                    </Button>
                </Modal.Footer>
            </Modal>

            <Container fluid = 'sm' style={{ marginTop: '79px' }}>
                <Row>
                    <Col sm={2}/>
                    <Col sm={8}>
                        <div className="KDC_AppInfo__root__DWY2K area_appinfo">
                            <div className="box_thumb">
                                <img className="KDC_Image__root__2m4AU" src="https://k.kakaocdn.net/14/dn/btqvX1CL6kz/sSBw1mbWkyZTkk1Mpt9nw1/o.jpg" alt="app_icon" width="64" height="64"/>
                            </div>
                            <div className="box_typeinfo">
                                <strong>{appOne.name}
                                    <Link to='../application' type="button" className="KDC_IconButton__root__1ksa2 btn_dropdown Button_List">
                                        <span className="KDC_Icon__root__3ZxBV KDC_Icon__list__15KxQ mb-1"></span>
                                        <span className="screen_out">애플리케이션 선택</span>
                                    </Link>
                                </strong>
                                <div className="inbox_typeinfo">
                                    <span className="KDC_Badge__root__25Csl item_info">ID {appOne.id}</span>
                                </div>
                            </div>
                        </div>
                        <div className="KDC_AppInfo__root__DWY2K">
                            <div className="KDC_Column__root__1Zx1r KDC_Column__flex_1__3WFYc">
                                <div className="KDC_Section__root__2FzZg">
                                    <div className="KDC_SectionTitle__root__3lMtt">
                                        <p className="link_viewcont" href="/console/app/777799/config/appKey">앱 키</p>
                                    </div>
                                    <ul>
                                        <li className="KDC_ListLayout__item__37RHl">
                                            <div className="tit_info">
                                                <label className="lab_normal">앱 키</label>
                                            </div>
                                            <div className="KDC_ListLayout__content__3-MiL">
                                                {appOne.apiKey}
                                                <button type="button" className="Button_Nomal" onClick={doCopy}>복사</button>
                                                <button type="button" className="Button_Nomal" onClick={reIssueAppKey}>재발급</button>
                                            </div>
                                        </li>
                                        
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="KDC_AppInfo__root__DWY2K">
                            <div className="KDC_Column__root__1Zx1r KDC_Column__flex_1__3WFYc">
                                <div className="KDC_Section__root__2FzZg">
                                    <div className="KDC_SectionTitle__root__3lMtt">
                                        <p className="link_viewcont" href="/console/app/777799/config/appKey">앱 정보</p>
                                    </div>
                                    <ul>
                                        <li className="KDC_ListLayout__item__37RHl">
                                            <div className="tit_info">
                                                <label className="lab_normal">앱 ID</label>
                                            </div>
                                            <div className="KDC_ListLayout__content__3-MiL">{appOne.id}</div>
                                        </li>
                                        <li className="KDC_ListLayout__item__37RHl">
                                            <div className="tit_info">
                                                <label className="lab_normal">앱 이름</label>
                                            </div>
                                            <div className="KDC_ListLayout__content__3-MiL">{appOne.name}</div>
                                        </li>
                                        <li className="KDC_ListLayout__item__37RHl">
                                            <div className="tit_info">
                                                <label className="lab_normal">유저 EMAIL</label>
                                            </div>
                                            <div className="KDC_ListLayout__content__3-MiL">{email}</div>
                                        </li>
                                    </ul>
                                    <button type="button" className="Button_Update" onClick={handleUpdateShow}>앱 이름 수정</button>
                                    <button type="button" className="Button_Delete" onClick={handleDeleteShow}>앱 삭제</button>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col sm={2}/>
                </Row>
            </Container> 
        </>
    )
}

function ApiDocument() {
    return (
        <>
            <ApiHeader></ApiHeader>
            <ApiDocumentForm></ApiDocumentForm>
            <Footer></Footer>
        </>
    )
}

export default ApiDocument;
