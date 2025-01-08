import { defineStore } from 'pinia';
import { ref } from 'vue';
export const useLoggedUsers = defineStore('loggedUsers', () => {
    const currentUser = ref(null);

    const newUser = (user) => {
        currentUser.value = user;
    };

    const getUser = () => {
        console.log("BIRDISTHEWORD"+currentUser.value)
        return currentUser.value
    }

    const emptyUser=()=>{
        currentUser.value={}
    }

    return { currentUser, newUser, getUser, emptyUser };
});
