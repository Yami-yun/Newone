import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import GlobalStyle from 'globalStyles';
import Header from 'component/Header';
import UpperImg from 'page/personal/material/UpperImg';
import PersonalInfo from 'page/personal/material/PersonalInfo';
import BottomImgList from 'page/personal/material/BottomImgList';
import Footer from 'component/Footer';

import { useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { getPersonalInfo } from 'redux/actions/personalAction';

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
    const userData = useSelector(state => state.user.auth);
    const history = useHistory();
    const [personalInfo, setPersonalInfo] = useState<any>(null);
    const status = useSelector(state => state.photo);
    
    console.log(status);

    useEffect(() => {
        const body = {
            key:match.id,
        };

        getPersonalInfo(body).then(
            response=> {
                if(response.payload.result){
                    setPersonalInfo(response.payload.result);
                    console.log(response.payload.result);
                }
            }
        );

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
                <UpperImg personalInfo={personalInfo} userData={userData} />
                <PersonalInfo personalInfo={personalInfo} userData={userData} />
                <BottomImgList personalInfo={personalInfo} userData={userData} />
            </PageLayout>
        </BottomLayout>
        <Footer />
        
    </>);
}
export default Personal;