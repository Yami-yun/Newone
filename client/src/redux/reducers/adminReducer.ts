import { 
    GET_DATA,
    GET_ALL_USER_DATA,
    GET_ALL_PHOTO_DATA,
    DELETE_USER_INFO,
    DELETE_PHOTO_INFO,
} from '../actions/types';


export default function(state={}, action:any) {
    switch(action.type){
        case GET_DATA:

            return {...state, getData: action.payload};
        case GET_ALL_USER_DATA:

            return {...state, getAllUserData: action.payload};
        case GET_ALL_PHOTO_DATA:

            return {...state, getAllPhotoData: action.payload};
        case DELETE_USER_INFO:

            return {...state, deleteUserData: action.payload};
        case DELETE_PHOTO_INFO:

            return {...state, deletePhotoInfo: action.payload};

        default:
            return state;
    }

};
