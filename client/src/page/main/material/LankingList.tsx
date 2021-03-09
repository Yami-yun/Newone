import React, { useRef } from 'react'
import styled from 'styled-components';
import GlobalStyle from 'globalStyles';
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CLIENT_PATH, SERVER_PATH } from 'config/path';
import { media } from 'component/customMediaQuery';

import first from 'img/first.png';

const Whole = styled.section`
    width: 1000px;
    height: 323px;
    padding-left: 22px;
    margin-top: 90px;

    border: 1px solid #E8E8E8;
    border-radius: 8px;

    ${media.tablet}{
        width: 650px;
        height: 250px;
        margin-top: 200px;
    }

    ${media.phone}{
        width: 340px;
        padding: 0px;
    }

    ${media.mini}{
        width: 310px;
    }
`;

const BoxTitle = styled.h1`
    margin-top: 22px;

    font-weight: 700;
    font-size: 1.4rem;
    color: #00A0FF;
    margin-left: 1em;
`;

const LankingImgList = styled.div`
    width: 96.6%;
    display: flex;
    overflow-x: hidden;

    & a .first{
        position: absolute;
        top: -34px;
        left: 0px;
        width: 88px;
        height: 88px;

        ${media.tablet}{
            top: -28px;
            left: 7px;
            width: 72px;
            height: 72px;
        }

        ${media.phone}{
            top: -28px;
            left: 5px;
            width: 62px;
            height: 62px;
        }
    }

    
`;

const LankingImgBox = styled.img`
    width: 200px;
    height: 200px;
    margin-right: 1.65em;

    /* background: #C4C4C4; */
    object-fit : contain;
    border: 3px solid #ccf5fd;
    border-radius: 8px;

    ${media.tablet}{
        width: 130px;
        height: 130px;
        font-size: 10px;
    }
    ${media.phone}{
        margin-right : 0;
        width: 100px;
        height: 100px;
    }

    

`;

const SwipeBtn = styled.button`
    width: 50px;
    height: 200px;

    font-size: 2rem;
    font-weight: 700;

    ${media.tablet}{
        width: 50px;
        height: 130px;
    }
    ${media.phone}{
        width: 50px;
        height: 100px;
    }
`;

// 금일 랭킹 리스트 컴포넌트
function LankingList({lankList}:any) {
    console.log(lankList);
    const date = new Date();

    const m = date.getMonth() + 1 >= 10 ? (date.getMonth() + 1).toString() : "0"+(date.getMonth() + 1).toString();
    const d = date.getDate() >= 10 ? date.getDate().toString() : "0"+date.getDate().toString();
    const scrollRef = useRef<any>(null);

    // lank box scroll
    const onScrollHandler = (scrollVal:number) => { scrollRef.current.scrollLeft += scrollVal; };

    return (
        <>
            <GlobalStyle/>
            <Whole>
                <BoxTitle>{m}월 {d}일 오늘의 랭킹</BoxTitle>
                <div style={{ display: "flex", justifyContent:"center", position:"relative", marginTop:20}}>
                    <SwipeBtn onClick={()=>{onScrollHandler(-2000);}} style={{left:0}}> <FontAwesomeIcon icon={faAngleLeft}/> </SwipeBtn>

                    <LankingImgList ref={scrollRef}>
                        { lankList && lankList.map((tmp:any, index:number)=>(
                            <a key={index} href={`${CLIENT_PATH}photo/${tmp._id}`}>
                                {index === 0 && <img className={'first'} src={first}/>}
                                <LankingImgBox src={`${SERVER_PATH}${tmp.photoPath}`}/>
                            </a>
                        )) }
                    </LankingImgList>
                    
                    <SwipeBtn onClick={()=>{onScrollHandler(2000);}} style={{right:0}}> <FontAwesomeIcon icon={faAngleRight}/> </SwipeBtn>
                </div>
            </Whole>
        </>
    )
}

export default LankingList
