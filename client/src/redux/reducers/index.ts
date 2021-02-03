import { combineReducers } from 'redux';
import user from './userReducer';
import photo from './photoReducer';
import comment from './commentReducer';
import admin from './adminReducer';

const rootReducer = combineReducers({
    user,
    photo,
    comment,
    admin,
})

export default rootReducer;