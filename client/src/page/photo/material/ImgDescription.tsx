import React from 'react';
import styled, {css} from 'styled-components';
import GlobalStyle from 'globalStyles';
import { setPhotoNew } from 'redux/actions/photoAction';
import {useDispatch} from 'react-redux';
import {SERVER_PATH, CLIENT_PATH} from 'config/path';
import defaultImg from 'img/defaultPersonalImg.png';
import { media } from 'component/customMediaQuery';

const Whole=styled.section`
    width: 90%;
    padding: 26px 30px;
    border: 1px solid #E8E8E8;

    ${media.phone}{
        padding: 22px 22px;
    }
`;

const ImgDescriptionTop = styled.div`
    display: flex;
    justify-content:space-between;
`;

const ImgTitle = styled.h2`
    font-weight: normal;
    font-size: 1.25rem;
    line-height:35px;
    color: #00A0FF;
`;

const NewBtn = styled.button<{isNew:boolean}>`
    width: 57px;
    height: 33px;
    margin-right: 14px;

    font-weight: normal;
    font-size: 1.5rem;
    font-weight: 500;
    color: #00A0FF;

    ${props=> props.isNew && css`
        font-weight: 900;
        margin-right: 22px;
    `};

    ${media.tablet}{
        margin-right: 2px;
    }
    ${media.phone}{
        margin-right: -2px;
    }
`;

const PersonalImg = styled.img`
    width: 38px;
    height: 38px;
    margin-left:10px;

    background: #FFFFFF;
    border-radius: 18px;
`;

const ImgTagList = styled.div`
    display: flex;
`;

const ImgTag = styled.p`
    margin-right: 10px;

    font-weight: normal;
    font-size: 14px;
    color: #00A0FF;
`;

const ImgDescriptionMiddle = styled.div`
    height: 21px;
    margin-top: 18px;
    display: flex;
`;

const ImgNewCount = styled.p`
    margin-right: 15px;
    font-weight: 600;
    font-size: 1rem;
    color: #00A0FF;
`;

const ImgCreateDate = styled.p`
    font-weight: normal;
    font-size: 1rem;
    color: #00A0FF;
`;

const ImgDescriptionBottom = styled.div`
    height: 140px;
    margin-top: 18px;
    padding: 10px;

    font-weight: normal;
    font-size: 0.875rem;
    color: #00A0FF;
    white-space:normal;
    word-break:break-all;

    ${media.phone}{
        height: 90px;
        margin-top: 4px;
    }
`;

interface Props{
    photoInfo:any,
    setIsNew(isNew:boolean):void,
    isNew:boolean,
    authorInfo:any,
};
// 작품 설명 박스 컴포넌트 
function ImgDescription({photoInfo, setIsNew, isNew, authorInfo}:Props){
    const dispatch = useDispatch();

    // New btn 클릭 시, 해당 포토에 new 개수증가 
    const onNewHandler = () => {
        setIsNew(!isNew);
        const body = {
            isNew:!isNew,
            _id:photoInfo?._id,
        }
        setPhotoNew(body).then(
            response => {
                dispatch(response);
            });
    };

    return (
    <>
        <GlobalStyle />
        <Whole>
            {/* 타이틀, 뉴버튼, 작가 이미지 */}
            <ImgDescriptionTop>
                <ImgTitle>{photoInfo?.title}</ImgTitle>
                <div style={{display:'flex'}}>
                    <NewBtn isNew={isNew} onClick={onNewHandler}>New!</NewBtn>
                    {/* <PersonalImg></PersonalImg> */}
                    <a href={`${CLIENT_PATH}personal/${authorInfo?.key}`}>
                        <PersonalImg src={!authorInfo?.personalImgPath ? defaultImg : `${SERVER_PATH}${authorInfo?.personalImgPath}`}/>
                    </a>
                </div>
            </ImgDescriptionTop>
            {/* 해당 페이지 이미지 테그 리스트 */}
            <ImgTagList>
                {photoInfo?.tagList.map((cmp:string, index:number)=> (<ImgTag key={index}>{`#${cmp}`}</ImgTag>))}
            </ImgTagList>
            {/* 해당 페이지 이미지 New 갯수, 생성 날짜 */}
            <ImgDescriptionMiddle>
                <ImgNewCount>New {photoInfo?.new.length } 개</ImgNewCount>
                <ImgCreateDate>{photoInfo?.createDate.substr(0,10)}</ImgCreateDate>
            </ImgDescriptionMiddle>
            {/* 포토 설명 */}
            <ImgDescriptionBottom>
                {photoInfo?.description}
            </ImgDescriptionBottom>
        </Whole>
    </>);
}
export default ImgDescription;