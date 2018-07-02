import {
    INSERT_USER,
    GET_USER
} from '../actions/index'

export default function(state = {}, action){
    //console.log('action.type : '+action.type)

    var type = action.type

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
        console.log('getUser: '+ action.payload.data.getUser)
        state.userInfo = action.payload.data.getUser[0]
    }



    /*switch(action.type){
        case 'show':
            console.log('show '+ action.payload)
            state.isModalOpen = true;
        case 'hide':
            console.log('hide '+action.payload)
            state.isModalOpen = false;
        case INSERT_USER:
            console.log('getUser: ')
            state.userInfo = action.payload.data.insertUser//adding the user data to the state array
    }*/

    return state;
}