import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import GlobalStyle from 'globalStyles';
import Header from 'component/Header';
import ImgDescription from 'page/photo/material/ImgDescription';
import AuthorImgList from 'page/photo/material/AuthorImgList';
import PhotoRecommendBox from './material/PhotoRecommendBox';
import Comment from 'page/photo/material/Comment';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { SERVER_PATH } from 'config/path';
import Footer from 'component/Footer';
import { media } from 'component/customMediaQuery';
import { IAuthorInfo, IPhotoInfo } from 'page/photo/material/PhotoInterface';
import { callAPI } from 'redux/actions/action';
import { GET_AUTHOR_INFO, GET_INFO_PHOTO, GET_IS_NEW_PHOTO, GET_RECOMMEND_PHOTO } from 'redux/actions/types';

const TopLayout=styled.section`
    padding: 20px 0;
    border-bottom: 1px solid black;

    display: flex;
    flex-direction: column;
    align-items: center;
`;

const BottomLayout=styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #faf1f1;
`;

const PageLayout=styled.section`
    background: #ffffff;
    display:flex;

    ${media.tablet}{
        width: 600px;
    }
    ${media.phone}{
        width: 320px;
    }
`;

const ExpandImgSection = styled.section`
    position: fixed;
    top: 0px;
    left: 0px;

    width: 100vw;
    height: 100vh;

    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background: rgba(61, 48, 48, 0.7);
`;

const ExpandImg = styled.img`
    position : relative;
    border: 4px dashed #e99d9d;
    border: 4px dashed white;
    max-width: 88%;
    max-height: 88%;
    left : -16px;

    ${media.phone}{
        left : -8px;
        /* max-width: 70%;
        max-height: 70%; */

    }
`;

const ExitBtn = styled.button`
    position : relative;
    top: -15px;

    width: 40px;
    height: 40px;
    opacity:0.9;
    background: white;
    border: 2px dashed #cfcfcf;
    border-radius: 100%;

    font-size: 1.3rem;
    font-weight: 700;
    color: #cfcfcf;

    &:hover, &:active{
        border-color: #494949;
        color: #494949;
    }
`;



// 선택된 이미지
const PhotoBox = styled.section`
    width: 820px;
    height: 970px;
    display:flex;
    justify-content: center;
    align-items: center;

    ${media.tablet}{
        width: 480px;
        height: 570px;
    }

    ${media.phone}{
        width: 320px;
        height: 320px;
    }
`;

// 이미지 상세정보, 작가의 다른 작품, 코멘트
const PhotoBottomPage = styled.section`
    width: 819px;
    padding : 40px 0;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    ${media.tablet}{
        width: 480px;
    }
    ${media.phone}{
        width: 320px;
    }
`;

function Photo(){
    const match = useParams<{id:string}>();
    const history = useHistory();
    const dispatch = useDispatch();
    const userStatus = useSelector((state:any) => state.user.auth);

    const [photoInfo, setPhotoInfo] = useState<IPhotoInfo>();                              // 해당 페이지 작품 정보
    const [authorInfo, setauthorInfo] = useState<IAuthorInfo>();                            // 해당 페이지 작품의 작가 정보
    const [recommendPhotoList, setRecommendPhotoList] = useState<any>(null);            // 해당 페이지 작품의 추천리스트
    const [isNew, setIsNew] = useState<boolean>(false);                                 // 작품의 New 상태 변수
    const [isExpandPhoto, setIsExpandPhoto] = useState(false);

    useEffect(() => {
        const body = {
            photoId:match.id,
        }
        callAPI('POST', 'photo/photo_info', GET_INFO_PHOTO, body).then(
            response=> {
                if(response.payload.result){
                    setPhotoInfo(response.payload.result);

                    callAPI('POST', 'photo/author_info', GET_AUTHOR_INFO, {key:response.payload.result.authorKey}).then(
                        response=>{
                            if(response.payload.success) setauthorInfo(response.payload.result);
                            dispatch(response);
                        }
                    );
                }
                else{
                    alert('해당 페이지를 찾을 수 없습니다.');
                    history.push('/');
                }
            });

        callAPI('POST', 'photo/is_new', GET_IS_NEW_PHOTO, {_id: photoInfo?._id}).then(
            response=> {
                setIsNew(response.payload.result);
                dispatch(response);

            });

        callAPI('GET', 'photo/recommend_photo', GET_RECOMMEND_PHOTO, {_id:photoInfo?._id, tagList: photoInfo?.tagList}).then(
            response=> {
                if(response.payload.success){
                    console.log(response.payload);
                    setRecommendPhotoList(response.payload.result);
                    dispatch(response);
                }
                else{
                    alert('해당 페이지를 찾을 수 없습니다.');
                    history.push('/');
                }
            });

    }, [isNew]);

    return (
    <>
        <GlobalStyle />
        <TopLayout>
            <Header userData={userStatus}/>
        </TopLayout>
            {/* // 여기서부터 페이지 내용 */}
        <BottomLayout>
            <PageLayout >
                <section style={{display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 95}}>
                    {/* 이미지 확대 모달 창 */}
                    {isExpandPhoto && <ExpandImgSection>
                        <ExpandImg alt="photo" src={photoInfo && `${SERVER_PATH}${photoInfo?.photoPath}`} />
                        <ExitBtn onClick={()=>setIsExpandPhoto(false)}>⤫</ExitBtn>
                    </ExpandImgSection>}

                    {/* 작품 이미지 */}
                    <PhotoBox onClick={()=>setIsExpandPhoto(true)}>
                        <img alt="photo" style={{width: "100%", height: "100%", objectFit:"contain", cursor:"pointer"}} src={photoInfo && `${SERVER_PATH}${photoInfo?.photoPath}`} />
                    </PhotoBox>

                    {/* 작품 및 작가 설명, 코멘트 */}
                    <PhotoBottomPage >
                        <ImgDescription authorInfo={authorInfo} photoInfo={photoInfo} setIsNew={setIsNew} isNew={isNew} />
                        <AuthorImgList _key={authorInfo?.key}  personalImgPath={authorInfo?.personalImgPath} authorName={authorInfo?.authorName} photo={authorInfo?.photo} />
                        <Comment photoInfo={photoInfo}/>
                    </PhotoBottomPage>
                </section>

                {/* 사이드 추천작품 */}
                <PhotoRecommendBox recommendPhotoList={recommendPhotoList}/>
            </PageLayout>
            <Footer />
        </BottomLayout>
    </>);
}
export default Photo;