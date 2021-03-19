import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import GlobalStyle from 'globalStyles';
import Header from 'component/Header';
import UpperImg from 'page/personal/material/UpperImg';
import PersonalInfo from 'page/personal/material/PersonalInfo';
import BottomImgList from 'page/personal/material/BottomImgList';
import Footer from 'component/Footer';

import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { IPersonalInfoProps } from 'page/personal/material/PersonalInterface';
import { callAPI } from 'redux/actions/action';
import { GET_INFO_PERSONAL } from 'redux/actions/types';

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
    flex-direction: column;
    align-items: center;
`;

function Personal(){
    const match = useParams<{id:string}>();
    const userData = useSelector((state:any) => state.user.auth);
    const [personalInfo, setPersonalInfo] = useState<IPersonalInfoProps>();
    const status = useSelector((state:any) => state.photo);


    useEffect(() => {
        const body = {
            key:match.id,
        };

        // 작가 개인 정보 가져오기
        callAPI('POST', 'users/personal_info', GET_INFO_PERSONAL, body).then(
            response => {
                if(response.payload.result){
                    setPersonalInfo(response.payload.result);
                }else{
                    alert('잘못된 접근입니다.');
                }
            });
    }, [status?.deletePhoto]);

    return (
    <>
        <GlobalStyle />
        <TopLayout>
            <Header userData={userData} />
        </TopLayout>
        <BottomLayout>
            <PageLayout>
                {/* // 여기서부터 페이지 내용 */}
                <UpperImg {...personalInfo} />
                <PersonalInfo personalInfo={personalInfo} />
                <BottomImgList photo={personalInfo?.photo} isUser={personalInfo?.isUser} />
            </PageLayout>
        </BottomLayout>
        <Footer />
        
    </>);
}
export default Personal;