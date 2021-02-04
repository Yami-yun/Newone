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
import { getPhotoInfo, getAuthorInfo, getIsNew, getRecommendPhoto } from 'redux/actions/photoAction';
import { SERVER_PATH } from 'config/path';
import Footer from 'component/Footer';
import { media } from 'component/customMediaQuery';

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
    const userStatus = useSelector(state => state.user.auth);

    const [photoInfo, setPhotoInfo] = useState<any>(null);                              // 해당 페이지 작품 정보
    const [authorInfo, setauthorInfo] = useState<any>(null);                            // 해당 페이지 작품의 작가 정보
    const [recommendPhotoList, setRecommendPhotoList] = useState<any>(null);            // 해당 페이지 작품의 추천리스트
    const [isNew, setIsNew] = useState<boolean>(false);                                 // 작품의 New 상태 변수

    useEffect(() => {
        const body = {
            photoId:match.id,
        }

        // 해당 페이지의 작품 정보를 가져온다.
        getPhotoInfo(body).then(
            response=> {
                if(response.payload.result){
                    setPhotoInfo(response.payload.result);
                    getAuthorInfo({key:response.payload.result.authorKey}).then(
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
            }
        );

        // 현재 로그인한 사용자가 보고 있는 작품에 new 버튼을 클릭여부를 확인한다.
        getIsNew({_id: photoInfo?._id}).then(
            response=>{
                setIsNew(response.payload.result);
                dispatch(response);
            }
        );

        // 현재 작품의 테그와 관련된 작품 추천 리스트를 가져온다.
        getRecommendPhoto(photoInfo?._id, photoInfo?.tagList).then(
            response=>{
                if(response.payload.success) setRecommendPhotoList(response.payload.result);
                dispatch(response);
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
                    {/* 작품 이미지 */}
                    <PhotoBox>
                        <img alt="photo" style={{width: "100%", height: "100%", objectFit:"contain"}} src={photoInfo && `${SERVER_PATH}${photoInfo?.photoPath}`} />
                    </PhotoBox>

                    {/* 작품 및 작가 설명, 코멘트 */}
                    <PhotoBottomPage >
                        <ImgDescription authorInfo={authorInfo} photoInfo={photoInfo} setIsNew={setIsNew} isNew={isNew} />
                        <AuthorImgList authorInfo={authorInfo} />
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