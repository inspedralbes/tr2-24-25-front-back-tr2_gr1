import { defineStore } from 'pinia';

export const useLoggedUsers = defineStore('loggedUsers', () => {
    const currentUser = ref(null);

    const newUser = (user) => {
        currentUser.value = user;
    };

    const getUser = () => {
        console.log("BIRDISTHEWORD" + currentUser.value);
        return currentUser.value;
    };

    const emptyUser=()=>{
        users.value=null;
    }

    return { currentUser, newUser, getUser, emptyUser };
});
