import {combineReducers} from 'redux';
import messages_reducer from './messages_reducer'
import single_item_reducer from './single_item_reducer'
import chats_reducer from './chats_reducer';


const rootReducer = combineReducers({
    Messages : messages_reducer,
    Chats : chats_reducer,
    single_item_reducer : single_item_reducer,
}) 

export default rootReducer;