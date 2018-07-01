import {
    SELECTED_CHAT}
 from '../actions/index'

 export default function(state=null, action){
     switch(action.type){
         case SELECTED_CHAT:
            return action.payload
     }
     return state
 }
