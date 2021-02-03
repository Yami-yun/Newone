import axios from "axios"
import {GET_INFO_PERSONAL} from 'redux/actions/types';


export async function getPersonalInfo(body:any){

    const request = await axios.post('/api/users/get_personal_info',body).then(
        response=>response.data);

        return ({
            type: GET_INFO_PERSONAL,
            payload: request,
        });
};