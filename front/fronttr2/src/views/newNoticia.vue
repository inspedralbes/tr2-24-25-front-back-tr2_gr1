<template>
    <div class="screen-container">
        <Card>
            <template #title>Nova Noticia</template>
            <template #content>
                <div class="card flex flex-wrap justify-center items-end gap-4">
                    <FloatLabel variant="in">
                        <label for="titol_label">Títol</label>
                        <InputText id="titol_label" v-model="titol" autocomplete="off" />
                    </FloatLabel>
                </div>

                <div class="card flex flex-wrap justify-center items-end gap-4">
                    <FloatLabel variant="in">
                        <label for="subtitol_label">Subtítol</label>
                        <InputText id="subtitol_label" v-model="subtitol" autocomplete="off" />
                    </FloatLabel>
                </div>

                <div class="card flex flex-wrap justify-center items-end gap-4">
                    <FloatLabel variant="in">
                        <label for="contingut_label">Contingut</label>
                        <InputText id="contingut_label" v-model="contingut" autocomplete="off" />
                    </FloatLabel>
                </div>

                <!-- Botón de crear noticia -->
                <div class="card flex flex-wrap justify-center items-end gap-4">
                    <Button class="button secondary-button" label="Crear" icon="pi pi-plus" iconPos="left"
                        :loading="loading" @click="newNoticia" />
                </div>

                <!-- Diálogo de atención en caso de error de campos -->
                <Dialog :visible="visible" modal header="Atenció" :style="{ width: '25rem' }" class="bg-white">
                    <span class="text-surface-500 dark:text-surface-400 block mb-8">Es requereixen tots els camps
                        obligatoris</span>
                    <div class="flex justify-end gap-2">
                        <Button class="button secondary-button" type="button" label="Entesos"
                            @click="visible = false" />
                    </div>
                </Dialog>

                <!-- Diálogo de éxito -->
                <Dialog :visible="visible2" modal header="Perfecte!" :style="{ width: '25rem' }" class="bg-white">
                    <span class="text-surface-500 dark:text-surface-400 block mb-8">La noticia s'ha creat
                        correctament</span>
                    <div class="flex justify-end gap-2">
                        <Button class="button secondary-button" type="button" label="Entesos"
                            @click="visible2 = false" />
                    </div>
                </Dialog>

                <!-- Diálogo de error -->
                <Dialog :visible="visible3" modal header="Error" :style="{ width: '25rem' }" class="bg-white">
                    <span class="text-surface-500 dark:text-surface-400 block mb-8">Hi ha hagut un error en crear la
                        noticia</span>
                    <div class="flex justify-end gap-2">
                        <Button class="button secondary-button" type="button" label="Entesos"
                            @click="visible3 = false" />
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
import { createNoticia } from '@/services/comunicationManager';
import ColorPicker from 'primevue/colorpicker';
import { useRouter } from 'vue-router';
import { useLoggedUsers } from '@/stores/users';

const router = useRouter();

const titol = ref(null);
const subtitol = ref(null);
const contingut = ref(null);
const color = ref('#FFFFFF');
const loading = ref(false);
let visible = ref(false);
let visible2 = ref(false);
let visible3 = ref(false);

const userStore = useLoggedUsers();
const userId = userStore.currentUser.id;
const currentAssociacio = userStore.currentUser.currentAssiciacio;

function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function selectImage() {
    document.getElementById('image_label').click();
}

async function newNoticia() {
    if (!titol.value || !subtitol.value || !contingut.value) {
        visible.value = true;
        return;
    }

    loading.value = true;
    try {
        const currentDate = formatDate(new Date());


        await createNoticia({
            titol: titol.value,
            subtitol: subtitol.value,
            contingut: contingut.value,
            // imatge: '', // Aquí puedes asignar el valor correspondiente para la imagen
            autor: userId,
            idAsso: currentAssociacio
        });

        visible2.value = true;

        router.push({ path: '/noticies' });
    } catch (error) {
        console.error('Error al crear noticia:', error);
        visible3.value = true;
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

.create-btn {
    background-color: var(--secondary-light-color);
    color: white !important;
}

.create-btn:hover {
    filter: brightness(90%);
}

.file-input {
    display: none;
}
</style>