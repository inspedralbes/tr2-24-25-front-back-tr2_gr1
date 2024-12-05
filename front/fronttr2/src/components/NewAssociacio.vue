<template>
    <div class="screen-container">
        <Card>
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
                    <Button label="Crear" icon="pi pi-check" iconPos="left" severity="success" :loading="loading" @click="newAssociacio()"/>
                </div>
                <Dialog :visible="visible" modal header="Alerta" :style="{ width: '25rem' }" class="bg-white">
                    <span class="text-surface-500 dark:text-surface-400 block mb-8">Es requereix un Nom i una Descripció</span>
                    <div class="flex justify-end gap-2">
                        <Button type="button" label="Entesos" @click="visible = false" severity="success"></Button>
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

const nom = ref(null);
const desc = ref(null);
const loading = ref(false);
var visible = ref(false);

async function newAssociacio() {
    if (!nom.value || !desc.value) {
        visible.value = true;
        return;
    }
    loading.value = true;
    try {
        console.log('Nova Associació:', { nom: nom.value, desc: desc.value });
        await crearAssociacio(nom.value, desc.value);
        alert('Associació creada amb èxit!');
    } catch (error) {
        console.error('Error al crear associació:', error);
        alert('Hi ha hagut un error en crear la associació.');
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
        background-color: #f8f9fa;
    }

    .card {
        padding: 10px; 
        max-width: 400px; 
        width: 100%; 
    }
</style>