import { io } from "socket.io-client";


const URL = "http://localhost:3001/";

export const socket = io(URL);

socket.on("allMessages", (data)=>{
    console.log(data);
})

socket.on("chat message", (data)=>{
    console.log(data);
})