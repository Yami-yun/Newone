import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import GlobalStyle from 'globalStyles';
import { SERVER_PATH, CLIENT_PATH } from 'config/path';
import { PhotoBlueBtn } from 'component/button';
import defaultImg from 'img/defaultPersonalImg.png';
import { followUser, getIsFollow } from 'redux/actions/userAction';
import { media } from 'component/customMediaQuery';
import { useDispatch } from 'react-redux';

const Whole=styled.section`
    width: 738px;
    padding: 15px 25px;
    margin-top: 34px;

    border: 1px solid #E8E8E8;

    ${media.tablet}{
        width: 432px;
    }
    ${media.phone}{
        width: 288px;
    }
`;

const IDBox = styled.div`
    display: flex;
    align-items: center;

    font-weight: normal;
    font-size: 1.5rem;
    color: #00A0FF;

    ${media.phone}{
        font-size: 1.8rem;        
        justify-content: space-between;
    }
`;

const PersonalImg = styled.img`
    width: 36px;
    height: 36px;
    margin-right:10px;

    background: #FFFFFF;
    border-radius: 18px;
    cursor: pointer;
`;

const ImgList = styled.div`
    margin-top: 15px;
    display: flex;
    overflow-x:scroll;    
`;

const ImgBox = styled.img`
    width: 120px;
    height: 120px;
    margin-right: 15px;

    border-radius: 8px;
    cursor: pointer;
`;

// 작품 페이지에서 작가 이미지 리스트 컴포넌트
function AuthorImgList({authorInfo}:any){
    const dispatch = useDispatch();
    const [isFollow, setIsFollow] = useState<boolean>(false);

    useEffect(() => {
        // 해당 작품의 작가와의 사용자간의 팔로우 여부 확인
        if(authorInfo){
            getIsFollow({key : authorInfo?.key}).then(
                response=>{
                    if(response.payload.success){
                        setIsFollow(response.payload.result);
                        dispatch(response);
                    }
                }
            );
        }
    }, [authorInfo?.key]);

    // 팔로우 on / off
    const onIsFollowHandler = () => {
        setIsFollow(!isFollow);
        const body = {
            follow: !isFollow,
            key : authorInfo.key,
        };
        followUser(body).then(
            response => {
                console.log(response);
        });
    };
    return (
    <>
        <GlobalStyle />
        <Whole>
            {/* 작가 아이콘, 네임 */}
            <IDBox>
                <a href={`${CLIENT_PATH}personal/${authorInfo?.key}`}>
                    <PersonalImg src={!authorInfo?.personalImgPath ? defaultImg : `${SERVER_PATH}${authorInfo?.personalImgPath}`}/>
                </a>
                <a href={`${CLIENT_PATH}personal/${authorInfo?.key}`}>
                    <p>{authorInfo?.authorName}</p>
                </a>
                <PhotoBlueBtn onClick={onIsFollowHandler} >{isFollow ? `Followed!` : `Follow!`}</PhotoBlueBtn>
            </IDBox>
            {/* 작가 작품 리스트 */}
            <ImgList>
                {authorInfo?.photo.map((tmp:any, index:number)=>(
                    <a key={index} href={`${CLIENT_PATH}photo/${tmp.id}`}><ImgBox src={`${SERVER_PATH}${tmp.path}`}/></a>))}
            </ImgList>
        </Whole>
    </>);
}
export default AuthorImgList;