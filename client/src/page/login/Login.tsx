import React, { useState } from 'react';
import styled from 'styled-components';
import GlobalStyle from 'globalStyles';
import {InputBox} from 'component/input';
import {BlueBtn} from 'component/button';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from 'redux/actions/userAction';
import {useHistory} from 'react-router';
import { media } from 'component/customMediaQuery';
import background from 'img/background.jpg'
import loginImg from 'img/login_left_img.jpg'

const Whole=styled.section`
    background-size: cover;

    width: 100%;
    height: 100vh;

    display: flex;
    justify-content: center;
    align-items: center;
`;

const LoginScreen = styled.div`
    width: 1000px;
    height: 600px;
    padding: 110px 94px;

    background: #FFFFFF;
    border-radius: 8px;

    display: flex;
    justify-content: center;
    align-items: center;

    ${media.tablet}{
        width: 740px;
        padding: 110px 50px;
    }

    ${media.phone}{
        width: 310px;
        height: 430px;
        padding: 110px 20px;
    }
`;

const LoginScreenLeft = styled.img`
    width: 380px;
    height: 380px;
    margin-right: 4vw;

    border-radius: 8px;
    ${media.tablet}{
        width: 280px;
        height: 280px;
    }

    ${media.phone}{
        display: none;
    }
`;

const LoginScreenRight = styled.article`
    width: 380px;
    height: 380px;

    display:flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;

    ${media.phone}{
        width: 280px;
    }

`;

const SiteTitle=styled.h1`
    margin-bottom: 57px;
    font-weight: 800;
    font-size: 42px;
    color: #00A0FF;

    ${media.phone}{
        margin-bottom: 2.5rem;
        font-size: 32px;
    }
`;

const LoginLayout=styled.article`
    width: 353px;
    height: 254px;

    display:flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;

    background: #daf8ff;
    border-radius: 8px;

    ${media.phone}{
        width: 100%;
    }
`;

const LoginInputBox=styled.form`
    width: 100%;

    display:flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;
`;

const LoginSubBtnList=styled.article`
    width: 80%;
    display: flex;
    justify-content:space-around;
    margin-top: 18px;
`;

// 회원 가입, 아이디 찾기 비번 찾기
const LoginSubBtn=styled.button`
    font-weight: 800;
    font-size: 14px;
    color: #00A0FF;
    background: #E6FAFF;
    cursor:pointer;

    &:hover{
        font-size:15px;
    }
`;

// 로그인 화면 컴포넌트
function Login(){
    const [email, setEmail] = useState<string>("");
    const [password, setpassword] = useState<string>("");
    const dispatch = useDispatch();
    const history = useHistory();

    // email input 변경 내용 저장
    const onEmailHandler = (e:any) => {
        setEmail(e.target.value);
    };

    // pw input 변경 내용 저장
    const onPasswordHandler = (e:any) => {
        setpassword(e.target.value);
    };

    // 사용자가 입력한 로그인 데이터 폼을 서버로 보냄
    const onSubmitHandler = (e:any) => {
        e.preventDefault();
        const emailRegex = /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

        // 로그인할 때 이메일 양식으로 입력하지 않았을 경우.
        if(!emailRegex.test(email)){
            return alert('이메일 형식이 아닙니다.');
        }
        
        if(password.length < 8) return alert('비밀번호는 최소 8자여야합니다.');

        // 서버로 보낼 데이터 body
        const body = {
            email,
            password,
        };

        // 로그인 api
        loginUser(body)
        .then(response => {

            // 로그인 성공 시, 로그인 정보 저장 및 main 화면으로 이동
            if(response.payload.success){
                dispatch(response);
                history.push("/");
            }else{
                // 로그인 실패 시, 경고 문구 출력
                alert(response.payload.message);
            }
        });
    };

    return (
    <>
        <GlobalStyle />
        <Whole style={{backgroundImage:`url(${background})`}}>
            <LoginScreen>
                {/* 로그인 창 왼쪽에 위치한 이미지 */}
                <LoginScreenLeft src={loginImg}/>

                <LoginScreenRight>
                    <SiteTitle>Newone</SiteTitle>

                    <LoginLayout>
                        {/* 로그인 폼 양식 */}
                        <LoginInputBox onSubmit={onSubmitHandler} >
                            <InputBox style={{width:"80%", fontSize:"1.1rem"}} placeholder="이메일" defaultValue={email} onChange={onEmailHandler} />
                            <InputBox style={{width:"80%", fontSize:"1.1rem"}} placeholder="비밀번호" defaultValue={password} onChange={onPasswordHandler} maxLength={16} type="password"/>
                            <BlueBtn style={{width:"80%"}} type="submit" >로그인</BlueBtn>
                        </LoginInputBox>

                        {/*  회원 가입,  비밀 번호 찾기 버튼*/}
                        <LoginSubBtnList >
                            <Link to="/register"><LoginSubBtn>회원 가입</LoginSubBtn></Link>
                            <Link to="/findpassword"><LoginSubBtn>비밀 번호 찾기</LoginSubBtn></Link>
                        </LoginSubBtnList>
                    </LoginLayout>
                </LoginScreenRight>
            </LoginScreen>
        </Whole>
    </>);
}
export default Login;