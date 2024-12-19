<template>
    <div class="screen-container">
        <div class="h-screen flex flex-wrap items-center justify-center">
            <div class="container lg:w-2/6 xl:w-2/7 sm:w-full md:w-2/3 bg-white shadow-lg transform duration-200 ease-in-out p-6">
                <div class="flex justify-center -mt-16">
                    <img
                        class="h-32 w-32 bg-white p-2 rounded-full border-2 border-gray-200"
                        :src="imatge"
                        alt="Profile Picture"
                    />
                </div>
                <div class="text-center mt-6 px-4">
                    <h2 class="text-gray-800 text-3xl font-bold">{{ user.nom }} {{ user.cognoms }}</h2>
                    <a
                        class="text-gray-400 mt-2 hover:text-blue-500 block text-sm"
                        :href="'mailto:' + user.correu"
                        >{{ user.correu }}</a
                    >
                    <p class="mt-4 text-gray-700 text-base font-semibold">Formo part de:</p>
                </div>
                <div class="mt-4 grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-2">
                    <template v-if="associacions.length > 0">
                        <Card
                            v-for="associacio in associacions"
                            :key="associacio.id"
                            class="association-card p-4"
                        >
                            <template #title>
                                <h2 class="font-bold text-lg text-white">{{ associacio.nom }}</h2>
                            </template>
                            <template #content>
                                <p class="text-sm text-white">{{ associacio.descripcio }}</p>
                            </template>
                        </Card>
                    </template>
                    <template v-else>
                        <p class="text-center text-gray-500">Encara no formes part de cap associació</p>
                    </template>
                </div>
                <div class="flex justify-center mt-4">
                    <Button class="secondary-button" label="Editar Perfil" @click="visible = true" />
                </div>
                <Dialog :visible="visible" modal header="Edit Profile" :style="{ width: '25rem' }">
                    <span class="text-surface-500 dark:text-surface-400 block mb-8">Edita el teu perfil.</span>
                    <div class="flex items-center gap-4 mb-4">
                        <label for="username" class="font-semibold w-24">Nom</label>
                        <InputText id="username" v-model="user.nom" class="flex-auto" autocomplete="off" />
                    </div>
                    <div class="flex items-center gap-4 mb-4">
                        <label for="username" class="font-semibold w-24">Cognoms</label>
                        <InputText id="username" v-model="user.cognoms" class="flex-auto" autocomplete="off" />
                    </div>
                    <div class="flex items-center gap-4 mb-8">
                        <label for="email" class="font-semibold w-24">Correu</label>
                        <InputText id="email" v-model="user.correu" class="flex-auto" autocomplete="off" />
                    </div>
                    <div class="flex justify-end gap-2">
                        <Button type="button" label="Cancel·lar" severity="secondary" @click="visible = false"></Button>
                        <Button class="secondary-button" type="button" label="Guardar" @click="saveProfile"></Button>
                    </div>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useLoggedUsers } from '@/stores/users';
import { getAssociacions, updateUsuari } from '@/services/comunicationManager';
import { Card } from 'primevue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';

const userStore = useLoggedUsers();

const imatge = ref('https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541');

const user = ref(userStore.currentUser);

const associacions = ref([]);

const visible = ref(false);

const fetchAssociations = async () => {
    try {
        const data = await getAssociacions();
        associacions.value = data.filter((associacio) =>
            user.value.associacionsId.includes(associacio.id)
        );
    } catch (error) {
        console.error('Error fetching associations: ', error);
    }
};

const saveProfile = async () => {
    userStore.newUser(user);
    console.log("Actalitzant Usuari: ", user.value);
    await updateUsuari(user.value.id, user.value.nom, user.value.cognoms, user.value.contrasenya, user.value.correu, user.value.imatge, user.value.permisos, user.value.token);
    visible.value = false;
    console.log('Profile updated');
};

onMounted(() => {
    fetchAssociations();
});
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

.container {
    max-width: 100%;
    border-radius: 12px;
}

.association-card {
    background-color: var(--secondary-light-color);
    color: var(--bold-color);
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.secondary-button {
    background-color: var(--secondary-light-color) !important;
    border-color: var(--secondary-light-color) !important;
    color: white !important;
}
</style>
