import React from 'react';
import styled from 'styled-components';
import GlobalStyle from 'globalStyles';
import {CLIENT_PATH, SERVER_PATH} from 'config/path';
import { media } from 'component/customMediaQuery';
import { IRecentPhotoList } from 'page/main/material/MainInterface';

const Whole = styled.section`
    width: 1000px;
    padding: 20px 24px 40px 20px;
    margin-top: 95px;

    border: 1px solid #E8E8E8;
    border-radius: 8px;

    ${media.tablet}{
        width: 650px;
    }
    ${media.phone}{
        width: 340px;
        padding: 20px 23px 40px 21px;
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

    ${media.phone}{
        font-weight: 600;
    }

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

    margin : 0 6px;

    object-fit : contain;
    border-radius: 8px;

    ${media.tablet}{
        width: 138px;
        height: 138px;
    }
    ${media.phone}{
        width: 86px;
        height: 86px;
    }
`;

// 최근 작품 리스트 컴포넌트 IRecentPhotoList
function RecentWorkList({recentPhotoList}:{recentPhotoList:IRecentPhotoList[]}){

    return (
    <>
        <GlobalStyle />
        <Whole>
            <BoxTitle>최신 작품</BoxTitle>
            <RecentWorkImgList>
                { recentPhotoList && recentPhotoList.map((tmp:IRecentPhotoList, index:number)=>(
                    <a key={index} href={`${CLIENT_PATH}photo/${tmp._id}`}>
                        <RecentWorkImgBox src={`${SERVER_PATH}${tmp.photoPath}`}/>
                    </a>
                )) }
            </RecentWorkImgList>
        </Whole>
    </>);
}
export default RecentWorkList;