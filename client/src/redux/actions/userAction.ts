import axios from 'axios';
import{
    REGISTER_USER,
    LOGIN_USER,
    LOGOUT_USER,
    AUTH_USER,
    INFO_USER,
    MODIFIED_PERSONAL_IMG_USER,
    MODIFIED_PERSONAL_INFO,
    FOLLOW_USER,
    GET_IS_FOLLOW_USER,
    SEARCH_AUTHOR,
    GET_VERIFIED_CODE,
    MODIFY_PASSWORD,
} from './types';
import {CLIENT_PATH} from 'config/path';

interface IRegisterUserProps{
    email : string,
    password : string,
    authorName : string,
};

// 회원가입 양식을 서버로 보내는 api
export async function registerUser(dataToSubmit:IRegisterUserProps){
    
    const request = await axios.post('/api/users/register', dataToSubmit)
    .then(response => response.data)
    .catch(e=>console.log(e));

    return ({
        type: REGISTER_USER,
        payload: request,
    });
};

// 로그인할 유저의 정보를 서버로 보내는 api
export async function loginUser(dataToSubmit:{email : string, password : string}){
    const request = await axios.post('/api/users/login', dataToSubmit)
    .then(response => response.data)
    .catch(e=>console.log(e));

    return({
        type: LOGIN_USER,
        payload: request,
    });
};

// 로그아웃할 유정의 토큰 정보를 db에서 삭제할 api
export async function logoutUser(){
    const request = await axios.get('/api/users/logout')
    .then(response => response.data);

    return({
        type: LOGOUT_USER,
        payload: request,
    });
};

// 유저의 인증 여부를 확인하는 api
export async function auth() {
    const request = await axios.get('/api/users/auth')
        .then(response => response.data);

    return ({
        type: AUTH_USER,
        payload: request
    });
};

// 유저 정보를 가져오는 api
export async function getUserInfo(){
    const request = await axios.get('/api/users/info')
    .then(response => response.data);

    return ({
        type: INFO_USER,
        payload: request,
    });
};

// 변경된 유저 개인 이미지 정보를 서버로 보내는 api
export async function modifiedUserImg(dataToSubmit:any, config: any){
    const request = await axios.post('/api/users/modified_personal_img', dataToSubmit, config).then(
        response => response.data
    );

    return ({
        type: MODIFIED_PERSONAL_IMG_USER,
        payload: request,
    });
};


interface IModifiedPersonalInfo{
    authorName:string,
    instruction:string,
    upperPhoto:{path:string, name:string},
    preUpperPhoto:{path:string, name:string},
    personalPhoto:{path:string, name:string},
    prePersonalPhoto:{path:string, name:string},
    twitter:string,
    homepage:string,
};

// 유저 개인 페이지 변경 정보를 서버로 보내는 api
export async function modifiedPersonalInfo(dataToSubmit:IModifiedPersonalInfo){
    const request = await axios.patch('./api/users/modified_personal_info', dataToSubmit).then(
        response => response.data
    ).catch(e=>console.log(e));

    return ({
        type: MODIFIED_PERSONAL_INFO,
        payload: request,
    });
};


// 다른 작가가 팔로우 혹은 언 팔로우 할 경우, 그 작가의 키 값을 서버로 전송하는 api
export async function followUser(dataToSubmit:{follow: boolean, key : any}){
    const request = await axios.post(`${CLIENT_PATH}api/users/follow`, dataToSubmit).then(
        response => response.data
    ).catch(e=>console.log(e));

    return ({
        type: FOLLOW_USER,
        payload: request,
    });
};

// 팔로우 이력 정보를 가져오는 api
export async function getIsFollow(dataToSubmit:any){
    const request = await axios.post(`${CLIENT_PATH}api/users/is_follow`, dataToSubmit).then(
        response => response.data
    ).catch(e=>console.log(e));

    return ({
        type: GET_IS_FOLLOW_USER,
        payload: request,
    });
};

// 검색어와 관련된 작가 정보를 가져오는 api
export async function searchAuthor(searchTxt:string){
    const request = await axios.get('http://localhost:3000/api/users/search_author', {params: {searchTxt: searchTxt}}).then(
        response => response.data
    );

    return{
        type: SEARCH_AUTHOR,
        payload: request,
    };
};

// 서베에서 인증 번호를 가져오는 api
export async function getVerifiedCode(dataToSubmit:{email: string, str: string}){
    const request = await axios.post(`${CLIENT_PATH}api/users/get_verified_code`, dataToSubmit).then(
        response => response.data
    );

    return{
        type: GET_VERIFIED_CODE,
        payload: request,
    };
};

// 변경된 pw를  서버로 전송하는 api
export async function modifyPassword(dataToSubmit:{email : string, password : string}){
    const request = await axios.post(`${CLIENT_PATH}api/users/modify_password`, dataToSubmit).then(
        response => response.data
    );

    return{
        type: MODIFY_PASSWORD,
        payload: request,
    };
};



