const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/ChatApp');

var db = mongoose.connection;
db.on('error', () => {console.log("Failed to connect to mongoose")})
db.once('open', () => {console.log("Connected to mongoose!")})

var Schema = mongoose.Schema

/**
 * Uniquely identifies a user and the
 * chats they are a part of. Not doing
 * passwords for now. Future plans maybe.
 */
var UserSchema = new Schema({
    name : String,
    handle : String,
    id : Number,
    dateJoined : Number, //BSON Date
    myChats : [Number] //chat hashes
}, {collection : 'user'})

/**
 * Identifies a chat regardless of which users are
 * part of it. Makes it easier to add/invite
 * people to a chat
 */
var ChatSchema = new Schema({
    name : String,
    img : String,
    dateCreated : Number,
    lastActive : Number,
    hash : String
}, {collection : 'chat'})

/**
 * Leaving as separate data type to make 
 * it easer to deal with a particular user's
 * set of messages. Maybe you would like to 
 * search through what you've said altogether.
 */
var MessageSchema = new Schema({
    //_id : String,
    content : String,
    userName : String, //made of handle + id
    time : Number,
    chatHash : String
}, {collection : 'message'})

const Users = mongoose.model('User', UserSchema)
const Chat = mongoose.model('Chat', ChatSchema)
const Message = mongoose.model('Message', MessageSchema)

var ObjectID = mongoose.Types.ObjectId

module.exports = {
    Users,
    Chat,
    Message,
    ObjectID
}