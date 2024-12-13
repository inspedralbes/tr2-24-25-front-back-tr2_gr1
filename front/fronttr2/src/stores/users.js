import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useLoggedUsers = defineStore('loggedUsers', () => {
    const users = ref([]);

    const newUser = (user) => {
        users.value.push(user);
    };

    return { users, newUser };
});
