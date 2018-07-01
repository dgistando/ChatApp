const App = require('express')();
const http = require('http').Server(App);
const io = require('socket.io')(http);

App.get('/', (req, res) => {
    res.sendfile('../public/index.html');
})

io.on('connection', (socket) => {
    console.log('user connected!!')

    socket.on('message', (msg) =>{
        io.emit('message', msg)
    })

    socket.on('disconnect', () =>{
        console.log('user disconnected.')
    })
})

http.listen(8080, function(){
    console.log("listening.. :8080")
})