import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useLoggedUsers = defineStore('loggedUsers', () => {
    const currentUser = ref(null);

    const newUser = (user) => {
        currentUser.value = user;
    };

    return { currentUser, newUser };
});
