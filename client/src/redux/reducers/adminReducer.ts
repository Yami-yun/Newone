import { 
    GET_DATA,
} from '../actions/types';


export default function(state={}, action:any) {
    switch(action.type){
        case GET_DATA:

            return {...state, getData: action.payload};


        default:
            return state;
    }

};