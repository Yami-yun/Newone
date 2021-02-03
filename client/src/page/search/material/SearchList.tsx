import React from 'react';
import styled from 'styled-components';
import GlobalStyle from 'globalStyles';
import {CLIENT_PATH, SERVER_PATH} from 'config/path';
import defaultImg from 'img/defaultPersonalImg.png';
import { media } from 'component/customMediaQuery';

const Whole = styled.section`
    width: 1000px;
    padding: 0 22px;
    margin-top: 95px;

    border: 1px solid #E8E8E8;
    border-radius: 8px;

    ${media.tablet}{
        width: 650px;
    }
    ${media.phone}{
        width: 100%;
    }
    
`;

const BoxTitle = styled.h1`
    margin-top: 22px;

    font-weight: 600;
    font-size: 1rem;
    color: #00A0FF;
`;

const RecentWorkImgList = styled.section`
    width: 96%;

    margin-top: 20px;
    padding: 10px 0;
    display: grid;
    grid-template-columns: repeat(5, 20%);
    column-gap: 3px;
    row-gap: 1.8rem;
    cursor: pointer;

    ${media.tablet}{
        grid-template-columns : repeat(4, 25%);
    }
    ${media.phone}{
        grid-template-columns : repeat(3, 33.333%);
    }
`;

const RecentWorkImgBox = styled.div`

    border-radius: 8px;
    text-align: center;
`;

const RecentWorkImg = styled.img`
    width: 172px;
    height: 172px;

    border: 3px solid #ccf5fd;
    border-radius: 12px;

    object-fit : contain;
    border-radius: 8px;

    ${media.tablet}{
        width: 140px;
        height: 140px;
    }
    ${media.phone}{
        width: 100px;
        height: 100px;
    }
`;

const NoSearchItem = styled.p`
    height: 172px;
    ${media.tablet}{
        height: 140px;
    }
    ${media.phone}{
        height: 100px;
    }
`;

interface Props{
    data?:any,
    title:string,
    searchTxt:string,
}

function SearchList({data, title, searchTxt}:Props){
    console.log(data);
    return (
    <>
        <GlobalStyle />
        <Whole>
            <BoxTitle>{`검색한 ${searchTxt} 과`} {title}</BoxTitle>
            <RecentWorkImgList>

                {/* 검색된 작품의 <a> 링크 경로는 _id 로 간다 , 검색된 작가의 이미지는 personalImgPath 경로를 조회한다. */}
                { data && data.map((tmp:any, index:number)=>(
                    <a key={index} href={`${CLIENT_PATH}${title === "관련된 작품" ? 'photo/' + tmp?._id : 'personal/' + tmp.key}`}>
                        <RecentWorkImgBox>
                            <RecentWorkImg src={`${SERVER_PATH}${title === "관련된 작가" ? tmp?.personalImgPath : tmp?.photoPath}`}/>
                            <p>{tmp.title}</p>
                        </RecentWorkImgBox>
                    </a>
                )) }
                

            </RecentWorkImgList>
            {!data?.length && <NoSearchItem>{`검색한 단어와 ${title} 정보가 없습니다.`}</NoSearchItem>}

        </Whole>
    </>);
}
export default SearchList;