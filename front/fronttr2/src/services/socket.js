import { io } from "socket.io-client";


const URL = "localhost:3001";

export const socket = io(URL);

socket.on("allMessages", (data)=>{
    //add all messages to Pinia
})

socket.on("chat message", (data)=>{
    //add message to Pinia
})