const App = require('express')();
const http = require('http').Server(App);
const io = require('socket.io')(http);

//Collections from my DB
const Users = require('./schemas').Users
const Chat = require('./schemas').Chat
const Message = require('./schemas').Message

// -make a lisr of connections on the server side.

var connections = [] //purely the number of connections. online or not
var serverActiveUsers = [] //users online at the moment
var publicActiveUsers = []
var activeChats = []

const WRITE_INTERVAL = 3 * 60 * 1000;//interval should be 8
const MAX_MESSAGE_BUFFER = 5;//shold be 25
var writeTimer
// -kepep track of wich users are currently in which chat
// -save all the messages in a given message but also broadcasting them
//     ::if a list reaches some capacity then store it to the db and send trigger
//     to update each users
//     ::Also just update a set of messages periodically anyway.


App.get('/', (req, res) => {
    res.sendfile('../public/index.html');
})

io.on('connection', (socket) => {
    //When a user connects this scope is up for grabs by the user
    console.log('user connected!!')
    
    connections.push(socket);

    for(var conn of connections){
        console.log('SERVER', 'connections :', conn.handshake.address +" "+ conn.handshake.time)
    }

    socket.on('setStatus', (userName, status) => {
        var user
        if((user = serverActiveUsers.find(entity => entity.userName === userName))){
            //user Already in list
            console.log(user, 'was already in the list')
            user.status = status
            publicActiveUsers.find(entity => entity.userName === userName).status = status
        }else{
            serverActiveUsers.push({
                userName : userName,
                status : status,
                socket : socket
            })
            
            publicActiveUsers.push({
                userName : userName,
                status : status
            })
        }
        console.log('publicActiveUsers', publicActiveUsers)
        io.sockets.emit('users online', publicActiveUsers)
    })   
    socket.on('go offline', (userName) => {
        var user
        if((user = serverActiveUsers.find(entity => entity.userName === userName))){
            var index = serverActiveUsers.indexOf(user);
            serverActiveUsers.splice(index, 1)
            publicActiveUsers.splice(index, 1)
        }

        console.log('publicActiveUsers', publicActiveUsers)
        io.sockets.emit('users online', publicActiveUsers)
    })


    socket.on('enter chat', (chatHash, userName) => {
        socket.join(chatHash)

        var message_obj = {
            data : {
                getMessages: [{
                    content:    `${userName}'s here`,
                    userName:   'ChatApp',
                    time:       new Date().getTime().toString(),
                    chatHash:   chatHash
                }]
            }
        }

        //tell everyone that userName joined
        //io.to(chatHash).emit('broadcast_chat', message_obj)
        var chat
        if(!(chat = activeChats.find(entity => entity.hash === chatHash))){//if chats not here already
            chat = {
                hash: chatHash,
                messages: []
            }
            
            console.log("added to active Chats")
            activeChats.push(chat)
        }

        writeTimer = setInterval( writeMessagesToDB, 60000, chat.messages, chatHash)
        //So if someone enters all the messages for the other users will be updated and the messagebuffer cleared. clean start
        writeMessagesToDB(chat.messages, chatHash)
    })
    socket.on('leave chat', (chatHash, userName) => {
        socket.leave(chatHash)
        //tell everyone that userName left chat
        var message_obj = {
            data : {
                getMessages: [{
                    content:    `${userName} left the chat`,
                    userName:   'ChatApp',
                    time:       new Date().getTime(),
                    chatHash:   chatHash
                }]
            }
        }
        io.to(chatHash).emit('broadcast_chat', message_obj)

        //checking to see if namespace is empty
        io.of(chatHash).clients((err, clients) => {
            if(err) throw err

            if(clients.length === 0){
                console.log('removing the chat from active')
                activeChats.splice(activeChats.map(entity => entity.chatHash).indexOf(chatHash), 1)
            }
        })
        clearInterval(writeTimer)
    })


    //Message contains who is sending it and the time sent
    socket.on('send message', (content, userName, chatHash) => {

        var message_obj = {
            data : {
                getMessages: [{
                    userName:   userName,
                    content:    content,
                    time:       new Date().getTime(),
                    chatHash:   chatHash
                }]
            }
        }

        io.to(chatHash).emit('broadcast_chat', message_obj)

        var chat;
        if((chat = activeChats.find(entity => entity.hash === chatHash))){
            chat.messages.push(message_obj.data.getMessages[0])

            console.log(chat.messages.length)
            if(chat.messages.length >= MAX_MESSAGE_BUFFER)
                writeMessagesToDB(chat.messages, chatHash)
        }
    })

    socket.on('disconnect', () => {//This function is called only on disconnect
        console.log('user disconnected.')
        //stop the clock
        clearInterval(writeTimer)
        //remove the user from online users
        var user = serverActiveUsers.find(entity => entity.socket === socket)
        if(user){
            var userIndex = serverActiveUsers.indexOf(user)
            serverActiveUsers.splice(userIndex,1)
            publicActiveUsers.splice(userIndex,1)
        }

        //Take them out of connections list
        var index = connections.indexOf(socket)
        if(index > -1) connections.splice(index, 1)
        //report a new online list
        io.sockets.emit('users online', publicActiveUsers)
    })
})

function writeMessagesToDB(messages, chatHash){
    console.log('messages', messages)
    if(messages.length === 0 || messages == undefined)
        return;

    console.log("WRITING TO DB: ", messages.length)
    Message.insertMany(messages, (err) => {
        if(err){
            console.log(err)
            return err
        }else{
            var chat = activeChats.find( entity => {
                return entity.hash === chatHash
            })
            chat.messages.length = 0
        }            
    })
    
    //Force update all the users in the chat
    io.to(chatHash).emit('force update')
}


http.listen(8080, function(){
    console.log("listening.. :8080")
})