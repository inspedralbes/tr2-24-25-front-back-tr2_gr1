<template>
    <div class="screen-container">
        <Card class="formCard">
            <template #title>Nova Associació</template>
            <template #content>
                <div class="card flex flex-wrap justify-center items-end gap-4">
                    <FloatLabel variant="in">
                        <label for="nom_label">Nom</label>
                        <InputText id="nom_label" v-model="nom" autocomplete="off"/>
                    </FloatLabel>
                </div>
                <div class="card flex flex-wrap justify-center items-end gap-4 ">
                    <FloatLabel variant="in">
                        <label for="desc_label">Descripció</label>
                        <InputText id="desc_label" v-model="desc" autocomplete="off"/>
                    </FloatLabel>
                </div>
                <div class="card flex flex-wrap justify-center items-end gap-4">
                    <Button class="create-btn" label="Crear" icon="pi pi-plus" iconPos="left" :loading="loading" @click="newAssociacio()"/>
                </div>
                <Dialog :visible="visible" modal header="Atenció" :style="{ width: '25rem' }" class="bg-white">
                    <span class="text-surface-500 dark:text-surface-400 block mb-8">Es requereix un Nom i una Descripció</span>
                    <div class="flex justify-end gap-2">
                        <Button type="button" icon="pi pi-check" label="Entesos" @click="visible = false" class="create-btn"></Button>
                    </div>
                </Dialog>
                <Dialog :visible="visible2" modal header="Perfecte!" :style="{ width: '25rem' }" class="bg-white">
                    <span class="text-surface-500 dark:text-surface-400 block mb-8">L'Associació s'ha creat correctament</span>
                    <div class="flex justify-end gap-2">
                        <Button type="button" icon="pi pi-check" label="Entesos" @click="redirectToNoticies" class="create-btn"></Button>
                    </div>
                </Dialog>
                <Dialog :visible="visible3" modal header="Error" :style="{ width: '25rem' }" class="bg-white">
                    <span class="text-surface-500 dark:text-surface-400 block mb-8">Hi ha hagut un error en crear l'Associació</span>
                    <div class="flex justify-end gap-2">
                        <Button type="button" icon="pi pi-check" label="Entesos" @click="visible3 = false" class="create-btn"></Button>
                    </div>
                </Dialog>
            </template>
        </Card>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Card from 'primevue/card';
import { crearAssociacio } from './../services/comunicationManager';
import { useRoute, useRouter } from 'vue-router';

const nom = ref(null);
const desc = ref(null);
const loading = ref(false);
var visible = ref(false);
var visible2 = ref(false);
var visible3 = ref(false);

const router = useRouter();

async function newAssociacio() {
    if (!nom.value || !desc.value) {
        visible.value = true;
        return;
    }
    loading.value = true;
    try {
        await crearAssociacio(nom.value, desc.value);
        visible2.value = true;
    } catch (error) {
        console.error('Error al crear associació:', error);
        visible3.value = true;
    } finally {
        loading.value = false;
    }
}

function redirectToNoticies() {
    visible2.value = false;
    router.push('/noticies');
}
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
    .screen-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 5px;
        height: 100vh;
        padding: 10px;
        background-color: #f8f9fa;
    }

    .card {
        padding: 10px; 
        max-width: 400px; 
        width: 100%; 
    }
    .create-btn{
        background-color: var(--secondary-light-color);
        color: var(--bold-color);
    }
</style>