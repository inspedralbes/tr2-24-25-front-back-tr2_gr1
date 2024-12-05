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
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Card from 'primevue/card';

const associacions = ref([]);

const fetchAssociations = async () => {
    try {
        const response = await fetch('/endpoints/associacio-READ.json');
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        const data = await response.json();
        associacions.value = data.response.body;
        console.log(associacions.value);
    } catch (error) {
        console.error('Error en la solicitud:', error);
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

h2 {
    color: var(--bold-color);
}

.association-card {
    background-color: var(--secondary-light-color);
    color: var(--bold-color);
    margin-bottom: 16px;
}

/* Estilos para las Cards */
.mb-4 {
    margin-bottom: 16px;
}
</style>
