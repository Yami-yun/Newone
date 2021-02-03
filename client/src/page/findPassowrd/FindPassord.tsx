import React, {useState} from 'react';
import styled from 'styled-components';
import GlobalStyle from 'globalStyles';
import {InputBox} from 'component/input';
import { VerifyBtn } from 'component/button';
import { getVerifiedCode, modifyPassword } from 'redux/actions/userAction';
import { useDispatch, useSelector } from 'react-redux';
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';
import {useHistory} from 'react-router';
import { media } from 'component/customMediaQuery';
import background from 'img/background.jpg';

const Whole=styled.section`
    background-size: cover;

    width: 100%;
    height: 100vh;

    display: flex;
    justify-content: center;
    align-items: center;
`;

const RegisterScreen = styled.div`
    width: 508px;
    height: 600px;
    position: relative;

    background: #FFFFFF;
    border-radius: 8px;

    display: flex;
    justify-content: center;
    align-items: center;

    ${media.phone}{
        width: 310px;
        height: 440px;
    }
`;

const IconBox = styled.div`
    position: absolute;
    top: 30px;
    left: 30px;
    font-size: 2rem;
    cursor: pointer;
`;

const RegisterBox = styled.article`
    width: 74%;
    height: 63.3%;
    padding: 90px 0 49px;

    display:flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;

    ${media.phone}{
        width: 88%;
        padding: 80px 0 49px;
    }
`;

const SiteTitle=styled.h1`
    margin-bottom: 3.5rem;
    font-weight: 800;
    font-size: 42px;
    color: #00A0FF;

    ${media.phone}{
        margin-bottom: 2.5rem;
        font-size: 32px;
    }
`;

const RegisterForm=styled.form`
    width: 100%;
    padding: 27px 0 40px;

    display:flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;

    background: #daf8ff;
    border-radius: 8px;
`;

const initRegisterForm = {
    email: "",
    password: "",
    confirmPassword: "",
};

function FindPassword(){
    const dispatch = useDispatch();
    const history = useHistory();
    const [registerForm, setRegisterForm] = useState(initRegisterForm);

    const [isVerified, setIsVerified] = useState<number>(0);        // 0: 인증 넘버 아직 수신 전 ,  1: 인증 넘버 수신 받음,  2: 인증 완료
    const [verifiedCode, setVerifiedCode] = useState<string>();
    const [checkVerifiedCode, setCheckVerifiedCode] = useState<string>();

    const emailCheck = (email:string) => {
        const emailRegex = /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
        if(!emailRegex.test(email)) return false;
        return true;
    };

    // email, password, 2차 password, authorname state 저장
    const onEmailHandler = (e:any) => { setRegisterForm({...registerForm, email: e.target.value}); };
    const onPasswordHandler = (e:any) => { setRegisterForm({...registerForm, password: e.target.value}); };
    const onConfirmPasswordHandler = (e:any) => { setRegisterForm({...registerForm, confirmPassword: e.target.value}); };
    const onVerifiedCodeHandler = (e:any) => { setVerifiedCode(e.target.value);  };

    // 인증 번호를 보낸다.
    const onSendVerifiedNumberHandler = (e:any) => { 
        e.preventDefault();
        if(!emailCheck(registerForm.email)) return alert('이메일 형식이 아닙니다.');

        setIsVerified(1);

        getVerifiedCode({email: registerForm.email, str: "비밀번호 찾기"}).then(
        response=> {
            if(response.payload.success) setCheckVerifiedCode(response.payload.verificationNumber.toString());
        });

        return alert('인증 번호가 발송되었습니다.');
    };

    const onCheckVerifiedNumberHandler = (e:any) => {
        e.preventDefault();
        
        if(checkVerifiedCode !== verifiedCode) {
            setVerifiedCode("");
            return alert('인증 번호가 일치하지 않습니다.')
        };

        setIsVerified(2);
        // return alert('인증 번호가 일치합니다.');
    }

    // 회원가입 양식 서버로 제출
    const onSubmitHandler = (e:any) => {
        e.preventDefault();

        if(isVerified !== 2) return alert('이메일 인증을 진행해주십시오.');
        // 이메일 형식 확인
        if(!emailCheck(registerForm.email)) return alert('이메일 형식이 아닙니다.');
        // password 양식 확인
        if(registerForm.password.length < 8) return alert('비밀번호는 최소 8자여야합니다.');
        if(registerForm.password !== registerForm.confirmPassword) return alert('비밀번호와 비밀번호 확인은 같아야합니다.');

        const body = {
            email : registerForm.email,
            password : registerForm.password,
        };

        // 서버로 회원가입 형식 보냄
        modifyPassword(body)
        .then(response => {
            if (response.payload.success) {
                dispatch(response);
                history.push("/login");
            }
        });
    };

    const VerifyUI = () => {
        if(isVerified === 0) {
            return <VerifyBtn type="button" onClick={onSendVerifiedNumberHandler}>인증번호 받기</VerifyBtn>;
        }
        else if(isVerified === 1) {
            return  <VerifyBtn type="button" onClick={onCheckVerifiedNumberHandler}>인증번호 확인</VerifyBtn>;
        }
        else{
            return <VerifyBtn type="button" >확인 완료</VerifyBtn>;
        }
    }

    return (
    <>
        <GlobalStyle />

        <Whole style={{backgroundImage:`url(${background})`}}>
            <RegisterScreen>
                {/* 이전 로그인 창으로 가는 버튼 */}
                <IconBox>
                    <Link to="/login">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </Link>
                </IconBox>
                {/* 비밀번호 찾기 양식 */}
                <RegisterBox>
                    <SiteTitle>Newone</SiteTitle>
                    <RegisterForm onSubmit={onSubmitHandler}>

                        <InputBox style={{width:"80%"}} placeholder="이메일" value={registerForm.email} onChange={onEmailHandler}/>
                        <div style={{display: "flex", width:"80%" }}>
                            <InputBox defaultValue={""} onChange={onVerifiedCodeHandler} style={{width:"57%"}} placeholder="이메일 인증번호" />
                            {VerifyUI()}
                        </div>

                        {isVerified === 2 &&
                        <>
                            <InputBox style={{width:"80%"}} placeholder="재설정 비밀번호" defaultValue={""} onChange={onPasswordHandler} maxLength={16} type="password"/>
                            <InputBox style={{width:"80%"}} placeholder="비밀번호 확인" defaultValue={""} onChange={onConfirmPasswordHandler} maxLength={16} type="password"/>
                            <VerifyBtn style={{width:"80%"}} type="submit">비밀번호 재설정하기</VerifyBtn>
                        </>
                        }
                        
                    </RegisterForm>
                </RegisterBox>
            </RegisterScreen>
        </Whole>
    </>);
}
export default FindPassword;