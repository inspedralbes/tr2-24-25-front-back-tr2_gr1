// src/stores/users.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        loggedUser: null,
        associations: [],
        userId: null,
    }),
    actions: {
        setLoggedUser(user) {
            console.log('Usuario recibido para setLoggedUser:', user);
            this.loggedUser = user;
            this.userId = user.id;  // Asegúrate de que `id` esté disponible
            this.associations = user.associacionsId || [];  // Asegúrate de que `associacionsId` esté correctamente asignado
        },        
        getLoggedUser() {
            return this.loggedUser;  // No es necesario console.log aquí si no es necesario
        },
        newUser(user) {
            this.loggedUser = user;
            this.userId = user.id;
            this.associations = user.associacionsId || [];
        }
    }
});