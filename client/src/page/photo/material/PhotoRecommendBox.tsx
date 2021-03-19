import React from 'react';
import styled from 'styled-components';
import GlobalStyle from 'globalStyles';
import {SERVER_PATH, CLIENT_PATH} from 'config/path';
import { media } from 'component/customMediaQuery';

const Whole=styled.section`
    width: 180px;
    padding: 20px 0;

    display: flex;
    flex-direction: column;
    align-items: center;
    background:#faf1f1;

    ${media.tablet}{
        width: 120px;
    }

    ${media.phone}{
        display:none;
    }

`;

const RecommendTitle = styled.div`
    width: 85%;
    height: 48px;
    margin-top:0.2rem;

    background: #00A0FF;
    border-radius: 8px;

    font-weight: 700;
    font-size: 1.2rem;
    line-height: 48px;
    text-align: center;
    color: #FFFFFF;

    /* ${media.tablet}{
        width: 120px;
    } */
`;

const RecommendPhoto = styled.img`
    width: 160px;
    height: 160px;
    margin-top: 14px;
    object-fit: contain;
    ${media.tablet}{
        width: 110px;
        height: 110px;
    }
`;

// 작품 추천 리스트 컴포넌트
function PhotoRecommendBox({recommendPhotoList}:any){
    return (
    <>
        <GlobalStyle />
        <Whole>
            <RecommendTitle>추천작</RecommendTitle>
            { recommendPhotoList && recommendPhotoList.map((tmp:any, index:number)=>{
                return (
                    <a key={index} href={`${CLIENT_PATH}photo/${tmp._id}`}>
                        <RecommendPhoto src={`${SERVER_PATH}${tmp.photoPath}`}/> 
                    </a>
                );
            }) }
            
        </Whole>
    </>);
}
export default PhotoRecommendBox;