import fetch from 'isomorphic-fetch';

const ROOT_URL = 'http://localhost:4000/graphql?'

export const SELECTED_CHAT = 'SELECTED_CHAT'
export const INSERT_USER = 'INSERT_USER'
export const GET_USER = 'GET_USER'
export const CHECK_USER = 'CHECK_USER'
export const INSERT_CHAT = 'INSERT_CHAT'
export const GET_CHATS = 'GET_CHATS'
export const GET_MESSAGES = 'GET_MESSAGES'
export const INSERT_MESSAGE = 'INSERT_MESSAGE'

export function insertUser(userName, Name){
    //console.log("insertUser: " + userName)

    var insertUserQuery = `
            mutation{
                insertUser(name: \"${Name}\" handle: \"${userName}\"){
                name
                handle
                id
                dateJoined
                myChats
            }
        }
    `
    return {
        type : INSERT_USER,
        payload : getData(insertUserQuery).then(Response => Response.json())
    };
}

export function getUser(handle, id){
    //console.log("getUser: " + handle)

    var getUserQuery = `
            query{
                getUser(handle:\"${handle}\" id:${id}){
                name
                handle
                id
                dateJoined
                myChats
            }
        }
    `
    return {
        type : GET_USER,
        payload : getData(getUserQuery).then(Response => Response.json())
    };
}

export function checkUser(checkUser){
        var rejectedUsers = []

       // if(typeof checkUser === 'Array'){
            checkUser.forEach( entity => {

                var getUserQuery = `
                        query{
                            getUser(handle:\"${entity[0]}\" id:${entity[1]}){
                            name
                            handle
                            id
                            dateJoined
                            myChats
                        }
                    }
                `

                getData(getUserQuery).then(Response => Response.json()).then(json => {
                    if(json.data.getUser.length == 0){
                        rejectedUsers.push(entity[0]+'#'+entity[1])
                    }
                })

            });
    console.log("rejected USERS: "+rejectedUsers)
    return {
        type : CHECK_USER,
        payload : rejectedUsers
    };
}


export function insertChat(name, userList){
    console.log("chatName: ", name)
    console.log('User List: ',userList)

    var insertChatQuery = `
            mutation{
                insertChat(name:\"${name}\"){
                name
                img
                dateCreated
                lastActive
                hash
            }
        }
    `

    return {
        type : GET_CHATS,
        payload : getData(insertChatQuery).then(Response => Response.json()).then( json => {
                var savePayload
                userList.forEach((entity, i) => {
                    entity = entity.split('#')

                    if(i == 0){//Only for the user who sent the request
                        savePayload = addChatToUser(entity[0], entity[1], json.data.insertChat.hash).payload
                    }else{
                        addChatToUser(entity[0], entity[1], json.data.insertChat.hash)
                    }

                })
                //Executing payload that will affect this users list
                return savePayload.then(json => {
                            console.log(json)
                        return getChats(json.data.addChatToUser.myChats).payload
                })
        })
    };
}

function addChatToUser(handle, id, chatHash){
    var addChatToUserQuery = `
        mutation{
            addChatToUser(handle:\"${handle}\" id:${id} chatHash:\"${chatHash}\"){
            name
            handle
            id
            myChats
            }
        }
    `
    //console.log(addChatToUserQuery)
    //Dont really needto do anything wit them. maybe later
    console.log("Adding the data to Users " + handle+id)

    return {
        type: GET_CHATS,
        payload: getData(addChatToUserQuery).then(Response => Response.json())
    }
}

export function getMessages(chatHash){

    var getMessagesQuery = `
        query{
            getMessages(chatHash:\"${chatHash}\"){
            userName,
            content,
            time,
            chatHash
            }
        }
    `
  
    return{
        type: GET_MESSAGES,
        payload: getData(getMessagesQuery).then(Response => Response.json())
    };
    
}

export function getChats(hashes){
        var getChatsQuery = `
            query{
                getChats(hashes : ${JSON.stringify(hashes)}){
                    name
                    img
                    lastActive
                    hash
                }
            }
            
        `

        //console.log("getChatsQuery:",getChatsQuery)

        return {
          type : GET_CHATS,
          payload :  getData(getChatsQuery).then(Response => Response.json())
        };
}


export function getChatsByUser(handle, id){

    async function hashes(){
        let thedata;
        
        try{
            thedata = await getUser(handle, id).payload.then(json => {
                    return getChats(json.data.getUser[0].myChats).payload
                    }).catch(err => {
                        console.log(err)
                    })
        }catch(e){
            thedata = await []
        }

        return thedata;
    }
    
   return {
       type: GET_CHATS,
       payload : hashes()
   }
}

export function insertMessage(content, userName, chatHash){
    //userName = username#id

    var insertMessagesQuery = `
        mutation{
            insertMessage(content:\"${content}\" userName:\"${userName}\" chatHash:\"${chatHash}\"){
                content
                userName
                time
                chatHash
            }
        }
    `

    return {
        type : INSERT_MESSAGE,
        payload : getData(insertMessagesQuery).then(Response => Response.json())
    }
}

export function selectChat(ChatSelected){
    
    //console.log("Chat SELECTED: ",ChatSelected)

    return {
        type: SELECTED_CHAT,
        payload: getChats(ChatSelected.hash).payload
    }
}

//modulized a fuunction to get specific info from the reducer
export function showModal(type){
    return {
        type: type,
        payload : -1
    }
}


function getData(query){
    return(
        fetch(ROOT_URL ,{
            method:'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify({"query" : query})
        })
    )
}
