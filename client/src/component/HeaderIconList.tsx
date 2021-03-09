import React, { useEffect, useState } from 'react'
import { faHome, faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from 'styled-components';
import defaultImg from '../img/defaultPersonalImg.png';
import { Link } from 'react-router-dom';
import { logoutUser } from 'redux/actions/userAction';
import { useDispatch } from 'react-redux';
import { media } from 'component/customMediaQuery';

const Whole = styled.section`
    width: 240px;
    height: 56px;
    
    display: flex;
    justify-content:flex-end;
    align-items: center;

    ${media.phone}{
        width: 114px;
        height: 40px;
    }

    ${media.mini}{
        width: 110px;
        height: 40px;
    }
`;

const IconBox = styled.div`
    width: 44px;
    height: 44px;
    margin-left: 0.3em;

    text-align: center;
    font-size: 2.5rem;
    line-height: 44px;
    cursor: pointer;

    ${media.tablet}{
        width: 40px;
        height: 40px;
        line-height: 40px;
    }

    ${media.phone}{
        width: 36px;
        height: 32px;
        line-height: 32px;
        font-size: 2.8rem;
    }

    ${media.mini}{
        margin-left: 0em;
        width: 34px;
        font-size: 2.4rem;
    }
`;

const PersonalIconImg = styled.img`
    width: 35px;
    height: 35px;
    border-radius: 18px;
    

    ${media.phone}{
        width: 30px;
        height: 30px;
    }
`;

const PersonalMenuBox = styled.div`
    position: absolute;
    
    top: 54px;
    left: -80px;
    width: 120px;

    z-index: 6;

    font-size: 1rem;
    text-align: center;
    box-shadow: 2px 2px 3px 1px #9e9e9e;
    background: #f7fafa;
    animation: amenu 0.3s ease-in-out;


    ${media.phone}{
        width:90px;
        left: -60px;
    }

    @keyframes amenu{
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

`;

const AlarmBox = styled.div`
    position: absolute;
    top: 52px;
    left: -410px;
    width: 500px;
    height: 240px;
    padding : 2px 6px 12px 12px;
    z-index:10;
    overflow-y: auto;
    box-shadow: 2px 2px 3px 1px #9e9e9e;
    background: #f7fafa; 

    border: 1px solid black;

    scrollbar-face-color: #aaaaaa;
    scrollbar-track-color: #f7fafa;

    &::-webkit-scrollbar {width: 14px;}
    &::-webkit-scrollbar-thumb{
        background:#aaaaaa;
    }

    ${media.tablet}{
        left: -270px;
        width: 360px;
        height: 200px;
    }
    ${media.phone}{
        top: 38px;
        left: -210px;
        width: 270px;
    }
`;

const AlarmTxt = styled.p`
    height:40px;
    border-bottom: 2px dashed;

    line-height: 40px;
    font-size: 0.8rem;
    font-weight: 600;
    color: #afafaf;

    &:hover{
        font-size: 0.85rem;
        font-weight: 900;
    }
`;

const PersonalMenuItem = styled.div`
    margin: 4px 0;
    font-weight: 500;
    color: #38b6ff;

    &:hover{
        color:#E3A654;
    }
`;

// Header 안에 우측에 아이콘 리스트 컴포넌트
function HeaderIconList({userData}:any) {

    const [isPersonalMenu, setIsPersonalMenu] = useState<boolean>(false);       // 메뉴 클릭 여부 상태 변수
    const [isLogin, setIsLogin] = useState<boolean>(false);                     // 로그인 여부 상태 변수
    const [isShowAlarm, setIsShowAlarm] = useState<boolean>(false);             // 알람 아이콘 클릭 여부
    const dispatch = useDispatch();

    useEffect(() => {
        setIsLogin(userData?.isAuth);
    }, [userData]);

    // 로그아웃 아이콘 클릭 시, 로그아웃 실행.
    const logout = ():void => {
        logoutUser().then(
            response => {
                dispatch(response);
            }
        );
        setIsLogin(false);
        setIsPersonalMenu(false);
    };

    // 알람 아이콘 클릭 시, 알람 창을 보여준다.
    const showAlarm = ():void => {
        setIsShowAlarm(!isShowAlarm);
        setIsPersonalMenu(false);
    };

    // 헤더에서 개인 이미지 버튼 클릭시 미니 메뉴 버튼 on / off
    const showPersonalMenu = ():void => {
        console.log(isPersonalMenu);
        setIsPersonalMenu(!isPersonalMenu);
        setIsShowAlarm(false);
    };

    // 서버에서 가져온 알람 데이터 생성 시간이 현재 시간으로부터 얼마나 지났는지 계산해서 반환
    const timeCheck = (date:string):string => {
        
        const _y = Number(date.slice(0,4));
        const _mon = Number(date.slice(5,7));
        const _d = Number(date.slice(8,10));
        const _h = Number(date.slice(11,13))+9;
        const _min = Number(date.slice(14,16));

        const t = new Date();
        const y = t.getFullYear();
        const mon = t.getMonth() + 1;
        const d = t.getDate();
        const h = t.getHours();
        const min = t.getMinutes();

        if(y !== _y) return ` (${y-_y} 년 전)`;
        if(mon !== _mon) return ` (${mon-_mon} 개월 전)`;
        if(d !== _d) return ` (${d-_d} 일 전)`;
        if(h !== _h) return ` (${h-_h} 시간 전)`;
        if(min !== _min) return ` (${min-_min} 분 전)`;
        return "";
    };

    // 알람 내용이 알람창보다 클 경우 ... 형태로 줄인다.
    const strCheck = (str:string):string =>{
        if(window.innerWidth > 1000) return (str.length < 32 ? str.slice(0,32) : str.slice(0,32) + "...");
        else if(window.innerWidth > 498) return (str.length < 25 ? str.slice(0,25) : str.slice(0,25) + "...");
        else return (str.length < 16 ? str.slice(0,16) : str.slice(0,16) + "...");
        
    };

    return (
        <Whole>
            {/* Home Icon */}
            <IconBox>
                <Link to="/">
                    <FontAwesomeIcon icon={faHome} style={{color:"#00A0FF", marginLeft: 0}} />
                </Link>
            </IconBox>

            {/* AlarmIcon */}
            {isLogin && <IconBox style={{position:"relative"}}>
                <FontAwesomeIcon icon={faBell} style={{color:"#00A0FF"}} onClick={showAlarm}/>

                {isShowAlarm && <AlarmBox>
                    {userData?.alarm.length ? userData.alarm.map((tmp:any, index:number)=>(
                        <Link key={index} to={`/photo/${tmp.photoKey}`}>
                            <AlarmTxt >{strCheck(tmp.str) + timeCheck(tmp.createDate)}</AlarmTxt>
                        </Link>
                    )) : <AlarmTxt>현재 기록된 알람이 없습니다.</AlarmTxt>}
                    </AlarmBox>}
            </IconBox>}

            <div style={{position:"relative"}}>

            </div>

            {/* Personal Icon */}
            <IconBox onClick={showPersonalMenu} style={{position:"relative"}}>
                {isPersonalMenu && <PersonalMenuBox>
                    {userData?.role===3 && <Link to={`/admin`}>
                        <PersonalMenuItem onClick={()=>{setIsPersonalMenu(false);} }>관리자 페이지</PersonalMenuItem>
                    </Link>}

                    {/* 개인 페이지 이동 */}
                    <Link to={`/personal/${userData?.key}`}>
                        <PersonalMenuItem onClick={()=>{setIsPersonalMenu(false);} }>마이 페이지</PersonalMenuItem>
                    </Link>

                    {/* 작품 업로드 페이지 이동 */}
                    <Link to={'/upload'}>
                        <PersonalMenuItem>작품 등록</PersonalMenuItem>
                    </Link>
                    
                    {/* 로그아웃 / 로그인 */}
                    {isLogin ? 
                    <Link to={'/'}><PersonalMenuItem onClick={logout}>로그 아웃</PersonalMenuItem> </Link>
                    : <Link to={'/login'}><PersonalMenuItem>로그인</PersonalMenuItem></Link>}
                </PersonalMenuBox>}


                <PersonalIconImg src={defaultImg} alt="default"/>
            </IconBox>
            
        </Whole>
    )
}

export default HeaderIconList
