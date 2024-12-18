import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useLoggedUsers = defineStore('loggedUsers', () => {
    const users = ref([]);

    const newUser = (user) => {
        users.value.push(user);
    };

    const getUser = () => {
        console.log("BIRDISTHEWORD"+users.value[0])
        return users.value[0]
    }

    const emptyUser=()=>{
        users.value=[]
    }

    return { users, newUser, getUser, emptyUser };
});
