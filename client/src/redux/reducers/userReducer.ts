import {
    REGISTER_USER,
    LOGIN_USER,
    LOGOUT_USER,
    AUTH_USER,
    MODIFIED_PERSONAL_IMG_USER,
    MODIFIED_PERSONAL_INFO,
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
        default:
            return state;
    }
}