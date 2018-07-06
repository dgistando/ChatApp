import {
    GET_MESSAGES
} from '../actions/index'

export default function(state=[], action){   
     if(action.type === GET_MESSAGES){
        return [action.payload.data.getMessages, ...state][0];
    }
    return state;
}

