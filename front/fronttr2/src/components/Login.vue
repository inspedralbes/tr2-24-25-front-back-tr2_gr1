<template>
    <div class="screen-container">
        <Card>
            <template #title>Iniciar sessió</template>
            <template #content>
                <!-- Campo Correo -->
                <div class="card flex flex-wrap justify-center items-end gap-4">
                    <FloatLabel variant="in">
                        <label for="correu_label">Correu</label>
                        <InputText id="correu_label" v-model="correu" autocomplete="off" />
                    </FloatLabel>
                </div>

                <!-- Campo Contraseña -->
                <div class="card flex flex-wrap justify-center items-end gap-4">
                    <FloatLabel variant="in">
                        <label for="contrasenya_label">Contrasenya</label>
                        <InputText type="password" id="contrasenya_label" v-model="contrasenya" autocomplete="off" />
                    </FloatLabel>
                </div>
                <div class="flex items-center gap-2">
                    <Checkbox v-model="session" inputId="session" name="session" value="session" />
                    <label for="session"> Mantenir sessió iniciada </label>
                </div>
                <div class="card flex flex-wrap justify-center items-end gap-4">
                    <Button class="button secondary-button" label="Iniciar sessió" icon="pi pi-check" iconPos="left"
                        severity="success" :loading="loading" @click="login" />
                    <Button class="button secondary-button" label="Registrar-se" icon="pi pi-arrow-right" iconPos="left"
                        severity="success" :loading="loading" @click="router.push('/register')" />
                </div>

                <!-- Diálogo de Alerta -->
                <Dialog :visible="visible" modal header="Alerta" :style="{ width: '25rem' }" class="bg-white">
                    <span class="text-surface-500 dark:text-surface-400 block mb-8">
                        Es requereix un Correu i una Contrasenya
                    </span>
                    <div class="flex justify-end gap-2">
                        <Button class="button secondary-button" type="button" label="Entesos" @click="visible = false"
                            severity="success" />
                    </div>
                </Dialog>
            </template>
        </Card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Card from 'primevue/card';
import { useLoggedUsers } from '@/stores/users';

import { loginUsuari } from './../services/comunicationManager';
import Checkbox from 'primevue/checkbox';
import { hashPassword } from '@/services/hasher';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

// Refs para campos y estado
const correu = ref(null);
const contrasenya = ref(null);
const loading = ref(false);
var visible = ref(false);
var session = ref(false);

const userStore = useLoggedUsers();
const router = useRouter();

onMounted(() => {
    if (localStorage.getItem("correu") && localStorage.getItem("contrasenya")) {
        correu.value = localStorage.getItem("correu");
        contrasenya.value = localStorage.getItem("contrasenya")
        login()
    }

})
const notifyLogin = (error) => {

    if(error=="error"){
        toast("Correu o contrasenya incorrectes", {
    autoClose: 1000,
    progressClassName: 'toast-progress',
    theme: 'light',
    type: 'error'
  }); // ToastOptions
    } else{
        if(error=="errorServer"){
            toast("Error al contectar al servidor", {
    autoClose: 1000,
    progressClassName: 'toast-progress',
    theme: 'light',
    type: 'error'
    }); // ToastOptions
            } else{
        toast("Inici de sessió exitós", {
    autoClose: 1000,
    progressClassName: 'toast-progress',
    theme: 'light',
    type: 'info'
  }); // ToastOptions
}
    }
 
}

async function login() {
    if (!correu.value || !contrasenya.value) {
        visible.value = true;
        return;
    }

    loading.value = true;
    try {
        const hashedPassword = await hashPassword(contrasenya.value); // Si utilizas hashing
        const result = await loginUsuari(correu.value, hashedPassword);
    
        if (result.state) {
            notifyLogin("info");
            if(session.value){
                localStorage.setItem("correu", correu.value);
                localStorage.setItem("contrasenya", hashedPassword)
            }
            if (result.associacionsId.length === 0) {
                router.push('/show');
            } else {
                router.push('/noticies');
            }
        } else {
            notifyLogin("error");
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        notifyLogin("errorServer");
    } finally {
        loading.value = false;
    }
}


</script>

<style scoped>
.screen-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    height: 100vh;
    padding: 10px;
    background-color: var(--main-color);
}

.card {
    padding: 10px;
    max-width: 400px;
    width: 100%;
    color: var(--accent-light-color);
}

.secondary-button {
    background-color: var(--secondary-light-color) !important;
    border-color: var(--secondary-light-color) !important;
    color: white !important;
}

.secondary-button:hover {
    filter: brightness(90%);
}
</style>
