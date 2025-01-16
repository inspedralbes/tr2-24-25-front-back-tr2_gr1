import { io } from "socket.io-client";
import { useChatStore } from '../stores/chat';

const chatStore = useChatStore();

const URL = import.meta.env.VITE_CHAT_ROUTE ;


export const socket = io(URL);


socket.on("allMessages", (data)=>{
    chatStore.setMessages(data);
})

socket.on("chat message", (data)=>{
    chatStore.addMessage(data);
})