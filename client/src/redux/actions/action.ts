import axios from 'axios';
import { CLIENT_PATH } from 'config/path';

export async function callAPI(method:string, uri:string, type:string, data?:any, config?:any){
    let request = null;
    console.log(data);
    try{
        switch(method){
            case "GET":
                request = await axios.get(`${CLIENT_PATH}api/${uri}`, {params: {data}, headers : {'Pragma': 'no-cache'}}).then(
                    (response:any) => response.data
                );
                break;

            case "POST":
                request = await axios.post(`${CLIENT_PATH}api/${uri}`, data, config).then(
                    (response:any) => response.data
                );
                break;

            case "PUT":
                request = await axios.put(`${CLIENT_PATH}api/${uri}`).then(
                    (response:any) => response.data
                );
                break;

            case "PATCH":
                request = await axios.patch(`${CLIENT_PATH}api/${uri}`, data).then(
                    (response:any) => response.data
                );
                break;

            case "DELETE":
                request = await axios.delete(`${CLIENT_PATH}api/${uri}`, {data}).then(
                    (response:any) => response.data
                );
                break;
        }
    }catch(e){
        console.log(e);
    }

    return { type: type, payload: request, };
}
