import { Container, Row, Col } from "react-bootstrap";
import Footer from "../template/Footer";
import ApiHeader from "../template/ApiHeader";
import '../css/Application.css'
import ScrollToTop from '../template/ScrollToTop';
import { useEffect, useState } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { instance } from '../template/AxiosConfig/AxiosInterceptor';
import { Link } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ApiDocumentForm() {
    //useState
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState('');
    const [appName, setAppName] = useState('');
    const [appList, setAppList] = useState([{}]);

    //useEffect
    useEffect(()=>{
        setEmail(localStorage.getItem('email'));
        selectApplication();
    },[]);

    //function
    const successNotify = (e) => toast.success(e,toast.defaultOption);
    const errorNotify = (e) => toast.error(e,toast.defaultOption);
    const appInfoName = (e) => {
        setAppName(e.target.value);
    };
    const simpleHandleClose = () => {
        setShow(false);
    }
    const handleShow = () => setShow(true);
    const selectApplication = () => {
        const userId = localStorage.getItem('userId');
        instance({
            method: "get",
            url: `/member/${userId}/application`,
        }).then(function (res) {
            setAppList(res.data);
        }).catch(function (err){ 
            // console.log(err);
        });
    };
    const insertOnKeyPress = (e) => {
        if (e.key === "Enter") {
            applicationSubmit(); // Enter 입력이 되면 클릭 이벤트 실행
        }
    };
    const applicationSubmit = () => {
        if(appName == ''){
            errorNotify('이름이 비어 있습니다.');
        } else{
            instance({
                method: "post",
                url: `/application`,
                data: {email:email, name:appName},
            }).then(function (res) {
                selectApplication();
                successNotify('앱이 추가 되었습니다.');
            }).catch(function (err){
                // console.log(err);
                if(err.response.data.message == "Invalid Email"){
                    errorNotify("해당 이메일이 존재하지 않습니다.");
                }else if(err.response.data.message == "Application Name is Duplication"){
                    errorNotify("같은 이름으로 등록된 앱이 존재합니다.");
                }
            });
            setShow(false);
        }
    }
    
    return (
        <>
            <ScrollToTop/>
            <Modal show={show} onHide={simpleHandleClose} className="modal_radius">
                <Modal.Header closeButton >
                    <div className="KDC_Dialog__header__1eFei">
                        <strong className="tit_layer modal-header-font">애플리케이션 추가하기</strong>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <label className="lab_normal">앱 이름</label>
                    <input 
                        type='text'
                        placeholder="앱 이름"
                        className="modal_input modal_radius"
                        onChange={appInfoName}
                        onKeyPress={insertOnKeyPress}
                        autoFocus 
                    ></input>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={simpleHandleClose} className="modal_radius">
                        취소
                    </Button>
                    <Button variant="primary" onClick={applicationSubmit} className="modal_radius">
                        저장
                    </Button>
                </Modal.Footer>
            </Modal>

            <Container fluid = 'sm' style={{ marginTop: '79px' }}>
                <Row>
                    <Col sm={2}/>
                    <Col sm={8}>
                    <div className="KDC_Breadcrumb__root__31lqj show_pc"/>
                    <div className="KDC_Body__root__1Q-tq">
                        <div className="KDC_AppInfoList__root__2O8BC">
                            <div className="KDC_AppInfoList__head__2uLs-">
                                <h3 style={{borderTop:'none'}}>전체 애플리케이션</h3>
                            </div>
                            <div className="KDC_AppInfoList__container__2vCao">
                                <button type="button" className="KDC_AddButton__root__3wM46" onClick={handleShow}>
                                    <div className="icon_plus"></div>
                                    <span className="txt_appadd">애플리케이션 추가하기</span>
                                </button>
                                
                                <ul className="KDC_AppInfoList__apps__1GCA_">
                                {appList.map((ele, idx) => {
                                    return (
                                        <li key={idx} className='list_style'>
                                            <Link to={`../appDetail?appId=${ele.id}`} className="a_tag">
                                                <div className="KDC_AppInfo__root__DWY2K area_appinfo">
                                                    <div className="box_thumb">
                                                        <img className="KDC_Image__root__2m4AU" src="https://k.kakaocdn.net/14/dn/btqvX1CL6kz/sSBw1mbWkyZTkk1Mpt9nw1/o.jpg" width="64" height="64" alt="app_icon"></img>
                                                    </div>
                                                    <div className="box_typeinfo">
                                                        <strong className="tit_typeinfo">{ele.name}</strong>
                                                        <div className="inbox_typeinfo">
                                                            <span className="KDC_Badge__root__25Csl item_info a_tag">ID {ele.id}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>
                                    );
                                })}
                                </ul>
                            </div>
                        </div>
                        <div className="KDC_Content__centerRoot__3K9s0">

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
