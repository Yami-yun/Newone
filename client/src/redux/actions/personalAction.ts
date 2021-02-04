import axios from "axios"
import {GET_INFO_PERSONAL} from 'redux/actions/types';

// 현재 유저가 개인 페이지에 들어가면 개인페이지의 유저 정보를 가져오는 api
export async function getPersonalInfo(body:any){

    const request = await axios.post('/api/users/get_personal_info',body).then(
        response=>response.data);

        return ({
            type: GET_INFO_PERSONAL,
            payload: request,
        });
};