import {
    GET_MESSAGES
} from '../actions/index'

export default function(state=[], action){   
     if(action.type === GET_MESSAGES){//This is incorrect because im making a very large array. Evrytime you hit enter it adds an
        //an array to the array and you lose theother arrays because i only select the 0th index
        return [action.payload.data.getMessages, ...state][0];
    }
    return state;
}

