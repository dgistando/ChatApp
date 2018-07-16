var express = require('express');
var graphqlHTTP = require('express-graphql')

const {GraphQLSchema,
       GraphQLObjectType,
       GraphQLList,
       GraphQLString,
       GraphQLInt,
       GraphQLFloat,
    } = require('graphql/type')

/**
 * Providing a layer of abstraction through graphQL.
 * Makes it easer for other developers to retrieve data
 * For the purpose of the application I'm only getting things
 * from my mongoose instance but I could also add other apis. Maybe
 * one for pictures or gifs in chats.
 */

//my API
const Users = require('./schemas').Users
const Chat = require('./schemas').Chat
const Message = require('./schemas').Message

const UsersType = require('./GQL_Types').UsersType
const ChatType = require('./GQL_Types').ChatType
const MessageType = require('./GQL_Types').MessagType

var ObjectId = require('./schemas').ObjectID

var mutationType = new GraphQLObjectType({
    name : 'Muation',
    fields : () => ({

        insertUser : {
            type : UsersType,
            args: {
                name : { type: GraphQLString},
                handle : { type: GraphQLString}
            },
            resolve : (_, {name, handle}) => {
                return new Promise((resolve, reject) => {

                    Users.find({handle : handle}).sort('-id').exec((err, result) => {

                        var User = { 
                                    name : name,
                                    handle : handle,
                                    id : null,
                                    dateJoined : new Date().getTime(),
                                    myChats : []
                        }

                        //Check if new handle
                        if(!err){//if new 1 else max(id)+1
                            User.id = (result === undefined || result.length == 0) ? 1 : result[0].id + 1 
                        }else{
                            reject(err)
                        } 

                        //Now we can save the record
                        new Users(User).save((err, res) => {
                            err ? reject(err) : resolve(res)
                        })
                    })
                })
            }
        },

        insertChat : {
            type : ChatType,
            args: {
                name : { type: GraphQLString }
            },
            resolve : (_, {name}) => {
                return new Promise((resolve, reject) => {
                    new Chat({
                        name : name,
                        img : 'placeholder.jpeg', // Do image search or take user input 
                        dateCreated : new Date().getTime(),
                        lastActive : new Date().getTime(),
                        hash : require('crypto').randomBytes(10).toString('hex')
                    }).save((err, res) => {
                        err ? reject(err) : resolve(res)
                    })
                })
            }
        },

        //Insert message int to chat
         insertMessage : {
            type: MessageType,
            args:{
                content : {type : GraphQLString},
                userName : {type : GraphQLString}, //made of handle + id
                chatHash : {type : GraphQLString},
            },
            resolve : (_, {content, userName, chatHash}) => {
                return new Promise((resolve, reject) => {
                    new Message({
                        content,
                        userName,
                        time : new Date().getTime(),
                        chatHash
                    }).save((err, res) => {
                        err ? reject(err) : resolve(res)
                    })
                })
            }
        },

        //db.user.update({handle, id}, {$push : {"myChats": chatHash}} )
        addChatToUser : {
            type : UsersType,
            args: {
                handle : {type : GraphQLString},
                id: {type : GraphQLInt},
                chatHash: {type : GraphQLString}
            },
            resolve : (_, {handle, id, chatHash}) => {
                return new Promise((resolve, reject) => {
                    Users.findOne({handle : handle, id : id}, (err, user) => {                        
                        if(err) reject(err)

                        user.myChats.push(chatHash);
                        user.save((err, updatedUser) => {
                            if(err) reject(err)
                            
                            resolve(updatedUser)
                        })
                    })
                })
            }
        },

        //remove from the chat
        deleteMessage : {
            type: MessageType,
            args:{
                _id : {type : GraphQLString}
            },
            
            resolve : (_ , {_id}) => {
                return new Promise((resolve, reject) => {
                    Message.findOneAndRemove(new ObjectId(_id), (err, res) => {
                        err ? reject(err) : resolve(res)
                    })
                })
            }
        },

        //Gets rid chat and messages
        deleteChat : {
            type: ChatType,
            args:{
                hash : {type : GraphQLString}
            },
            
            resolve : (_ , {hash}) => {
                return new Promise((resolve, reject) => {
                    Chat.findOneAndRemove({hash}, (err, res) => {
                        // err ? reject(err) : resolve(res)
                        if(err) reject(err)

                        Message.remove({chatHash : hash}, (err, res) => {
                            if(err) reject(err)
                            console.log('remove', res)
                        })

                        resolve(res)
                    })
                })
            }
        }

    })
})

//Resolving the schemas to actual queries
var queryType = new GraphQLObjectType({
    name:'Query',

    fields : () => ({
        getUser : {
            type : new GraphQLList(UsersType),
            args : {
                handle: {type : GraphQLString},
                id:     {type : GraphQLInt}
            },
            resolve : (_, {handle, id}) => {
                return new Promise((resolve, reject) => {
                    Users.find({handle : handle, id : id}, (err, userList) => {
                        err ? reject(err) : resolve(userList)
                    }) 
                })
            }
        },
        
        getChat : {
            type: ChatType,
            args:{
                hash: {type : GraphQLString}
            },
            resolve : (_, {hash}) =>{
                return new Promise((resolve, reject) => {
                    Chat.find({hash}, (err, res) => {
                        err ? reject(err) : resolve(res)
                    })
                })
            }
        },      

        getChats : {
            type: new GraphQLList(ChatType),
            args:{
                hashes: {type : GraphQLList(GraphQLString)}
            },
            resolve : (_, {hashes}) =>{
                return new Promise((resolve, reject) => {
                    Chat.find({hash: {$in : hashes}}, (err, res) => {
                        err ? reject(err) : resolve(res)
                    })
                })
            }
        },

        //Gets all the messages in a given chat
        getMessages : {
            type : new GraphQLList(MessageType),
            args : {
                chatHash : {type : GraphQLString}
            },
            resolve : (_, {chatHash}) => {
                return new Promise((resolve, reject) => {
                    Message.find({chatHash}, (err, res) => {
                        err ? reject(err) : resolve(res)
                    })
                })
            }
        }
        
    })
})

function resolveCallback(err, resolve){
    return err ? reject(err) : resolve(resolve)
}

var app = express();
app.use('/graphql', require('cors')(), graphqlHTTP({
    schema : new GraphQLSchema({ query : queryType,
                                 mutation : mutationType}),
    pretty : true,
    graphiql : true,
}));
app.listen(4000, (err) => console.log('listening ... :4000'));