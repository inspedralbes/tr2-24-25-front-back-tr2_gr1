// userStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('userStore', () => {
    const users = ref([]); // Guardar usuarios logueados

    const setLoggedUser = (user) => {
        users.value = [user]; // Establecer el usuario logueado
    };

    const getLoggedUser = () => {
        return users.value.length > 0 ? users.value[0] : null; // Devolver el usuario logueado
    };

    return {
        users,
        setLoggedUser,
        getLoggedUser,
    };
});
