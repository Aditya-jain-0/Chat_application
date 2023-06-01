const http = require('http');
const express = require('express');
const app = express()
const port = process.env.PORT || 3000;
const server =app.listen(port,()=>{
    console.log(`Listening to port ${port}`)
})

app.use(express.static(__dirname + '/public'))
app.get("/",(req,res)=>res.sendFile(__dirname+ "/index.html"))

// Socket io
const io = require('socket.io')(server);
var users = {};
io.on('connection',(socket)=>{
    socket.on('new-user-joined',(username)=>{
        users[socket.id] = username; //assign id to the user when joined
        socket.broadcast.emit('user-connected',username) //emit the message to all connected users when new user connect
        io.emit("user-list",users)
    })

    socket.on("disconnect",()=>{
        socket.broadcast.emit("user-disconnected",username=users[socket.id]);
        delete username;
        io.emit("user-list",users) ///emit the message to all connected users when user left
     })
     //send message 
     socket.on('message',(data)=>{
        socket.broadcast.emit("message",{user:data.user,msg:data.msg})
     })
});


        