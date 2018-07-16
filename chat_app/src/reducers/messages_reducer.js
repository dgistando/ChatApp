import {
    GET_MESSAGES
} from '../actions/index'

export default function(state=[], action){   
     if(action.type === GET_MESSAGES){
            console.log('final arr', action.payload.data.getMessages.concat(state))
            return state.concat(action.payload.data.getMessages)
    }else if(action.type === 'clear messages'){
        state = []
    }
    return state;
}

