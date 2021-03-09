import React from 'react';
import styled from 'styled-components';
import GlobalStyle from 'globalStyles';
import upperImg from 'img/upperImg.png'
import { SERVER_PATH } from 'config/path';
import defaultImg from 'img/defaultPersonalImg.png';
import { media } from 'component/customMediaQuery';
import { IUpperImgProps } from 'page/personal/material/PersonalInterface';

const Whole=styled.section`
    width: 1000px;
    height: 452px;
    display: flex;
    justify-content: center;

    border-bottom: 3px solid #d1d2d3;

    ${media.tablet}{
        width: 600px;
        height: 300px;
    }

    ${media.phone}{
        width: 320px;
        height: 200px;
    }
`;

const UpperImgBox = styled.img`
    object-fit: contain;
    /* transform : translateY(center); */
    ${media.phone}{
        width: 320px;
        height: 200px;
    }
`;

// 개인 페이지 상단 이미지 컴포넌트
function UpperImg({upperImgName, upperImgPath }:IUpperImgProps){

    return (
    <>
        <GlobalStyle />
        <Whole>
            <UpperImgBox src={!upperImgName ? defaultImg : `${SERVER_PATH}${upperImgPath}`}/>
            {/* <UpperImgBox src={!personalInfo?.upperImgName ? defaultImg : `${SERVER_PATH}${personalInfo?.upperImgPath}`}/> */}
        </Whole>
    </>);
}
export default UpperImg;