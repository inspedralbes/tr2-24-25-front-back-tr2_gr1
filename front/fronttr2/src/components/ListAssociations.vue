<template>
    <div class="page-background bg-[--main-color]">
        <h2>Llistat d'Associacions</h2>
        <div v-if="associacions.length > 0">
            <Card v-for="associacio in associacions" :key="associacio.id" class="association-card" @click="goToNoticias(associacio.id)">
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
import { useLoggedUsers } from '@/stores/users';
import Card from 'primevue/card';
import Button from 'primevue/button';
import { getAssociacions } from '@/services/comunicationManager';

const router = useRouter();

const userStore = useLoggedUsers();

const associacions = ref([]);

const fetchAssociations = async () => {
    try {
        const data = await getAssociacions();
        associacions.value = data;
    } catch (error) {
        console.error('Error fetching associations:', error);
    }
};

const goToCreatePage = () => {
    router.push('/newAssociacio');
};

const goToNoticias = async (idAsso) => {
    const loggedUser = userStore.getLoggedUser();
    console.log('Usuario logueado:', loggedUser); // Verificar qué se está obteniendo

    if (!loggedUser || !loggedUser.id) {
        console.error('No hay usuario logueado.');
        return;
    }

    try {
        const response = await fetch('/asignaUsuariAssociacio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idUsu: loggedUser.id, idAsso }),
        });

        if (!response.ok) {
            throw new Error('Error al asignar usuario a la asociación.');
        }

        const data = await response.json();
        console.log('Usuario asignado a la asociación con éxito:', data);

        // Actualizar Pinia con la nueva asociación del usuario
        userStore.updateUserAssociations(idAsso);

        // Navegar a la página de noticias
        router.push('/noticies');
    } catch (error) {
        console.error('Error asignando usuario a asociación:', error);
    }
};

onMounted(() => {
    fetchAssociations();
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
