import Button from "react-bootstrap/Button";
import { Container, Row, Col } from "react-bootstrap";
import { AiFillLock } from "react-icons/ai";
import { MdEmail } from "react-icons/md";
import "../css/Login.css";
import { useContext, useState } from "react";
import { instance } from '../template/AxiosConfig/AxiosInterceptor'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BusinessContext } from "../pages/Home";

function Login({ closeLoginModal, showFindPWModal, showRegisterModal, setUsername }) {
    const franchiseeList = useContext(BusinessContext);
    // console.log(franchiseeList)

    const [findpwshow, setFindpwshow] = useState(false);
    const openFindpw = () => {
        setFindpwshow(true)
    }
    const closeFindpw = () => {
        setFindpwshow(false)
    }

    const [registershow, setRegisterShow] = useState(false);
    const showRegister = () => {
        setRegisterShow(true);
    }
    const closeRegisterModal = () => {
        setRegisterShow(false);
    }

    const [email, setEmail] = useState("");
    const [franPage, setFranPage] = useState(1);

    const userinfoEmail = (e) => {
        const emailreg = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/
        if (emailreg.test(e.target.value)) {
            setEmail(e.target.value);
        } else {
            // toast.error('이메일 형식을 맞춰주세요', toast.toastDefaultOption);
        }

    };
    const [password, setPassword] = useState("");
    const userinfoPassword = (e) => {
        setPassword(e.target.value);
    };
    const [emailchk, setEmailchk] = useState(false);

    const loginOnclick = () => {
        const emailreg = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/
        if (emailreg.test(email)) {
            if (email && password) {
                instance({
                    method: "post",
                    url: "/sign/signin",
                    data: {
                        email: email,
                        password: password,
                    },
                }).then(function (res) {
                    localStorage.setItem("accessToken", res.data.accessToken);
                    localStorage.setItem("userId", res.data.id);
                    localStorage.setItem("refreshToken", res.data.refreshToken);
                    localStorage.setItem("userName", res.data.name);
                    setUsername(localStorage.getItem('userName'))
                    toast.success('로그인 되었습니다', toast.toastDefaultOption);
                }).then(function () {
                    instance({
                        method: "get",
                        url: `/member/` + localStorage.getItem("userId") + `/franchisee`,
                        params: { page: franPage },
                    })
                        .then(function (res) {
                            franchiseeList.setFranchiseeList(res.data.franchisees);
                        })
                        .catch((err) => {
                        });
                    instance.get(
                        "/member/" + localStorage.getItem("userId"),
                    ).then((res) => {
                        localStorage.setItem("email", res.data.email);
                        // franchiseeList.setUserData(res.data);
                        if(franchiseeList) {
                            franchiseeList.setUserData(res.data)
                            closeLoginModal();
                        }
                        else closeLoginModal();
                    }).catch((err) => {
                        // console.log(err)
                    });
                }).catch((err) => {
                    // console.log(err)
                    toast.error("ID,PW를 확인해주세요", toast.toastDefaultOption);
                });
            } else {
                toast.error("ID,PW를 입력해주세요", toast.toastDefaultOption)
            }
        } else {
            setEmailchk(true)
            setTimeout(() => {
                setEmailchk(false)
            }, 10000)
        }
    };

    return (
        <>
            <div className="Login">
                <Container>
                    <Row>
                        <Col></Col>
                        <Col xs={5} className="Login-Header">
                            로그인
                        </Col>
                        <Col></Col>
                    </Row>
                    <form className="LoginForm">
                        {emailchk ? <div style={{ fontSize: '10pt', color: 'red', marginLeft: '10px' }}>
                            <span>이메일 형식에 맞게 작성하여 주십시오</span>
                        </div> : ''}
                        <div
                            className="wrap-input100 validate-input"
                            data-validate="Password is required"
                        >
                            <input
                                className="input100 userEmail"
                                id="userEmail"
                                type="email"
                                name="useremail"
                                placeholder="Email"
                                onChange={userinfoEmail}
                            />
                            <span className="focus-input100"></span>
                            <span className="symbol-input100">
                                <MdEmail />
                            </span>
                        </div>
                        <div
                            className="wrap-input100 validate-input"
                            data-validate="Password is required"
                        >
                            <input
                                className="input100 userPassword"
                                type="password"
                                name="userpassword"
                                placeholder="Password"
                                onChange={userinfoPassword}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') loginOnclick();
                                }}
                            />
                            <span className="focus-input100"></span>
                            <span className="symbol-input100">
                                <AiFillLock />
                            </span>
                        </div>
                        <Button
                            variant="primary"
                            size="lg"
                            id="Login-LoginForm__loginBtn"
                            onClick={loginOnclick}
                        >
                            로그인
                        </Button>
                        <div className="Login--SubContents mb-3">
                            <span>
                                <p
                                    role='button'
                                    className="Login--AccountSearch"
                                    onClick={(e) => {
                                        showFindPWModal();
                                    }}>
                                    비밀번호찾기
                                </p>
                            </span>
                            <span>
                                <p
                                    role='button'
                                    className="Login--Register"
                                    onClick={(e) => {
                                        showRegisterModal();
                                    }}>
                                    회원가입
                                </p>
                            </span>
                        </div>
                    </form>
                </Container>
            </div>
        </>
    );
}
export default Login;

