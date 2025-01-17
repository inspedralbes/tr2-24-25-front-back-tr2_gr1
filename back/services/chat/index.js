// Initialize the server and the socket connection
import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import { createServer, get } from 'node:http';
// import { join } from 'node:path';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import { createChat, getChatByAssoId } from './routes/chat.js';
import { createMessage, getMessagesByAssoId } from './routes/message.js';
import { verifyTokenMiddleware } from '../../tokens.js';


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

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Connectat a MongoDB'))
    .catch((err) => console.error('Error al connectar a MongoDB', err));


let chat = [];
//socket connection
io.on('connection', (socket) => {
    console.log('a user connected');

    //function that joins the user to a room  
    // <<< DATA == IDASSO >>> <<< MESSAGES == {idAsso: 1, idUser: 1, message: 'Hola', date: new Date()} >>>
    socket.on('joinChat', (data) => {
        console.log('joinChat', data);
        if (chat.find(room => room.room === data) === undefined) {

            Promise.all([

                getChatByAssoId(data),
                getMessagesByAssoId(data)

            ]).then(([chatData, messagesData]) => {

                chat.push({ room: data, participants: chatData.chat?.participants || [], messages: messagesData.valid == true ? messagesData.messages : [] });
                console.log("sending messages");
                socket.emit('allMessages', chat.find(room => room.room === data).messages);
    
                socket.join(data);
                console.log("I joined the room", data);
            }).catch((error) => {
                console.error('Error fetching chat or messages:', error);
            });

            

        } else {
            socket.emit('allMessages', chat.find(room => room.room === data).messages);

            socket.join(data);
        }


    });

    //function that removes the user from a room
    socket.on('leaveChat', (data) => {
        console.log('leaveChat', data);
        socket.leave(data);
    });

    //function that sends a message to a room
    socket.on('newMessage', (data) => {
        console.log('chat message', data);
        data.date = new Date();

        createMessage(data).then((result) => {
            console.log(result);
        });

        let room = findSocketRoom(socket);
        console.log('room', room);
        if(room!=null){
            io.to(room).emit('chat message', data);
            console.log('room', room);
            let chatAux = chat.find(chatroom => chatroom.room === room)
            console.log(chatAux);
            chatAux.messages.push(data);
        }
        else{
            console.log('room not found');
            console.log('socket', socket.id);
        }



    });
});

app.post("/chat",verifyTokenMiddleware, (req, res) => {
    createChat(req.body).then((result) => {
        res.json(result);
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
const PORT = process.env.CHAT_PORT;
// const PORT = 3001;

server.listen(PORT, () => {
    console.log(`Servidor en funcionament a http://localhost:${PORT}`);
});
