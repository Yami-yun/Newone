import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import GlobalStyle from 'globalStyles';
import Header from 'component/Header';
import Category from 'component/Category';
import LankingList from 'page/main/material/LankingList';
import FamousTagList from 'page/main/material/FamousTagList';
import RecentWorkList from 'page/main/material/RecentWorkList';
import Footer from 'component/Footer';
import { useSelector } from'react-redux';
import { getRecentPhoto, getTodayLank, getFamousTag } from 'redux/actions/photoAction';

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

function Main(){
    const userData = useSelector(state => state.user.auth);
    const [recentPhotoList, setRecentPhotoList] = useState<any>([]);
    const [lankList, setLankList] = useState<any>([]);
    const [famousTagList, setFamousTagList] = useState<any>([]);
    const [category, setCategory] = useState<number>(0);

    useEffect(() => {

        getRecentPhoto(category).then(
            response => {
                if(response.payload.success) setRecentPhotoList(response.payload.result);
            });

            getTodayLank().then(
                response => {
                    if(response.payload.success) setLankList(response.payload.result);
                });

            getFamousTag().then(
                response => {
                    if(response.payload.success) setFamousTagList(response.payload.result);
                });

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


