let io = null

function setIO(ioInstance){
    io = ioInstance
}

function getIO(){
    if(!io){
        throw new Error("socket.io not initialized")
    }

    return io
}

module.exports ={setIO, getIO}