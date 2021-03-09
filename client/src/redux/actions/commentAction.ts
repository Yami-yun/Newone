import axios from "axios";
import { ADD_COMMENT, GET_COMMENT, DELETE_COMMENT, MODIFY_COMMENT } from "./types";
import { CLIENT_PATH } from 'config/path';


export async function addComment(body:any){
    const request = await axios.post(`${CLIENT_PATH}api/comment/add`, body).then(
        response => response.data
    );

    return { type: ADD_COMMENT, payload: request, };
};

export async function getComment(_id:any){
    const request = await axios.get(`${CLIENT_PATH}api/comment/get`, {params: {_id:_id}, headers : {'Pragma': 'no-cache'}}).then(
        response => response.data
    );

    return { type: GET_COMMENT, payload: request, };
};

export async function deleteComment(body:any){
    const request = await axios.delete(`${CLIENT_PATH}api/comment/delete`, {data:body, headers : {'Pragma': 'no-cache'}}).then(
        response => response.data
    );

    return { type: DELETE_COMMENT, payload: request, };
};

export async function modifyComment(body:any){
    const request = await axios.patch(`${CLIENT_PATH}api/comment/modify`, body).then(
        response => response.data
    );

    return { type: MODIFY_COMMENT, payload: request, };
};