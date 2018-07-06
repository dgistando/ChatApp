/**
 * All of these action return a single
 * item so they can have the same structure.
 * 
 * It gets very conviluted when you have multiple
 * files returning the same structure type. Redux 
 * doesn't handle it well
 */

import {
    INSERT_USER,
    GET_USER,
    CHECK_USER,
    SELECTED_CHAT,
    INSERT_CHAT,
    INSERT_MESSAGE,
} from '../actions/index'

export default function(state = {}, action){
    //console.log('action.type : ' + action.type)
  
    switch(action.type){
        //Only for Modals
        case 'show':
            state.isModalOpen = true; break;
        case 'hide' :
            state.isModalOpen = false; break;
        case 'login' :
            state.modalType = 'login'; break;
        case 'new' :
            state.modalType = 'new'; break;
        case 'chat' :
            state.modalType = 'chat'; break;

        //USER RELATED
        case INSERT_USER :
            state.userInfo = action.payload.data.insertUser; break;
        case GET_USER :
            state.userInfo = action.payload.data.getUser[0]; break;
        case CHECK_USER :
            state.userExist = action.payload; break;

        //CHAT RELATED
        case SELECTED_CHAT:
             state.activeChat = action.payload.data.getChats; break;
        case INSERT_CHAT:
            console.log(action.payload.data.insertChat)
            state.insertedChat = action.payload.data.insertChat; break;
        case INSERT_MESSAGE:
            state.insertedMessage = action.payload.data.insertMessage; break;
        }

        return Object.assign({}, state);
    }



    /*var type = action.type;
    if(type === 'show'){
        console.log('show '+ action.payload)
        state.isModalOpen = true;
    }else if(type === 'hide'){
        console.log('hide '+ action.payload)
        state.isModalOpen = false;
    }else if(type === 'login'){
        console.log('login '+ action.payload)
        state.modalType = 'login';
    }else if(type === 'new'){
        console.log('new '+ action.payload)
        state.modalType = 'new';
    }else if(type === 'chat'){
        console.log('chat '+ action.payload)
        state.modalType = 'chat';
    }else if(type === INSERT_USER){
        console.log('insert User. get: '+ action.payload.data.insertUser)
        state.userInfo = action.payload.data.insertUser//adding the user data to the state array
    }else if(type === GET_USER){
        console.log('getUser: '+ JSON.stringify(action.payload.data.getUser[0]))
        state.userInfo = action.payload.data.getUser[0]
    }else if(type === CHECK_USER){
        console.log("checkUser: "+ JSON.stringify(action.payload))
        //state.userExist = (action.payload.data.getUser.legnth == 0) ? false : true;
        state.userExist = action.payload
    }*/