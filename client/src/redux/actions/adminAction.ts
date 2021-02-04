import axios from "axios";
import { GET_DATA, GET_ALL_USER_DATA, DELETE_USER_INFO, GET_ALL_PHOTO_DATA, DELETE_PHOTO_INFO } from "./types";
import { CLIENT_PATH } from 'config/path';

// 일일 접속자 수 데이터 가져오기 api
export async function getData(){
    const request = await axios.get(`${CLIENT_PATH}api/admin/data`).then(
        response => response.data
    );

    return { type: GET_DATA, payload: request, };
};

// 모든 작가 정보 가져오기 api
export async function getAllUserData(){
    const request = await axios.get(`${CLIENT_PATH}api/admin/get_all_user_data`).then(
        response => response.data
    );

    return { type: GET_ALL_USER_DATA, payload: request, };
};

// 선택한 유저 db 삭제 api
export async function deleteUserInfo(authorName:string){
    const request = await axios.delete(`${CLIENT_PATH}api/admin/delete_user_info`,{data:{authorName}}).then(
        response => response.data
    );

    return { type: DELETE_USER_INFO, payload: request };
};

// 모든 작품 정보 가져오기 api
export async function getAllPhotoData(){
    const request = await axios.get(`${CLIENT_PATH}api/admin/get_all_photo_data`).then(
        response => response.data
    );

    return { type: GET_ALL_PHOTO_DATA, payload: request };
};

// 선택한 작품 db 삭제 api
export async function deletePhotoInfo(body:{_id:string}){
    const request = await axios.delete(`${CLIENT_PATH}api/admin/delete_photo_info`,{data:body}).then(
        response => response.data
    );

    return { type: DELETE_PHOTO_INFO, payload: request };
};

