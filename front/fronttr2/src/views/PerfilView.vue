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
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useLoggedUsers } from '@/stores/users';
import { getAssociacions } from '@/services/comunicationManager';
import { Card } from 'primevue';

const userStore = useLoggedUsers();

const imatge = ref('https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541');

const user = ref(userStore.currentUser);

const associacions = ref([]);

const fetchAssociations = async () => {
    try {
        const data = await getAssociacions();
        associacions.value = data.filter((associacio) =>
            user.value.associacionsId.includes(associacio.id)
        );
    } catch (error) {
        console.error('Error fetching associations:', error);
    }
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
</style>
