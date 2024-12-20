import { io } from "socket.io-client";
import { useChatStore } from '../stores/chat';

const chatStore = useChatStore();

const URL = import.meta.env.VITE_CHAT_ROUTE ;
console.log("a0isdfhauioehsfcjoahfuioasehdfio!"+URL);

export const socket = io(URL);


socket.on("allMessages", (data)=>{
    console.log(data);
    chatStore.setMessages(data);
})

socket.on("chat message", (data)=>{
    console.log(data);
    chatStore.addMessage(data);
})