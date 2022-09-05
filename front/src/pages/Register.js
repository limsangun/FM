import React, { useEffect, useRef, useState } from 'react'
import { Container, Form, Row, Col, InputGroup, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css';
import useDaumPostcodePopup from 'react-daum-postcode/lib/useDaumPostcodePopup';
import DatePickerForm from '../template/DatePickerForm';
import Timer from '../template/Timer'
import { instance } from '../template/AxiosConfig/AxiosInterceptor';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


let timer;
function Register({ closeRegisterModal }) {

    let scriptUrl = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    const open = useDaumPostcodePopup(scriptUrl);

    const [address, setAddress] = useState({
        jibun: '',
        postalCode: '',
        road: ''
    })

    const detAddrRef = useRef();

    const searchAddress = (data) => {
        document.getElementById("postcode--addressNumber").value = data.zonecode;
        setAddress({
            ...address,
            jibun: data.jibunAddress,
            postalCode: data.zonecode,
            road: data.address
        })
        if (data.userSelectedType === "R") {
            // 사용자가 도로명 주소를 선택했을 경우
            document.getElementById("postcode--Address").value = data.roadAddress;
            setAddress({
                ...address,
                jibun: data.jibunAddress,
                postalCode: data.zonecode,
                road: data.address
            })
            if (data.autoJibunAddress === "") {
                // autoAddress가 없는 경우
                setAddress({
                    ...address,
                    jibun: data.jibunAddress,
                    postalCode: data.zonecode,
                    road: data.address
                })
            } else {
                // autoAddress가 있는 경우
                setAddress({
                    ...address,
                    jibun: data.autoJibunAddress,
                    postalCode: data.zonecode,
                    road: data.address
                })
            }
        } else {
            // 사용자가 지번 주소를 선택했을 경우(J)
            document.getElementById("postcode--Address").value = data.jibunAddress;
            setAddress({
                ...address,
                jibun: data.jibunAddress,
                postalCode: data.zonecode,
                road: data.address
            })
        }
        detAddrRef.current.focus()
    };

    const handleClick = () => {
        open({ onComplete: searchAddress });
    };

    const registOnclick = (e) => {
        if (e.target.form[1].value) {
            if (e.target.form[2].value) {
                if (e.target.form[4].value) {
                    if (e.target.form[5].value) {
                        if (e.target.form[6].value) {
                            if (registstate.pwchkstate && registstate.emailchkstate
                                && e.target.form[5].value.split('-')[0].length === 4 && e.target.form[5].value.split('-')[1].length === 4
                            ) {
                                instance({
                                    method: 'post',
                                    url: '/sign/signup',
                                    data: {
                                        address: {
                                            ...address,
                                            detail: e.target.form[9].value,
                                        },
                                        email: e.target.form[1].value,
                                        password: e.target.form[2].value,
                                        name: e.target.form[4].value,
                                        phoneNumber: '010' + e.target.form[5].value.split('-')[0] + e.target.form[5].value.split('-')[1],
                                        birth: e.target.form[10].value
                                    }
                                }).then(function (res) {
                                    closeRegisterModal();
                                    toast.success("회원가입이 완료 되었습니다.", toast.toastDefaultOption);
                                }).catch(function (err) {
                                })
                            } else {

                                toast.error('전화번호를 확인하세요.', toast.toastDefaultOption);
                            }
                        } else {
                            toast.error('주소와 우편번호를 확인하세요.', toast.toastDefaultOption);
                        }
                    } else {
                        toast.error('전화번호를 확인하세요.', toast.toastDefaultOption);
                    }
                } else {
                    toast.error('이름을 확인하세요.', toast.toastDefaultOption);
                }
            } else {
                toast.error('비밀번호를 확인하세요.', toast.toastDefaultOption);
            }
        } else {
            toast.error('이메일을 확인하세요.', toast.toastDefaultOption);
        }

    }

    //  value validate check logic
    const [emailchkMessage, setEmailchkmessage] = useState();
    const [registstate, setRegiststate] = useState({
        emailchkstate: false,
        pwchkstate: false,
    })
    const validateEmail = (e) => {
        const regexEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
        if (regexEmail.test(e.target.value)) {
            setEmailchkmessage(true)
            setRegiststate({
                ...registstate,
                emailchkstate: true
            })
        } else {
            setEmailchkmessage(false)
            setRegiststate({
                ...registstate,
                emailchkstate: false
            })
        }
    }

    const [chkemailinput, setChkemailinput] = useState(false)
    const [activeTimer, setActiveTimer] = useState(false)
    const [progress, setProgress] = useState(false);

    const regchange = () => {
        setRegiststate({
            ...registstate,
            emailchkstate: true
        })
    }
    const sendmailbtn = () => setTimeout(regchange, 60000)

    const clerartimeout = (a) => {
        if (sendvaliemail) {
            clearTimeout(a);
        }
    }

    const sendEmail = (e) => {
        setProgress(true)
        setRegiststate({
            ...registstate,
            emailchkstate: false
        })
        e.preventDefault();
        if (chkemailinput && activeTimer) {
            setActiveTimer(false)
            setTimeout(() => { setActiveTimer(true) }, 1)
        }
        if (registstate.emailchkstate) {
            instance.post(
                '/validation/sign-up/send-code',
                { email: e.target.form[1].value }
            ).then((res) => {
                setProgress(false)
                setChkemailinput(true)
                setActiveTimer(true)
                setRegiststate({
                    ...registstate,
                    emailchkstate: false
                })
                sendmailbtn();
                toast.success('인증번호가 전송되었습니다.', toast.toastDefaultOption);
            }).catch((err) => {
                setProgress(false)
                setRegiststate({
                    ...registstate,
                    emailchkstate: true
                })
                toast.error('인증번호 전송에 실패했습니다. 다시 시도해 주세요.', toast.toastDefaultOption);
            })
        } else {
            toast.error('올바른 이메일 형식을 넣어 주십시오', toast.toastDefaultOption);
        }
    }

    const [sendvaliemail, setSendvaliemail] = useState(false);

    const chkvalidateEmail = (e) => {
        e.preventDefault();
        if (e.target.form[2].value) {
            instance.get(
                '/validation/sign-up/check-code?email=' + e.target.form[1].value + '&code=' + e.target.form[2].value
            ).then((res) => {
                setChkemailinput(false)
                setSendvaliemail(true)
                setActiveTimer(false)

                clerartimeout(sendmailbtn());
                toast.success('인증이 완료되었습니다.', toast.toastDefaultOption);
            }).catch((err) => {
                toast.error('인증번호를 확인해주세요.', toast.toastDefaultOption);
            })
        } else {
            toast.error('인증번호 값이 비어있습니다.', toast.toastDefaultOption);
        }
    }

    const [validatepw, setValidatepw] = useState({ pw: '', pwchk: '' });
    const [chkmsg, setChkmsg] = useState();
    const pwvalidate = (e) => {
        setValidatepw({
            ...validatepw,
            [e.target.name]: e.target.value
        })
    }
    const regeng = /^(?=.*[A-Za-z])/
    const regnum = /^(?=.*\d)/
    const regex = /^(?=.*[@$!%*#?&])/
    const regtotal = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    useEffect(() => {
        // 영어 포함 정규식
        if (regeng.test(validatepw.pw)) {
            document.getElementById('regEng').style.color = 'green'
            document.getElementById('regEng').style.fontWeight = 'bold'
        } else {
            document.getElementById('regEng').style.color = 'gray'
            document.getElementById('regEng').style.fontWeight = ''
        }
        //      숫자포함 정규식
        if (regnum.test(validatepw.pw)) {
            document.getElementById('regNum').style.color = 'green'
            document.getElementById('regNum').style.fontWeight = 'bold'
        } else {
            document.getElementById('regNum').style.color = 'gray'
            document.getElementById('regNum').style.fontWeight = ''
        }
        // 특수문자 포함 정규식
        if (regex.test(validatepw.pw)) {
            document.getElementById('regEscape').style.color = 'green'
            document.getElementById('regEscape').style.fontWeight = 'bold'
        } else {
            document.getElementById('regEscape').style.color = 'gray'
            document.getElementById('regEscape').style.fontWeight = ''
        }
        if (validatepw.pw.length > 5) {
            document.getElementById('regLen').style.color = 'green'
            document.getElementById('regLen').style.fontWeight = 'bold'
            if (regtotal.test(validatepw.pw)) {
                if (validatepw.pw === validatepw.pwchk) {
                    setChkmsg('')
                    setRegiststate({
                        ...registstate,
                        pwchkstate: true
                    })
                } else {
                    setChkmsg('비밀번호가 일치 하지 않습니다.')
                    setRegiststate({
                        ...registstate,
                        pwchkstate: false
                    })
                }
            }
        } else {
            document.getElementById('regLen').style.color = 'gray'
            document.getElementById('regLen').style.fontWeight = ''
        }
    }, [validatepw.pw, validatepw.pwchk])

    const replaceTel = (e) => {
        e.value = e.value.replace(/(\d{4})(\d{4})/, '$1-$2')
    }


    return (
        <>
            <div className="Login">
                <Container>
                    <Row>
                        <Col className="Contents-Header" style={{ textAlign: 'center' }}><h2>회원가입</h2></Col>
                    </Row>
                    <Form className='LoginForm'>
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>이메일</Form.Label>
                            {
                                sendvaliemail ?
                                    <Button
                                        onClick={sendEmail}
                                        style={{ marginLeft: '5px', width: '60px', paddingTop: '0px', paddingBottom: '0px' }}
                                        disabled={true}>
                                        {
                                            !progress ?
                                                '인증' :
                                                <div className='spinner-border spinner-border-sm text-light' role='status' />
                                        }
                                    </Button> :
                                    <Button
                                        onClick={sendEmail}
                                        style={{ marginLeft: '5px', width: '60px', paddingTop: '0px', paddingBottom: '0px' }}
                                        disabled={!registstate.emailchkstate}>
                                        {
                                            !progress ?
                                                '인증' :
                                                <div className='spinner-border spinner-border-sm text-light' role='status' />
                                        }
                                    </Button>
                            }
                            {emailchkMessage ?
                                <span style={{ fontSize: '10pt', color: 'green', marginLeft: '10px' }}>올바른 이메일 형식입니다.</span>
                                : <span style={{ fontSize: '10pt', color: 'red', marginLeft: '10px' }}>이메일 형식을 확인해 주세요</span>

                            }

                            <Form.Control
                                type="email"
                                placeholder="이메일"
                                onChange={validateEmail} />
                            {chkemailinput &&
                                <Form.Control
                                    type='text'
                                    placeholder='인증번호 입력'
                                ></Form.Control>}
                            {chkemailinput && <Button onClick={chkvalidateEmail}>확인</Button>}
                            {activeTimer && <Timer active={activeTimer} />}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>비밀번호<small>(6자 이상 영어 소문자,특수문자,숫자 포함)</small></Form.Label>
                            <Form.Control
                                type="password"
                                name='pw'
                                placeholder="비밀번호"
                                onChange={pwvalidate}
                                readOnly={!sendvaliemail}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPasswordChk">
                            {/* <Form.Label>비밀번호확인</Form.Label> */}
                            <Form.Control
                                type="password"
                                name='pwchk'
                                placeholder="비밀번호확인"
                                onChange={pwvalidate}
                                readOnly={!sendvaliemail}
                            />
                            <div style={{ fontSize: '10pt', color: 'red' }}>{chkmsg}</div>
                            <div style={{ fontSize: '8pt', color: 'gray' }}>
                                <span id='regLen' style={{ marginRight: '10px' }}>{'✔ 6자리 이상'}</span>
                                <span id='regNum' style={{ marginRight: '10px' }}>{'✔ 숫자 1개 이상'}</span>
                                <span id='regEng' style={{ marginRight: '10px' }}>{'✔ 영어 소문자 1개 이상'}</span>
                                <span id='regEscape'>{'✔ 특수문자 1개 이상'}</span>
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>이름</Form.Label>
                            <Form.Control type="text" name='name' placeholder="이름" readOnly={!sendvaliemail} />
                        </Form.Group>

                        <Form.Group className='mb-3'>
                            <Form.Label htmlFor='phonNum'>전화번호</Form.Label>
                            <InputGroup>
                                <InputGroup.Text id="basic-addon3"> 010 </InputGroup.Text>
                                <Form.Control
                                    type='text'
                                    id="phonNum"
                                    placeholder='1234-5678'
                                    readOnly={!sendvaliemail}
                                    maxLength='9'
                                    onChange={(e) => {
                                        replaceTel(e.target)
                                    }}
                                />
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className='mb-3'>
                            <Form.Label>주소</Form.Label>
                            <InputGroup style={{ width: '300px' }}>
                                <Form.Control
                                    id="postcode--addressNumber"
                                    type='text'
                                    placeholder='우편번호'
                                    defaultValue={address.postalCode}
                                    readOnly={true}
                                />
                                <Button
                                    onClick={handleClick}
                                    style={{ zIndex: '0', backgroundColor: '#4187f5' }}
                                    variant="primary"
                                    disabled={!sendvaliemail}
                                >우편번호 검색
                                </Button>
                            </InputGroup>
                            <Form.Control
                                className='mb-3'
                                type='text'
                                id="postcode--Address"
                                readOnly={true}
                                placeholder='주소' />
                            <Form.Control
                                className='mb-3'
                                type='text'
                                id="postcode-detailAddress"
                                readOnly={!sendvaliemail}
                                ref={detAddrRef}
                                placeholder='상세주소' />
                        </Form.Group>

                        <Form.Group className='mb-3'
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    registOnclick();
                                }
                            }}>
                            <DatePickerForm
                            />
                        </Form.Group>
                        <Button
                            variant="primary"
                            size="lg"
                            id="Login-LoginForm__loginBtn"
                            onClick={registOnclick}
                            disabled={!sendvaliemail}
                        >
                            가입하기
                        </Button>
                    </Form>
                </Container >
            </div>
        </>
    );
}

export default Register;