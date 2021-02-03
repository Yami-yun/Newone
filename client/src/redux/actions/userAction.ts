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

export async function registerUser(dataToSubmit:any){
    
    const request = await axios.post('/api/users/register', dataToSubmit)
    .then(response => response.data)
    .catch(e=>console.log(e));
    console.log(`[CLIENT] [REGISTER USER] request: ${JSON.stringify(request)} `);

    return ({
        type: REGISTER_USER,
        payload: request,
    });

};

export async function loginUser(dataToSubmit:any){
    // console.log("Test2")
    const request = await axios.post('/api/users/login', dataToSubmit)
    .then(response => response.data)
    .catch(e=>console.log(e));
    // console.log("Test3")
    console.log(`[CLIENT] [LOGIN USER] request: ${JSON.stringify(request)} `);

    return({
        type: LOGIN_USER,
        payload: request,
    });
};

export async function logoutUser(){
    const request = await axios.get('/api/users/logout')
    .then(response => response.data);

    console.log(`[CLIENT] [LOGOUT USER] request: ${JSON.stringify(request)} `);
    return({
        type: LOGOUT_USER,
        payload: request,
    });
};


export async function auth() {

    const request = await axios.get('/api/users/auth')
        .then(response => response.data);

    return ({
        type: AUTH_USER,
        payload: request
    });
};

export async function getUserInfo(){

    const request = await axios.get('/api/users/info')
    .then(response => response.data);

    return ({
        type: INFO_USER,
        payload: request,
    });
};


export async function modifiedUserImg(dataToSubmit:any, config: any){

    const request = await axios.post('/api/users/modified_personal_img', dataToSubmit, config).then(
        response => response.data
    );

    return ({
        type: MODIFIED_PERSONAL_IMG_USER,
        payload: request,
    });
};


export async function modifiedPersonalInfo(dataToSubmit:any){
    const request = await axios.patch('./api/users/modified_personal_info', dataToSubmit).then(
        response => response.data
    ).catch(e=>console.log(e));
    console.log(request);

    return ({
        type: MODIFIED_PERSONAL_INFO,
        payload: request,
    });
};

export async function followUser(dataToSubmit:any){
    const request = await axios.post(`${CLIENT_PATH}api/users/follow`, dataToSubmit).then(
        response => response.data
    ).catch(e=>console.log(e));
    console.log(request);

    return ({
        type: FOLLOW_USER,
        payload: request,
    });
};

export async function getIsFollow(dataToSubmit:any){
    const request = await axios.post(`${CLIENT_PATH}api/users/is_follow`, dataToSubmit).then(
        response => response.data
    ).catch(e=>console.log(e));
    console.log(request);

    return ({
        type: GET_IS_FOLLOW_USER,
        payload: request,
    });
};


export async function searchAuthor(searchTxt:string){
    const request = await axios.get('http://localhost:3000/api/users/search_author', {params: {searchTxt: searchTxt}}).then(
        response => response.data
    );

    return{
        type: SEARCH_AUTHOR,
        payload: request,
    };
};

export async function getVerifiedCode(dataToSubmit:any){
    const request = await axios.post(`${CLIENT_PATH}api/users/get_verified_code`, dataToSubmit).then(
        response => response.data
    );

    return{
        type: GET_VERIFIED_CODE,
        payload: request,
    };
};

export async function modifyPassword(dataToSubmit:any){
    const request = await axios.post(`${CLIENT_PATH}api/users/modify_password`, dataToSubmit).then(
        response => response.data
    );

    return{
        type: MODIFY_PASSWORD,
        payload: request,
    };
};



