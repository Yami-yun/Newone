import {
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
} from 'redux/actions/types';


export default function(state={}, action:any){
    switch(action.type){
        case REGISTER_USER:
            return{ ...state, register: action.payload};

        case LOGIN_USER:

            return{...state, login: action.payload};
        case LOGOUT_USER:

            return {...state, logout: action.payload};

        case AUTH_USER:
            return {...state, auth: action.payload};

        case MODIFIED_PERSONAL_IMG_USER:
            return {...state, personalImg: action.payload};

        case MODIFIED_PERSONAL_INFO:
            return {...state, personalInfo: action.payload};
        
        case MODIFY_PASSWORD:
            return {...state, modifyPassword: action.payload};

        case GET_VERIFIED_CODE:
            return {...state, getVerifiedCode: action.payload};

        case INFO_USER:
            return {...state, infoUser: action.payload};

        case FOLLOW_USER:
            return {...state, followUser: action.payload};

        case GET_IS_FOLLOW_USER:
            return {...state, getIsFollowUser: action.payload};

        case SEARCH_AUTHOR:
            return {...state, searchAuthor: action.payload};

        default:
            return state;
    }
}