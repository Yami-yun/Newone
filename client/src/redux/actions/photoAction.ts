import axios from 'axios';
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
    SEARCH_TAG,
} from './types';


interface IPhoto{
    title : string,
    description : string,
    tagList : string[],
    photoName : string,
    photoPath : string,
    photoType : number,
};

// 작품 등록하기 api
export async function addPhoto(body:IPhoto){
    const request = await axios.post("api/photo/add", body).then(
        response => response.data
    );

    return ({
        type: ADD_PHOTO,
        payload: request,
    });
};

// 포토 페이지에서 포토 정보 가져오기 api
export async function getPhotoInfo(body:{photoId:string}){
    const request = await axios.post(`http://localhost:3000/api/photo/get_photo_info`, body).then(
        response => response.data
    );
    /* req :
        authorKey: number,
        authorName: string,
        createDate: string,
        description: string,
        new: number[],
        photoName: string,
        photoPath: string,
        photoType: number,
        tagList: string[],
        title: string,
        _id: string, */

    return ({
        type: GET_INFO_PHOTO,
        payload: request,
    });
};

// 작품에 대한 작가 정보 가져오기 api
export async function getAuthorInfo(body:{key:number}){
    const request = await axios.post(`http://localhost:3000/api/photo/get_author_info`, body).then(
        response=> response.data
    );
    /* req
        authorName: string,
        key: number,
        personalImgName: string,
        personalImgPath: string,
        photo: {_id:string, path: string, name: string, type: number, _id:string}, */

    return({
        type: GET_AUTHOR_INFO,
        payload: request,
    });
};

// 작품 삭제 api
export async function tmpPhotoDelete(body:{photoName:string, photoPath:string}){
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

// 일시적인 작품이미지 서버에 저장 api
export async function tmpPhotoUpload({formData, config}:TmpPhotoUploadProps){
    const request = await axios.post('http://localhost:3000/api/photo/upload', formData, config).then(
        response => response.data
    );

    return{
        type: TMP_PHOTO_UPLOAD,
        payload: request,
    };
};

// 작품 삭제 api > db에서 해당 작품 정보 삭제
export async function deletePhoto(body:any){
    const request = await axios.delete('http://localhost:3000/api/photo/delete', {data: body}).then(
        response => response.data
    );

    return{
        type: DELETE_PHOTO,
        payload: request,
    };
};

interface ModifyPhotoProps{
    data:IPhoto,
    isPhotoChange:boolean,
};

// 작품 변경 api > db에서 해당 작품 정보 변경
export async function modifyPhoto(body:ModifyPhotoProps){
    const request = await axios.patch('http://localhost:3000/api/photo/modify', body).then(
        response => response.data
    );

    return{
        type: MODIFY_PHOTO,
        payload: request,
    };
};



// 다른 작가들이 해당 작품의  New btn 클릭시, New 갯수 변경 api
export async function setPhotoNew(body:{isNew:boolean, _id:string}){
    const request = await axios.patch('http://localhost:3000/api/photo/new', body).then(
        response => response.data
    );

    return{
        type: SET_NEW_PHOTO,
        payload: request,
    };
};

// 현재 유저가 해당 페이지 작품의 New 클릭 여부 확인 api
export async function getIsNew(body:{_id:string}){
    const request = await axios.post('http://localhost:3000/api/photo/is_new', body).then(
        response => response.data
    );

    return{
        type: GET_IS_NEW_PHOTO,
        payload: request,
    };
};

// 추천 작품 리스트 가져오기 api
export async function getRecommendPhoto(_id:any, tagList:any){
    const request = await axios.get('http://localhost:3000/api/photo/get_recommend_photo', {params: {_id:_id, tagList: tagList}}).then(
        response => response.data
    );

    return{
        type: GET_RECOMMEND_PHOTO,
        payload: request,
    };
};

// 오늘의 랭킹 리스트 가져오기 api
export async function getTodayLank(){
    const request = await axios.get('http://localhost:3000/api/photo/get_today_lank').then(
        response => response.data
    );

    return{
        type: GET_TODAY_LANK,
        payload: request,
    };
};

// 인기 태그 가져오기 api
export async function getFamousTag(){
    const request = await axios.get('http://localhost:3000/api/photo/get_famous_tag_list').then(
        response => response.data
    );

    return{
        type: GET_FAMOUS_TAG_LIST,
        payload: request,
    };
};

// 최근 등록한 작품 가져오기 api
export async function getRecentPhoto(category:number){
    const request = await axios.get('http://localhost:3000/api/photo/get_recent_photo', {params: {category: category}}).then(
        response => response.data
    );

    return{
        type: GET_RECENT_PHOTO,
        payload: request,
    };
};

// 검색한 단어로 관련된 작품 목록 가져오기 api
export async function searchPhoto(searchTxt:string){
    const request = await axios.get('http://localhost:3000/api/photo/search_photo', {params: {searchTxt: searchTxt}}).then(
        response => response.data
    );

    return{
        type: SEARCH_PHOTO,
        payload: request,
    };
};

// 검색한 단어로 관련된 태그가 있는 작품 리스트 가져오기 api
export async function searchTag(searchTxt:string){
    const request = await axios.get('http://localhost:3000/api/photo/search_tag', {params: {searchTxt: searchTxt}}).then(
        response => response.data
    );

    return{
        type: SEARCH_TAG,
        payload: request,
    };
};
