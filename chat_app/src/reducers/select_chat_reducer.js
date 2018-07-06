import {
    SELECTED_CHAT,
    INSERT_CHAT,
    INSERT_MESSAGE,
    }
 from '../actions/index'

 export default function(stated={}, action){

     switch(action.type){
        case SELECTED_CHAT:
           return action.payload.data.getChats;
        case INSERT_CHAT:
            console.log("Adding new chat" + JSON.stringify( action.payload) )
            return action.payload.data.insertChat;
        case INSERT_MESSAGE:
            console.log("the message"+ action.payload)
            return action.payload.data.insertMessage;
     }
     return {};
 }
