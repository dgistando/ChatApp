const App = require('express')();
const http = require('http').Server(App);
const io = require('socket.io')(http);

// -make a lisr of connections on the server side.

var connections = [] //purely the number of connections. online or not
var serverActiveUsers = [] //users online at the moment
var publicActiveUsers = []
var activeChats = []


// -kepep track of wich users are currently in which chat
// -save all the messages in a given message but also broadcasting them
//     ::if a list reaches some capacity then store it to the db and send trigger
//     to update each users
//     ::Also just update a set of messages periodically anyway.

//TODO
/**
 * fix the way messages are added to the display and RAM. make sure no nested arrays
 * 
 * Finish looking through this file and replace all the proper places socket should be used
 * with the functions in this file.
 * 
 * add a time interval to this file when a users join a chat to write data periodically
 *  >add a mongodb connection to this file.
 *  >add proper functions to the API if nessecary.(maybe not have graphQL endpoint here. (This part api doesnt/shouldnt
 *  be public so you can do direct db writes/reads. The sockets API will be provied as part fo the chatApp API when available)
 * 
 */

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

    socket.on('go online', (userName) => {
        serverActiveUsers.push({
            userName : userName,
            status : "online",
            socket : socket
        })
        
        publicActiveUsers.push({
            userName : userName,
            status : "online"
        })
        io.sockets.emit('users online', publicActiveUsers)
    })   
    socket.on('go away', (userName) => {
        var user
        if((user = serverActiveUsers.find(entity => entity.userName === userName))){
            //user Already in list
            user.status = "away"
        }else{
            serverActiveUsers.push({
                userName : userName,
                status : "away",
                socket : socket
            })

            publicActiveUsers.push({
                userName : userName,
                status : "away"
            })
        }
        io.sockets.emit('users online', publicActiveUsers)
    })   
    socket.on('go offline', (userName) => {
        var user
        if((user = serverActiveUsers.find(entity => entity.userName === userName))){
            var index = serverActiveUsers.indexOf(user);
            serverActiveUsers.splice(index, 1)
            publicActiveUsers.splice(index, 1)
        }
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

        if(!(chat = activeChats.find(entity => entity.hash === chatHash))){//if chats not here already
            activeChats.push({
                hash: chatHash,
                messages: []
            })
        }
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
                activeChats.splice(activeChats.map(entity => entity.chatHash).indexOf(chatHash), 1)
            }
        })
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
        }

        console.log(chat.messages)
    })




    socket.on('disconnect', () =>{//This function is called only on disconnect
        console.log('user disconnected.')
        var index = connections.indexOf(socket)

        if(index > -1) connections.splice(index, 1)
        io.sockets.emit('users online', publicActiveUsers)
    })
})

http.listen(8080, function(){
    console.log("listening.. :8080")
})