<template>
    <div class="page-background">
        <h2>Llistat d'Associacions</h2>
        <div v-if="associacions.length > 0">
            <Card v-for="associacio in associacions" :key="associacio.id" class="association-card">
                <template #title>{{ associacio.nom }}</template>
                <template #content>
                    <p>{{ associacio.descripcio }}</p>
                </template>
            </Card>
        </div>
        <p v-else>No hay asociaciones disponibles.</p>

        <!-- Botón para crear una nueva asociación -->
        <Button label="Crear Asociació" icon="pi pi-plus" @click="goToCreatePage" class="create-association-btn" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // Para la navegación
import Card from 'primevue/card';
import Button from 'primevue/button'; // Importa el componente Button

const router = useRouter(); // Usar el router de Vue para la navegación

const associacions = ref([]);

const fetchAssociations = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/associacio');
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        const data = await response.json();
        console.log("Datos obtenidos:", data);
        associacions.value = data; // Aquí se asigna directamente el arreglo
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
};

// Función para redirigir a la página de creación
const goToCreatePage = () => {
    router.push('/create');
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

h2 {
    color: var(--bold-color);
    text-align: center;
    margin-bottom: 2vh;
}

.association-card {
    background-color: var(--secondary-light-color);
    color: var(--bold-color);
    margin-bottom: 16px;
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
