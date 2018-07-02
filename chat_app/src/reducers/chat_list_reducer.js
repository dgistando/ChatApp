import {
    SELECTED_CHAT,
    INSERT_CHAT}
 from '../actions/index'

 export default function(state={}, action){
     switch(action.type){
        case SELECTED_CHAT:
           console.log("thisi s in the chatList")
           state.activeChat =  action.payload
        case INSERT_CHAT:
            console.log("Adding new chat")
            state.insertChat = action.payload.data.insertChat
     }
     return state
 }
