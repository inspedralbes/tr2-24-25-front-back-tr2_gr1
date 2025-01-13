<template>
<div class="flex items-start gap-2.5 max-w-[80%]" v-if="loggedUsersStore.currentUser.id!=messageData.idUser"> <!-- v-if="messageData.userid == storage.userid" -->
   <img class=" w-8 h-8 rounded-full profilePicture" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0d613azJ2R2wo9p-0X4dVXID_4fAT4MP90w&s" :alt="'Foto de perfil '+messageData.username">
   <div class="flex flex-col min-w-[10%] max-w-[80%] leading-1.5 p-4 border-gray-200 bg-CustomLightAccen rounded-e-xl rounded-es-xl dark:bg-CustomLightAccent">
      <div class="flex items-center space-x-2 rtl:space-x-reverse">
         <span class="text-sm font-semibold text-black dark:text-black">{{messageData.username}}</span>
         <span class="text-sm font-normal text-CustomDarkAccent dark:text-CustomDarkAccent">{{messageData.date}}</span>
      </div>
      <p class="text-sm font-normal py-2.5 text-black dark:text-blackoverflow-visible overflowControl">{{ messageData.message }}</p>
   </div>
   <!-- <button id="dropdownMenuIconButton" data-dropdown-toggle="dropdownDots" data-dropdown-placement="bottom-start" class="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600" type="button">
      <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
         <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
      </svg>
   </button>
   <div id="dropdownDots" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-40 dark:bg-gray-700 dark:divide-gray-600">
      <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
         <li>
            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Reply</a>
         </li>
         <li>
            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Forward</a>
         </li>
         <li>
            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Copy</a>
         </li>
         <li>
            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Report</a>
         </li>
         <li>
            <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Delete</a>
         </li>
      </ul>
   </div> -->
</div>
<div class="flex items-start gap-2.5 myMessage" v-else> 
   <img class=" w-8 h-8 rounded-full profilePicture" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0d613azJ2R2wo9p-0X4dVXID_4fAT4MP90w&s" :alt="'Foto de perfil '+messageData.username">
   <div class="flex flex-col min-w-[10%] max-w-[80%] leading-1.5 p-4 border-gray-200 bg-CustomLightAccen rounded-s-xl rounded-es-xl rounded-ee-xl dark:bg-CustomLightAccent">
      <div class="flex items-center space-x-2 rtl:space-x-reverse">
         <span class="text-sm font-semibold text-black dark:text-black">{{messageData.username}}</span>
         <span class="text-sm font-normal text-CustomDarkAccent dark:text-CustomDarkAccent">{{messageData.date}}</span>
      </div>
      <p class="text-sm font-normal py-2.5 text-black dark:text-blackoverflow-visible overflowControl">{{ messageData.message }}</p>
   </div>
  
</div>
</template>
<script setup>
import { ref } from 'vue';
import { useLoggedUsers } from '@/stores/users';
import { defineProps } from 'vue';
const loggedUsersStore = useLoggedUsers();
const props = defineProps({
   messageData: {
      type: Object,
      required: true
   }
});

</script>
<style scoped>
.overflowControl {
   overflow-wrap: break-word;
}
.profilePicture {
   object-fit: cover;
}
.myMessage{
   flex-direction: row-reverse;
   /* border-start-start-radius: 0.75rem; */
}
</style>