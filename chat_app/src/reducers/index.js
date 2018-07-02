import {combineReducers} from 'redux';
import messages from './messages_reducer'
import chat_list from './chats_reducer'
import modal_reducer from './reducer_showModal'
import home_reducer from './home_reducer'

const rootReducer = combineReducers({
    messageReducer : messages,
    Chats : chat_list,
    isModalOpen : home_reducer,
    homeInfo : home_reducer
}) 

export default rootReducer;