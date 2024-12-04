<template>
    <div>
        <div class="card flex flex-wrap justify-center items-end gap-4">
            <FloatLabel variant="in">
                <label for="nom_label">Nom</label>
                <InputText id="nom_label" :invalid="!nom" v-model="nom" autocomplete="off"/>
            </FloatLabel>
        </div>
        <div class="card flex flex-wrap justify-center items-end gap-4">
            <FloatLabel variant="in">
                <label for="desc_label">Descripció</label>
                <InputText id="desc_label" :invalid="!desc" v-model="desc" autocomplete="off"/>
            </FloatLabel>
        </div>
        <div class="card flex flex-wrap justify-center items-end gap-4">
            <Button label="Crear" icon="pi pi-check" iconPos="left" severity="success"/>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Button from 'primevue/button';


const nom = ref(null);
const desc = ref(null);

</script>


<style scoped>
    .card {
        padding: 10px;
    }
</style>