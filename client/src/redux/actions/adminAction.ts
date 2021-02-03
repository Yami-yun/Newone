import axios from "axios";
import { GET_DATA, GET_ALL_USER_DATA, DELETE_USER_INFO, GET_ALL_PHOTO_DATA, DELETE_PHOTO_INFO } from "./types";
import { CLIENT_PATH } from 'config/path';


export async function getData(){
    const request = await axios.get(`${CLIENT_PATH}api/admin/data`).then(
        response => response.data
    );

    return { type: GET_DATA, payload: request, };
};

export async function getAllUserData(){
    const request = await axios.get(`${CLIENT_PATH}api/admin/get_all_user_data`).then(
        response => response.data
    );

    return { type: GET_ALL_USER_DATA, payload: request, };
};


export async function deleteUserInfo(authorName:string){
    const request = await axios.delete(`${CLIENT_PATH}api/admin/delete_user_info`,{data:{authorName}}).then(
        response => response.data
    );

    return { type: DELETE_USER_INFO, payload: request };
};

export async function getAllPhotoData(){
    const request = await axios.get(`${CLIENT_PATH}api/admin/get_all_photo_data`).then(
        response => response.data
    );

    return { type: GET_ALL_PHOTO_DATA, payload: request };
};

export async function deletePhotoInfo(body:any){
    const request = await axios.delete(`${CLIENT_PATH}api/admin/delete_photo_info`,{data:body}).then(
        response => response.data
    );

    return { type: DELETE_PHOTO_INFO, payload: request };
};

