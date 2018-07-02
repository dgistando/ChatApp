import fetch from 'isomorphic-fetch';

const ROOT_URL = 'http://localhost:4000/graphql?'

export const SELECTED_CHAT = 'SELECTED_CHAT'
export const INSERT_USER = 'INSERT_USER'
export const GET_USER = 'GET_USER'
export const INSERT_CHAT = 'INSERT_CHAT'

export function insertUser(userName, Name){
    console.log("insertUser: " + userName)

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
    console.log("getUser: " + userName)

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

export function insertChat(name, userList){
    console.log("chatName: " + name)
    console.log('User List: '+ userList)

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

    //now i have to add the this chat to the list of users that was there
    return {
        type : INSERT_CHAT,
        payload : getData(insertChatQuery).then(Response => Response.json())
    };
}

export function selectChat(ChatSelected){
    //make getResuest to data
    return {
        type: SELECTED_CHAT,
        payload: ChatSelected
    }
}

export function showModal(type){
    console.log("actions show modal")
    return {
        type: type,
        payload : false
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
