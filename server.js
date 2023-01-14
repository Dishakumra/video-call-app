const express = require('express');
const app=express();
const server=require('http').Server(app);
const io=require('socket.io')(server);
const {v4:uuidV4}=require('uuid')

server.listen(4000)

app.set('view engine','ejs')
app.use(express.static('public'))

app.get('/',(req,res)=>{
    res.redirect(`/${uuidV4()}`)
})

app.get('/:room',(req,res)=>{
    res.render('room',{roomId:req.params.room})
})

io.on('connection', socket => {
    let currentSocket = socket;
    currentSocket.on('join-room', (roomId, userId) => {
      currentSocket.join(roomId);
      if (currentSocket.connected) {
        currentSocket.to(roomId).emit('user-connected', userId);
        socket.on('disconnect',()=>{
            socket.to(roomId).emit('user-disconnected',userId)
        })
      }
    });
  });
