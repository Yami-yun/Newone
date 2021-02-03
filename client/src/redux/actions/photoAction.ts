import { 
    ADD_PHOTO,
    GET_INFO_PHOTO,
    GET_AUTHOR_INFO,
    TMP_PHOTO_DELETE,
    TMP_PHOTO_UPLOAD,
    DELETE_PHOTO,
    MODIFY_PHOTO,
    SET_NEW_PHOTO,
    GET_IS_NEW_PHOTO,
    GET_RECOMMEND_PHOTO,
    GET_TODAY_LANK,
    GET_FAMOUS_TAG_LIST,
    GET_RECENT_PHOTO,
    SEARCH_PHOTO,
    SEARCH_AUTHOR,
    SEARCH_TAG,
} from './types';
import axios from 'axios';


export async function addPhoto(body:any){
    // const request = await axios.post("api/photo/add", body).then(
    const request = await axios.post("api/photo/add", body).then(
        response => response.data
    );


    return ({
        type: ADD_PHOTO,
        payload: request,
    });
};

export async function getPhotoInfo(body:any){

    const request = await axios.post(`http://localhost:3000/api/photo/get_photo_info`, body).then(
        response => response.data
    );
    console.log(request);

    return ({
        type: GET_INFO_PHOTO,
        payload: request,
    });
};

export async function getAuthorInfo(body:any){
    // console.log(body);
    const request = await axios.post(`http://localhost:3000/api/photo/get_author_info`, body).then(
        response=> response.data
    );

    return({
        type: GET_AUTHOR_INFO,
        payload: request,
    });
};

export async function tmpPhotoDelete(body:any){
    console.log(body);
    const request = await axios.delete('api/photo/tmp_photo_delete', {data: body}).then(
        response => response.data
    );


    return {
        type: TMP_PHOTO_DELETE,
        payload: request,
    };
};

interface TmpPhotoUploadProps{
    formData:FormData,
    config: any,
}

export async function tmpPhotoUpload({formData, config}:TmpPhotoUploadProps){
    const request = await axios.post('http://localhost:3000/api/photo/upload', formData, config).then(
        response => response.data
    );
    console.log(request);

    return{
        type: TMP_PHOTO_UPLOAD,
        payload: request,
    };
};

export async function deletePhoto(body:any){
    const request = await axios.delete('http://localhost:3000/api/photo/delete', {data: body}).then(
        response => response.data
    );

    return{
        type: DELETE_PHOTO,
        payload: request,
    };
};

export async function modifyPhoto(body:any){
    const request = await axios.patch('http://localhost:3000/api/photo/modify', body).then(
        response => response.data
    );

    return{
        type: MODIFY_PHOTO,
        payload: request,
    };
};

export async function setPhotoNew(body:any){
    const request = await axios.patch('http://localhost:3000/api/photo/new', body).then(
        response => response.data
    );

    return{
        type: SET_NEW_PHOTO,
        payload: request,
    };
};

export async function getIsNew(body:any){
    const request = await axios.post('http://localhost:3000/api/photo/is_new', body).then(
        response => response.data
    );

    return{
        type: GET_IS_NEW_PHOTO,
        payload: request,
    };
};

export async function getRecommendPhoto(_id:any, tagList:any){
    const request = await axios.get('http://localhost:3000/api/photo/get_recommend_photo', {params: {_id:_id, tagList: tagList}}).then(
        response => response.data
    );

    return{
        type: GET_RECOMMEND_PHOTO,
        payload: request,
    };
};

export async function getTodayLank(){
    const request = await axios.get('http://localhost:3000/api/photo/get_today_lank').then(
        response => response.data
    );

    return{
        type: GET_TODAY_LANK,
        payload: request,
    };
};

export async function getFamousTag(){
    const request = await axios.get('http://localhost:3000/api/photo/get_famous_tag_list').then(
        response => response.data
    );

    return{
        type: GET_FAMOUS_TAG_LIST,
        payload: request,
    };
};

export async function getRecentPhoto(category:number){
    const request = await axios.get('http://localhost:3000/api/photo/get_recent_photo', {params: {category: category}}).then(
        response => response.data
    );

    return{
        type: GET_RECENT_PHOTO,
        payload: request,
    };
};


export async function searchPhoto(searchTxt:string){
    const request = await axios.get('http://localhost:3000/api/photo/search_photo', {params: {searchTxt: searchTxt}}).then(
        response => response.data
    );

    return{
        type: SEARCH_PHOTO,
        payload: request,
    };
};

export async function searchTag(searchTxt:string){
    const request = await axios.get('http://localhost:3000/api/photo/search_tag', {params: {searchTxt: searchTxt}}).then(
        response => response.data
    );

    return{
        type: SEARCH_TAG,
        payload: request,
    };
};
