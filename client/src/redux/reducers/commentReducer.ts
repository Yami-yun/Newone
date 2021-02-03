import { 
    ADD_COMMENT, 
    GET_COMMENT, 
    DELETE_COMMENT, 
    MODIFY_COMMENT,
} from '../actions/types';


export default function(state={}, action:any) {
    switch(action.type){
        case ADD_COMMENT:

            return {...state, addComment: action.payload};

        case GET_COMMENT:
            return {...state, getComment: action.payload};

        case DELETE_COMMENT:
            return {...state, deleteComment: action.payload};

        case MODIFY_COMMENT:
            return {...state, modifyComment: action.payload};

        default:
            return state;
    }

};