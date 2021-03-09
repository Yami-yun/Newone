import React, {useEffect, useCallback, useState} from 'react';
import styled from 'styled-components';
import GlobalStyle from 'globalStyles';
import Header from 'component/Header';
import Category from 'component/Category';

import Footer from 'component/Footer';
import { useSelector } from 'react-redux';
import { SERVER_PATH } from 'config/path';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { InputBox, WhiteInputLabel, InputParagraphBox } from 'component/input';
import { BlueBtn } from 'component/button';

import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import defaultImg from 'img/defaultPersonalImg.png';
import { modifiedPersonalInfo } from 'redux/actions/userAction';
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

const PageLayout=styled.form`
    /* background: #ffffff; */
    display:flex;
    flex-direction: column;
`;

const UpperImgDropDownBox = styled.section`
    width: 1000px;
    height: 452px;
    position:relative;

    background: #C4C4C4;

    line-height: 800px;
    text-align: center;
    font-size: 2rem;
    font-weight: 700;
    outline: none;
    cursor: pointer;

    ${media.tablet}{
        width: 600px;
        height: 300px;
    }

    ${media.phone}{
        width: 320px;
        height: 200px;
    }
`;

const PersonalImgBox = styled.article`
    position: relative;
    height: 150px;
    width: 150px;
    margin-top: 50px;
    font-size: 2.2rem;

    ${media.tablet}{
        width: 130px;
        height: 130px;
    }

    ${media.phone}{
        width: 90px;
        height: 90px;
    }
`;

const PersonalImg = styled.img`
    width: 100%;
    height: 100%;

    border-radius: 75px;
    object-fit: 'contain';
    cursor: pointer;
`;

function PersonalModify(){

    const userData = useSelector((state:any) => state.user.auth);
    // upper : 개인페이지 상단 이미지 경로, personal: 개인 페이지 160 x 160 원형 이미지 경로
    const [upperPhoto, setUpperPhoto] = useState<{path:string, name:string}>({path:"", name:""});
    const [preUpperPhoto, setPreUpperPhoto] = useState<{path:string, name:string}>({path:"", name:""});

    const [personalPhoto, setPersonalPhoto] = useState<{path:string, name:string}>({path:"", name:""});
    const [prePersonalPhoto, setPrePersonalPhoto] = useState<{path:string, name:string}>({path:"", name:""});
    
    const [authorName, setAuthorName] = useState<string>("");
    const [instruction, setInstruction] = useState<string>("");
    const [homepage, setHomepage] = useState<string>("");
    const [twitter, setTwitter] = useState<string>("");


    const history = useHistory();
    
    // 프로필 변경 페이지에서 현재 자신의 프로필 내용 상태변수에 넣는다.
    useEffect(() => {
        setAuthorName(userData?.authorName);
        setInstruction(userData?.instruction);
        setHomepage(userData?.homepage);
        setTwitter(userData?.twitter);

        setUpperPhoto({path:userData?.upperImgPath, name:userData?.upperImgName});
        setPreUpperPhoto({path:userData?.upperImgPath, name:userData?.upperImgName});
        setPersonalPhoto({path:userData?.personalImgPath, name:userData?.personalImgName});
        setPrePersonalPhoto({path:userData?.personalImgPath, name:userData?.personalImgName});
    }, [])

    // react dropzone library
    const onDrop = useCallback(acceptedFiles => {

        const formData = new FormData();
        const config = {
            headers: { 'Content-type': 'multipart/form-data' }
        };
        formData.append("file", acceptedFiles[0]);

        // 파일 확장자를 통해, 불러온 파일이 이미지 파일인지 여부를 확인한다.
        const ext = acceptedFiles[0].name.split('.')[acceptedFiles[0].name.split('.').length - 1];
        if(["jpg", "png", "jpeg", "svg"].includes(ext)){

            // 서버로 이미지 임시 저장
            axios.post('/api/photo/upload', formData, config)
            .then(response => {
                if(response.data.success){
                    // 임시 이미지가 저장 되면 이미지 이름과 서버 임시 path를 set함
                    setUpperPhoto({...upperPhoto, path:response.data.filePath, name:response.data.fileName});
                }
            })
            .catch(e => console.log(e));
        }
        else{
            // 이미지 파일이 아닐 경우.
            console.log(ext);
            return alert("이미지 파일을 선택해주세요.");
        }
    }, []);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

    // set user author name 
    const onAuthorNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => { setAuthorName(e.target.value); };

    // set user instruction
    const onInstructionHandler = (e:React.ChangeEvent<HTMLTextAreaElement>) => { setInstruction(e.target.value); };

    // set user personal home page
    const onHompageHandler = (e:React.ChangeEvent<HTMLInputElement>) => { setHomepage(e.target.value); };

    // set user twitter page
    const onTwitterHandler = (e:React.ChangeEvent<HTMLInputElement>) => { setTwitter(e.target.value); };

    const onPersonalImgHandler = (e:any) => {
        const fileData = e.target.files[0];
        const formData = new FormData();
        const config = {
            headers: { 'Content-type': 'multipart/form-data' }
        };
        formData.append("file", fileData);

        // 파일 확장자를 통해, 불러온 파일이 이미지 파일인지 여부를 확인한다.
        const ext = fileData.name.split('.')[fileData.name.split('.').length - 1];
        if(["jpg", "png", "jpeg", "svg"].includes(ext)){

            // 서버로 이미지 임시 저장
            axios.post('/api/photo/upload', formData, config)
            .then(response => {
                if(response.data.success){
                    // 임시 이미지가 저장 되면 이미지 이름과 서버 임시 path를 set함
                    setPersonalPhoto({...personalPhoto, path:response.data.filePath, name:response.data.fileName});
                }
            })
            .catch(e => console.log(e));
        }
        else{
            // 이미지 파일이 아닐 경우.
            console.log(ext);
            return alert("이미지 파일을 선택해주세요.");
        }
    };

    // 프로필 변경 내용 서버로 전송
    const onPersonalDataSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!authorName) return alert("작가 명을 입력해주세요.");
        if(authorName.length < 2) return alert("작가 명은 2글자 이상입니다.");

        // 서버로 보낼 데이터
        const body = {
            authorName,
            instruction,
            upperPhoto,
            preUpperPhoto,
            personalPhoto,
            prePersonalPhoto,
            twitter,
            homepage,
        };

        modifiedPersonalInfo(body).then(
            response => {
                // 데이터 변경 사항이 success 되면 개인 페이지로 이동
                if(response.payload.success){
                    history.push(`/personal/${userData.key}`);
                }else{
                    alert("작가명이 중복됩니다.");
                }
            });
    };

    // 프로필 이미지
    const personalImg = () => {
        if(personalPhoto?.path){
            // 사용자가 이미지를 변경했다면
            return `${SERVER_PATH}${personalPhoto?.path}`;
        }
        else{
            // 사용자가 이미지를 변경하지 않았거나 default 값일 경우
            return !personalPhoto?.path ? defaultImg : `${SERVER_PATH}${personalPhoto?.path}`;
        }
    };

    return (
    <>
        <GlobalStyle />
        <TopLayout>
            <Header userData={userData}/>
        </TopLayout>
        <BottomLayout>
            <PageLayout onSubmit={onPersonalDataSubmit}>
                {/* // 여기서부터 페이지 내용 */}
                {/* 상단 이미지 drop box 영역 */}
                <UpperImgDropDownBox {...getRootProps()}>
                    <input defaultValue={undefined} style={{width: '100%', height: '100%'}} {...getInputProps()} />
                    {upperPhoto?.path ? 
                    <img style={{ position:'absolute', top:0, left:0, width: '100%', height: '100%', objectFit: 'contain', zIndex:5}} src={`${SERVER_PATH}${upperPhoto?.path}` }/> :
                    <p style={{position:'absolute', top:0, left:0, zIndex: 7, width: '100%', height: '100%'}}> 클릭하거나 이미지를 끌어와 주세요 </p>}
                </UpperImgDropDownBox>

                {/* Personal Img 변경 영역 */}
                <PersonalImgBox >
                    <PersonalImg src={personalImg() } />
                    <FontAwesomeIcon style={{ position:'absolute', right:0, bottom: 0, zIndex:3, color:"#00A0FF" }} icon={faCamera}/>
                    <label style={{position:'absolute', width: "100%", height: "100%", top:0, left:0, zIndex:5, borderRadius: 75, cursor:"pointer"}}>
                        <input 
                        style={{opacity: 0}} 
                        type="file" 
                        accept="image/png, image/jpeg, image/jpg, image/svg" 
                        onChange={onPersonalImgHandler}/>
                    </label>
                </PersonalImgBox>

                <WhiteInputLabel>작가 명</WhiteInputLabel>
                <InputBox value={authorName} onChange={onAuthorNameHandler} maxLength={16}/>

                <WhiteInputLabel>개인 홈페이지 주소</WhiteInputLabel>
                <InputBox value={homepage} onChange={onHompageHandler} maxLength={50}/>

                <WhiteInputLabel>트위터 주소</WhiteInputLabel>
                <InputBox value={twitter} onChange={onTwitterHandler} maxLength={50}/>

                <WhiteInputLabel>자기 소개</WhiteInputLabel>
                <InputParagraphBox value={instruction} onChange={onInstructionHandler} maxLength={120}/>

                <BlueBtn type="submit" style={{ margin:"60px 0px", width: "99%" }}> 수정 완료 </BlueBtn>                
            </PageLayout>
        </BottomLayout>
        <Footer />
        
    </>);
}
export default PersonalModify;