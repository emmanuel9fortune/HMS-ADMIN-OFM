import {io} from "socket.io-client"

const socket = io('http://localhost:7700')

const getStaffRole = sessionStorage.getItem('staffID')

function setUplistiners(onMessage){
    socket.on('connect', ()=>{
        console.log('connected to server:', socket.id);
    })

    socket.emit('joinRoom', `${getStaffRole?.role}`)

    socket.on('recieve_message', (data)=>{
        console.log('message received:', data)
         if(onMessage){
            onMessage(data)
        }
    })
}

function sendMessage(data){
    socket.emit('send_message', data)
}

export {socket, setUplistiners, sendMessage}