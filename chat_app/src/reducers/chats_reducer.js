import {
    GET_CHATS
} from '../actions/index'

export default function(state=[], action){

    if(action.type === GET_CHATS){
        console.log("get chats payloas", action.payload.data.getChats)
        return action.payload.data.getChats;
    }
    return state;
}

