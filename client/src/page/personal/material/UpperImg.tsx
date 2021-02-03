import React from 'react';
import styled from 'styled-components';
import GlobalStyle from 'globalStyles';
import upperImg from 'img/upperImg.png'
import { SERVER_PATH } from 'config/path';
import defaultImg from 'img/defaultPersonalImg.png';
import { media } from 'component/customMediaQuery';

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
    ${media.phone}{
        width: 320px;
        height: 200px;
    }
`;

function UpperImg({personalInfo:personalInfo, userData:userData}:any){

    console.log(personalInfo);

    return (
    <>
        <GlobalStyle />
        <Whole>
            <UpperImgBox src={!personalInfo?.upperImgName ? defaultImg : `${SERVER_PATH}${personalInfo?.upperImgPath}`}/>
        </Whole>
    </>);
}
export default UpperImg;