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
} from 'redux/actions/types';


export default function(state={}, action:any){
    switch(action.type){
        case ADD_PHOTO:
            return {...state, addPhoto: action.payload};

        case GET_INFO_PHOTO:
            return {...state, getInfo: action.payload};

        case GET_AUTHOR_INFO:
            return {...state, getAuthorInfo: action.payload};

        case TMP_PHOTO_DELETE:
            return {...state, tmpPhotoDelete: action.payload};

        case TMP_PHOTO_UPLOAD:
            return {...state, tmpPhotoUpload: action.payload};

        case DELETE_PHOTO:
            return {...state, deletePhoto: action.payload};

        case MODIFY_PHOTO:
            return {...state, modifyPhoto: action.result};

        case SET_NEW_PHOTO:
            return {...state, setNewPhoto: action.result};

        case GET_IS_NEW_PHOTO:
            return {...state, getIsNewPhoto: action.result};

        case GET_RECOMMEND_PHOTO:
            return {...state, getRecommendPhoto: action.result};

        case GET_TODAY_LANK:
            return {...state, getTodayLank: action.result};

        case GET_FAMOUS_TAG_LIST:
            return {...state, getFamousTagList: action.result};

        case GET_RECENT_PHOTO:
            return {...state, getRecentPhoto: action.result};

        case SEARCH_PHOTO:
            return {...state, searchPhoto: action.result};

        case SEARCH_TAG:
            return {...state, searchTag: action.result};

        default:
            return state;
    }
};