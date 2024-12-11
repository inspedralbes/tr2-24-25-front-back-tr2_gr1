<template>
    <div class="spa-16 main">
        <div class="gridMessages">
            <XatMessage v-for="message in messages" :key="message.id" :messageData="message" />  
        </div>
        
    </div>
    <div class="inputContainer">
            <InputText type="text" class="chatInput" v-model="message" @keyup.enter="sendMessage" />
            <Button icon="pi pi-arrow-right" rounded class="buttonSend" @click="sendMessage" />
        </div>
    <NavigationBar />
</template>
<script setup>
import { ref, onMounted } from 'vue';
import {socket} from '@/services/socket';
import NavigationBar from '@/components/NavigationBar.vue';
import XatMessage from './XatMessage.vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';

const message = ref('');
const messages = ref([])
    onMounted(() => {
        console.log('Component is mounted')
        //getAssociationId
        socket.emit('joinChat', 1); //This must be changed to the association id

    })

    //This code is just for testing
    socket.on('allMessages', (data) => {
        messages.value = data;
    })
    //This code is just for testing
    socket.on('chat message', (data) => {
        console.log(data)
        messages.value.push(data);
    })

    //function to send a message
    function sendMessage(){
        let auxObject={
            userid: 1, //This must be changed to the user id
            content: message.value,
            associationid: 1, //This must be changed to the association id
            username: "sample" //This must be changed to the user name
        }
        socket.emit('newMessage', auxObject);
        message.value = '';
    }
</script>
<style scoped>
.main {
    background-color: var(--main-color);
    padding: 1rem;
    padding-bottom: 8rem;
    width: 100%;
    box-sizing: border-box;
    margin: 0;
    height: calc(100vh - 4rem); /* Adjust height to occupy the whole page minus the input container */
    overflow-y: auto; /* Add scroll if content overflows */
}
.chatInput{
    width: 98%;
    margin-left: auto;
    border-radius: 15px;
    background-color: var(--accent-light-color);
    border: 1px solid var(--accent-light-color);
    color: var(--bold-color);
}
.inputContainer{
    position: fixed;
    bottom: 4rem;
    padding-bottom: 0.5rem;
    padding-top: 0.5rem;
    width: 100%;
    display: grid;
    grid-template-columns: 7fr 1fr;
    justify-content: center;
    gap: 0.4rem;
    background-color: var(--main-color);
    z-index: 100;
    border:none;
    @media screen and (min-width: 768px){
        grid-template-columns: 9fr 1fr;
        
    }
}
.buttonSend{
    border-radius: 50%;
    border: 1px solid var(--accent-light-color);
    background-color: var(--accent-light-color);
    color: var(--bold-color);
}
.gridMessages{
    display: grid;
    grid-template-columns: 100%;
    gap: 0.5rem;
    width: 100%;
}
</style>