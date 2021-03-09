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
        max-width: 320px;
    }
    
`;

const BoxTitle = styled.h1`
    margin-top: 22px;

    font-weight: 600;
    font-size: 1rem;
    color: #00A0FF;
`;

const RecentWorkImgList = styled.a`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 20px;
    padding: 10px 0;

    cursor: pointer;

    ${media.tablet}{
        margin-top: 20px;
        padding: 10px 0;
    }
    ${media.phone}{
        margin-top: 20px;
        padding: 10px 0;
    }
`;

const RecentWorkImgBox = styled.div`
    width: 172px;
    border-radius: 8px;
    text-align: center;
    margin: 5px 9.2px;

    ${media.tablet}{
        width: 132px;
        margin: 5px 9px;
    }
    ${media.phone}{
        width: 120px;
        margin: 5px 7px;
    }
`;

const RecentWorkImg = styled.img`
    width: 172px;
    height: 172px;

    border: 3px solid #ccf5fd;
    border-radius: 12px;

    object-fit : contain;
    border-radius: 8px;

    ${media.tablet}{
        width: 132px;
        height: 132px;
    }
    ${media.phone}{
        width: 120px;
        height: 120px;
    }
`;

const NoSearchItem = styled.p`
    height: 172px;
    ${media.tablet}{
        height: 132px;
    }
    ${media.phone}{
        height: 120px;
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