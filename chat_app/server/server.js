const App = require('express')();
const http = require('http').Server(App);
const io = require('socket.io')(http);

// -make a lisr of connections on the server side.

var connections = [] //purely the number of connections. online or not
var activeUsers = [] //users online at the moment
var activeChats = [] //Chats with users in them
var chat = { //This is structure that will be in oactive chats
    name : '',
    users: [],
    messages : []
}


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

    socket.on('go online', (userName) => {
        activeUsers.push({
            userName : userName,
            connection : socket
        })
    })   
    socket.on('go offline', (userName) => {
        activeUsers.splice(indexOf({userName, socket}, 1))
    })


    socket.on('enter chat', (chatName, userName) => {
        var chat;
        if(!(chat = activeChats.find(entity => entity.nam === chatName))){//if chat dnot here already
            //I should do a db opperation here to check the users allowed.
            //Then check this username against those return null if no pass
            activeChats.push({
                name : chatName,
                users : [].push(userName),
                messages : []
            })
        }else{
            //should be a reference to object
            chat
        }
    })
    socket.on('leave chat', (userName) => {

    })



    socket.on('send message', (msg) =>{
        io.emit('message', msg)
    })






    socket.on('disconnect', () =>{//This function is called only on disconnect
        console.log('user disconnected.')
            connections.splice(connectinos.indexOf(socket), 1)
    })
})

http.listen(8080, function(){
    console.log("listening.. :8080")
})