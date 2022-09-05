import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import { instance } from '../template/AxiosConfig/AxiosInterceptor'
import Timer from '../template/Timer'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const steps = ['이메일을 입력하세요', '인증코드를 입력하세요', '비밀번호를 변경하세요.'];

export default function FindPassword({findpwshow,openFindpw,closeFindpw}) {

    const [email, setEmail] = React.useState();
    const [code, setCode] = React.useState();
    const [newPassword, setNewPassword] = React.useState();
    const [newPasswordChk, setNewPasswordChk] = React.useState();
    const [btnbool, setBtnbool] = React.useState(false);
    const [activeStep, setActiveStep] = React.useState(0);
    const [modalSpinner, setModalSpinner] = React.useState(false);
    const [activeTimer, setActiveTimer] = React.useState(true);
    
    const [number, setNumber] = React.useState(false);
    const [lower, setLower] = React.useState(false);
    const [count, setCount] = React.useState(false);
    const [escape, setEscape] = React.useState(false);

    const regeng = /^(?=.*[A-Za-z])/
    const regnum = /^(?=.*\d)/
    const regex = /^(?=.*[@$!%*#?&])/
    const reglen = /^[.]{6,}$/
    const regtotal = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;

    //function
    const successNotify = (e) => toast.success(e,toast.defaultOption);
    const errorNotify = (e) => toast.error(e,toast.defaultOption);

    const NextStep = () => {
        setModalSpinner(true);
        if (activeStep === 0) {
            instance.post('/validation/lose-password/send-code', { email: email })
                .then((res) => {
                    setActiveStep((prevActiveStep) => prevActiveStep + 1)
                    setModalSpinner(false);
                    successNotify('인증코드를 전송했습니다.');
                    
                })
                .catch((err) => {
                    // console.log(err);
                    setModalSpinner(false);
                    errorNotify('인증 코드 전송에 실패했습니다. 이메일을 확인해주세요.');
                })
        }
        if (activeStep === 1) {
            instance.get('/validation/sign-up/check-code?email=' + email + '&code=' + code)
                .then((res) => {
                    setActiveStep((prevActiveStep) => prevActiveStep + 1)
                    setBtnbool(true)
                    setModalSpinner(false);
                    successNotify('인증에 성공했습니다.');
                    setActiveTimer(false);
                })
                .catch((err) => {
                    // console.log(err)
                    setModalSpinner(false);
                    errorNotify('인증에 실패했습니다. 인증코드 또는 제한시간을 확인해주세요.');
                })
        }
        if (activeStep === 2 && !btnbool) {
            if(number && lower && count && escape) {
                instance.put('/validation/password', { email: email, code: code, newPassword: newPassword })
                .then((res) => {
                    setModalSpinner(false);
                    successNotify('비밀번호 변경에 성공하였습니다.');
                    closeFindpw()
                })
                .catch((err) => {
                    setModalSpinner(false);
                    errorNotify('비밀번호 변경에 실패했습니다. 다시 시도해 주십시오.');
                    window.location.href='./'
                })
            }else {
                errorNotify('비밀번호 변경에 실패했습니다. 새로운 비밀번호가 모든 조건을 만족하는지 확인하세요.');
                setModalSpinner(false);
            }
            
        }
    };

    const chkItem =(pw)=>{
        //영어 소문자 포함 정규식
        if(regeng.test(pw)) {
            document.getElementById('regEng').style.color='green'
            document.getElementById('regEng').style.fontWeight='bold'
            setLower(true);
        }else{
            document.getElementById('regEng').style.color='gray'
            document.getElementById('regEng').style.fontWeight=''
            setLower(false);
        }
        //숫자포함 정규식
        if(regnum.test(pw)) {
            document.getElementById('regNum').style.color='green'
            document.getElementById('regNum').style.fontWeight='bold'
            setNumber(true);
        }else{
            document.getElementById('regNum').style.color='gray'
            document.getElementById('regNum').style.fontWeight=''
            setNumber(false);
        }
        //특수문자 포함 정규식
        if(regex.test(pw)) {
            document.getElementById('regEscape').style.color='green'
            document.getElementById('regEscape').style.fontWeight='bold'
            setEscape(true);
        }else{
            document.getElementById('regEscape').style.color='gray'
            document.getElementById('regEscape').style.fontWeight=''
            setEscape(false);
        }
        //6자리 이상 정규식
        if(pw.length>5){
            document.getElementById('regLen').style.color='green'
            document.getElementById('regLen').style.fontWeight='bold'
            setCount(true);
        }else{
            document.getElementById('regLen').style.color='gray'
            document.getElementById('regLen').style.fontWeight=''
            setCount(false);
        }
    }

    

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const spinner = () => {
        if(modalSpinner){
            return (
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div> 
            );
        }else {
            return <></>
        }
    };

    return (
        <>
            <Box sx={{ width: '100%', height: '100%' }} style={{height:'450px', width:'400px', position:'relative', right:'10px', paddingTop:'80px'}}>
                <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => {
                        const stepProps = {};
                        const labelProps = {};
                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                {activeStep === steps.length ? (
                    <React.Fragment>
                        <Typography sx={{ mt: 2, mb: 1 }}>
                            All steps completed - you&apos;re finished
                        </Typography>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}&nbsp;&nbsp;&nbsp;&nbsp;{spinner()}</Typography>
                        {activeStep === 0 ?
                            <>
                                <Typography sx={{ mt: 2, mb: 1 }}>이메일을 입력해주세요</Typography>
                                <Box
                                    sx={{
                                        width: 500,
                                        maxWidth: '100%',
                                    }}
                                >
                                    <TextField fullWidth
                                        label="email"
                                        id="email"
                                        defaultValue={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value)
                                        }}
                                        onKeyDown={(e)=>{
                                            if(e.key==='Enter') {
                                                NextStep();
                                            };
                                        }}
                                    />
                                </Box>
                            </> : ''
                        }
                        {activeStep === 1 ?
                            <>
                                <Typography sx={{ mt: 2, mb: 1 }}>
                                    인증코드를 입력해주세요
                                    {activeTimer && <Timer active={activeTimer} />}
                                </Typography>
                                <Box
                                    sx={{
                                        width: 500,
                                        maxWidth: '100%',
                                    }}
                                >
                                    <TextField
                                        fullWidth
                                        label="code"
                                        id="code"
                                        onChange={(e) => {
                                            setCode(e.target.value)
                                            if(e.target.value.length > 6){
                                                e.target.value = e.target.value.substring(0,6);
                                                errorNotify('인증코드를 6자리 이하로 입력하세요.');
                                            }
                                        }}
                                        onKeyDown={(e)=>{
                                            if(e.key==='Enter') {
                                                NextStep();
                                            };
                                        }}
                                    />
                                </Box>
                            </> : ''
                        }
                        {activeStep === 2 ?
                            <>
                                <Typography sx={{ mt: 2, mb: 1 }}>변경할 비밀번호를 입력해주세요.</Typography>
                                <Box
                                    sx={{
                                        width: 500,
                                        maxWidth: '100%',
                                    }}
                                >
                                    <TextField
                                        type='password'
                                        fullWidth
                                        label="New Password"
                                        id="newPassword"
                                        autoFocus
                                        onChange={
                                            (e) => {
                                                setNewPassword(e.target.value)
                                                chkItem(e.target.value)
                                                if(newPasswordChk === e.target.value) setBtnbool(false);
                                                else setBtnbool(true)
                                            }
                                        }
                                    />
                                    <div style={{fontSize: '8pt', color:'gray'}}>
                                        <span id='regLen' style={{marginRight:'10px'}}>{'✔ 6자리 이상'}</span>
                                        <span id='regNum' style={{marginRight:'10px'}}>{'✔ 숫자 1개 이상'}</span>
                                        <span id='regEng' style={{marginRight:'10px'}}>{'✔ 영어 소문자 1개 이상'}</span>
                                        <span id='regEscape'>{'✔ 특수문자 1개 이상'}</span>
                                    </div>
                                    <TextField
                                        fullWidth
                                        type='password'
                                        label="New Password Check"
                                        id="newPasswordchk"
                                        style={{marginTop:'10px'}}
                                        onChange={
                                            (e) => {
                                                setNewPasswordChk(e.target.value)
                                                if(newPassword===e.target.value) setBtnbool(false);
                                                else setBtnbool(true)
                                            }
                                        }
                                    />
                                    <div style={{position : 'absolute'}}>
                                        {
                                            newPassword != newPasswordChk && (
                                                <Typography style={{color : 'red'}}>비밀번호가 일치하지 않습니다.</Typography>
                                            )
                                        }
                                    </div>
                                    
                                </Box>
                            </> : ''
                        }

                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            {/* <Button
                                color="inherit"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                sx={{ mr: 1 }}
                            >
                                Back
                            </Button> */}
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button
                                onClick={NextStep}
                                disabled={btnbool}
                            >
                                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                            </Button>
                        </Box>
                    </React.Fragment>
                )}
            </Box>
        </>
    );
}
