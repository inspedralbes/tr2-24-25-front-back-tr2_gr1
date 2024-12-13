// Initialize the server and the socket connection
import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { Server } from 'socket.io';
import cors from 'cors';


const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
}));
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Allow requests from this origin
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true
    }
});

let chat = [];
//socket connection
io.on('connection', (socket) => {
    console.log('a user connected');

    //function that joins the user to a room
    socket.on('joinChat', (data) => {
        console.log('joinChat', data);
        if(chat.find(room => room.room === data) === undefined){
            chat.push({room: data, messages: []});
        } else{
            socket.emit('allMessages', chat.find(room => room.room === data).messages);
        }
        socket.join(data);
    });

    //function that removes the user from a room
    socket.on('leaveChat', (data) => {
        console.log('leaveChat', data);
        socket.leave(data);
    });
    
    //function that sends a message to a room
    socket.on('newMessage', (data) => {
        console.log('chat message', data);
        data.time=new Date();
        let room=findSocketRoom(socket);
        console.log('room', room);
        io.to(room).emit('chat message', data);
        console.log('room', room);
        let chatAux=chat.find(chatroom => chatroom.room === room)
        console.log(chatAux);
        chatAux.messages.push(data);
        
    });
});

//function that returns all the rooms a user is in
function findSocketRoom(socket) {
    const rooms = io.sockets.adapter.rooms;
    console.log('rooms', rooms);
    for (let room of socket.rooms) {
        if (room !== socket.id) {
            return room;
        }
    }
    return null;
}
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Servidor en funcionament a http://localhost:${PORT}`);
});
