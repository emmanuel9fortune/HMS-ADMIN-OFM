
const {Server} = require('socket.io')

let io;

function initSocket(server){
  io = new Server(server, {
    cors: {origin: ''}
  })

  io.on('connection', (socket)=>{
    ('Client connected:', socket.id)

    socket.on('message', (data)=>{
      ('message from client:', data)
    })

    socket.broadcast.emit('message', data)
    
    socket.on('disconnect', ()=>{
      ('client disconnected')
    })
  })
}

function getIO(){
  if(!io){
    throw new Error('Socket.io not initialized')
  }
  return io
}


module.exports = {initSocket, getIO}