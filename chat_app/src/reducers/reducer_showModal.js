
export default function(state = false, action){
    
    switch(action.type){
        case 'show':
            console.log('show '+ action.payload)
            return action.payload;
        case 'hide':
            console.log('hide '+action.payload)
            return action.payload;
    }

    return state;
}