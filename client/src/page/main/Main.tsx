import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import GlobalStyle from 'globalStyles';
import Header from 'component/Header';
import Category from 'component/Category';
import LankingList from 'page/main/material/LankingList';
import FamousTagList from 'page/main/material/FamousTagList';
import RecentWorkList from 'page/main/material/RecentWorkList';
import Footer from 'component/Footer';
import { useSelector, useDispatch } from'react-redux';
import { IFamousTagList, IRecentPhotoList } from 'page/main/material/MainInterface';
import { callAPI } from 'redux/actions/action';
import { GET_FAMOUS_TAG_LIST, GET_RECENT_PHOTO, GET_TODAY_LANK } from 'redux/actions/types';

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
    display: flex;
    flex-direction : column;
    align-items:center;
    padding-bottom: 95px;
    background: #ffffff;
`;

// 메인 화면 컴포넌트
function Main(){
    const userData = useSelector((state:any) => state.user.auth);
    const [recentPhotoList, setRecentPhotoList] = useState<IRecentPhotoList[]>([]);       // 최근 작품 리스트 상태 변수
    const [lankList, setLankList] = useState<any>([]);                                              // 금일 작품 랭킹 리스트 상태 변수
    const [famousTagList, setFamousTagList] = useState<IFamousTagList[]>([]);         // 인기 태그 리스트 상태 변수
    const [category, setCategory] = useState<number>(0);                                            // 선택된 카테고리 상태 변수
    const dispatch = useDispatch();
    console.log(document.cookie);


    // 카테고리에 따른 최근 작품, 오늘의 랭킹, 인기 태그를 가져온다.
    useEffect(() => {
        // 작품 최신 정보 리스트
        callAPI("GET", "photo/recent_photo", GET_RECENT_PHOTO, category).then(
            response => {
                if(response.payload.success){
                    setRecentPhotoList(response.payload.result);
                    dispatch(response);
                }else{
                    alert('잘못된 접근입니다.');
                }
            })

        // 오늘 랭킹 작품 리스트
        callAPI("GET", "photo/get_today_lank", GET_TODAY_LANK).then(
            response => {
                if(response.payload.success){
                    setLankList(response.payload.result);
                    dispatch(response);
                }else{
                    alert('잘못된 접근입니다.');
                }
            })

        // 인기 태그 리스트
        callAPI("GET", "photo/famous_tag_list", GET_FAMOUS_TAG_LIST).then(
            response => {
                if(response.payload.success){
                    setFamousTagList(response.payload.result);
                    dispatch(response);
                }else{
                    alert('잘못된 접근입니다.');
                }
            })

    }, [category]);

    return (
    <>
        <GlobalStyle />
        <TopLayout>
            <Header userData={userData}/>
            <Category setCategory={setCategory}/>
        </TopLayout>
        <BottomLayout>
            {/* 여기서부터 Page 내용 */}
            <PageLayout>
                
                <FamousTagList famousTagList={famousTagList}/>
                <LankingList lankList={lankList}/>
                <RecentWorkList recentPhotoList={recentPhotoList}/>
            </PageLayout>
        </BottomLayout>
        <Footer />
        
    </>);
}
export default Main;


