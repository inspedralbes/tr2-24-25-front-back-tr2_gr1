<template>
    <div class="page-background bg-[--main-color]">
        <h2>Llistat d'Associacions</h2>
        <div v-if="associacions.length > 0">
            <Card v-for="associacio in associacions" :key="associacio.id" class="association-card"
                @click="goToNoticias(associacio.id)">
                <template #title>
                    <h2>{{ associacio.nom }}</h2>
                </template>
                <template #content>
                    <p>{{ associacio.descripcio }}</p>
                </template>
            </Card>
        </div>
        <p v-else>No hay asociaciones disponibles.</p>

        <Button label="Crear Associació" icon="pi pi-plus" @click="goToCreatePage" class="create-association-btn" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/users';
import Card from 'primevue/card';
import Button from 'primevue/button';
import { getAssociacions } from '@/services/comunicationManager';
import { asignaUsuariAssociacio } from '@/services/comunicationManager';

const router = useRouter();
const userStore = useUserStore();  // Acceder al store de usuarios
const associacions = ref([]);      // Lista de asociaciones

const fetchAssociations = async () => {
    try {
        const data = await getAssociacions();  // Obtener las asociaciones
        associacions.value = data;  // Asignar los datos a la variable
    } catch (error) {
        console.error('Error fetching associations:', error);
    }
};

const goToCreatePage = () => {
    router.push('/newAssociacio');  // Navegar a la página de crear asociación
};

const goToNoticias = async (idAsso) => {
    // Obtener el usuario logueado desde el store
    const loggedUser = userStore.getLoggedUser();  
    console.log('Usuario logueado:', loggedUser);  // Verifica el valor de loggedUser

    // Verificar si el usuario está logueado y tiene un ID válido
    if (!loggedUser || !loggedUser.id) {
        console.error('No hay usuario logueado o no tiene un ID.');
        return;
    }

    try {
        const data = await asignaUsuariAssociacio(loggedUser.id, idAsso);
        console.log('Usuario asignado a la asociación con éxito:', data);
        userStore.updateUserAssociations(idAsso);  // Actualiza las asociaciones en el store
        router.push('/noticies');  // Redirige a la página de noticias
    } catch (error) {
        console.error('Error asignando usuario a asociación:', error);
    }
};

onMounted(() => {
    fetchAssociations();
    if (!userStore.loggedUser || !userStore.associations.length) {
        console.log('No hay usuario logueado o no tiene asociaciones');
        // Manejar el caso donde no haya asociaciones
    } else {
        console.log('Usuario logueado:', userStore.loggedUser);
        console.log('Asociaciones:', userStore.associations);
    }
});
</script>

<style scoped>
:root {
    --main-color: #E6F8F8;
    --secondary-light-color: #57A2A2;
    --bold-color: #023333;
}

* {
    font-family: 'Arial', sans-serif;
    color: var(--main-color);
}

.page-background {
    background-color: var(--main-color);
    padding: 20px;
}

p {
    color: var(--bold-color);
    text-align: center;
}

h2 {
    color: var(--bold-color);
    text-align: center;
    margin-bottom: 1vh;
}

.association-card {
    background-color: var(--secondary-light-color);
    color: var(--bold-color);
    cursor: pointer;
    margin-bottom: 16px;
}

.association-card:hover {
    transform: scale(1.02);
}

.create-association-btn {
    display: block;
    margin: 20px auto;
    background-color: var(--secondary-light-color);
    color: var(--bold-color);
    border-radius: 8px;
    padding: 10px 20px;
    text-align: center;
}
</style>
