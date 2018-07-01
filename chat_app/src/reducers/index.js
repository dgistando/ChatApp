import {combineReducers} from 'redux';
import messages from './messages_reducer'
import chat_list from './chats_reducer'

const rootReducer = combineReducers({
    messageReducer : messages,
    Chats : chat_list
})

export default rootReducer;