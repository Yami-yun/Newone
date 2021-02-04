import React from 'react';
import styled from 'styled-components';
import GlobalStyle from 'globalStyles';
import {CLIENT_PATH, SERVER_PATH} from 'config/path';
import { media } from 'component/customMediaQuery';

const Whole = styled.section`
    width: 1000px;
    padding: 20px 22px 40px;
    margin-top: 95px;

    border: 1px solid #E8E8E8;
    border-radius: 8px;

    ${media.tablet}{
        width: 650px;
    }
    ${media.phone}{
        width: 340px;
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

const RecentWorkImgList = styled.div`
    margin-top: 30px;
    
    display: grid;
    grid-template-columns : repeat(5, 20%);
    column-gap: 3px;
    row-gap: 1.8rem;

    ${media.tablet}{
        grid-template-columns : repeat(4, 25%);
    }
    ${media.phone}{
        grid-template-columns : repeat(3, 33.333%);

    }
`;

const RecentWorkImgBox = styled.img`
    width: 178px;
    height: 178px;
    border: 3px solid #ccf5fd;
    border-radius: 12px;

    object-fit : contain;
    border-radius: 8px;

    ${media.tablet}{
        width: 140px;
        height: 140px;
    }
    ${media.phone}{
        width: 90px;
        height: 90px;
    }
`;

// 최근 작품 리스트 컴포넌트
function RecentWorkList({recentPhotoList}:any){
    console.log(recentPhotoList);
    return (
    <>
        <GlobalStyle />
        <Whole>
            <BoxTitle>최신 작품</BoxTitle>
            <RecentWorkImgList>
                { recentPhotoList && recentPhotoList.map((tmp:any, index:number)=>(
                    <a key={index} href={`${CLIENT_PATH}photo/${tmp._id}`}>
                        <RecentWorkImgBox src={`${SERVER_PATH}${tmp.photoPath}`}/>
                    </a>
                )) }
            </RecentWorkImgList>
        </Whole>
    </>);
}
export default RecentWorkList;