import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        id: null,
        token: null,
        nom: '',
        cognoms: '',
        correu: '',
        associacionsId: [],
    }),
    actions: {
        setUserData(userData) {

          

            this.id = userData.id;
            this.token = userData.token;
            this.nom = userData.nom;
            this.cognoms = userData.cognoms;
            this.correu = userData.correu;
            this.associacionsId = userData.associacionsId || [];


            console.log("this is the user: ", userData);
            // Guardar en localStorage
            localStorage.setItem('user', JSON.stringify(userData));
        },
        clearUserData() {
            this.id = null;
            this.token = null;
            this.nom = '';
            this.cognoms = '';
            this.correu = '';
            this.associacionsId = [];

            // Limpiar localStorage
            localStorage.removeItem('user');
        },
        initializeUserData() {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                this.setUserData(userData);
            }
        },
    },
});
