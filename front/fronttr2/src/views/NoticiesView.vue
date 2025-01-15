<template>
    <main>
        <div class="bg-[--main-color] mx-6 my-6 main">
            <div class="grid">
                <Card style="width: 100%; overflow: hidden" v-for="noticia in noticies" class="cardNew"
                    :key="noticia.id" @click="router.push({ path: `/noticies/${noticia.id}` })">
                    <template #title>
                        <div class="title">{{ noticia.titol }}</div>
                    </template>
                    <template #subtitle>
                        <div class="subtitle">{{ noticia.subtitol }}</div>
                    </template>
                    <template #footer>
                        <div class="flex gap-4 mt-1 footer">
                            Esscrita per: {{ noticia.autor }}
                        </div>
                    </template>
                </Card>
            </div>
            <div class="create-button-container">
                <button @click="goToCreateNoticia" class="create-button">Crear Nova Notícia</button>
            </div>
        </div>

        <footer>
            <NavigationBar />
        </footer>
    </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import router from '@/router';
import Card from 'primevue/card';
import NavigationBar from '@/components/NavigationBar.vue';
import { getNoticies } from '@/services/comunicationManager';

const noticies = ref([]);

onMounted(async () => {
    try {
        noticies.value = await getNoticies();
    } catch (error) {
        console.error('Error al obtenir les notícies:', error);
    }
});

const goToCreateNoticia = () => {
  router.push({ path: '/noticies/add' });
};

</script>

<style scoped>
.main {
    /* background-color: var(--main-color); */
    padding: 1rem;
    padding-bottom: 8rem;
    width: 100%;
    box-sizing: border-box;
    margin: 0;
    height: calc(100vh - 4rem);
    overflow-y: auto;
}

.grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 1rem;
    margin-bottom: 16%;
    margin-top: 1%;
    width: 100%;

    @media screen and (min-width: 640px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media screen and (min-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
    }
}

.cardNew {
    width: 100%;
    height: 100%;
    margin-left: auto;
    margin-right: auto;
    background-color: var(--accent-light-color);
}

.banner {
    height: 12rem;
    width: 100%;
    object-fit: cover;
}

.title {
    font-size: 1.5rem;
    color: var(--accent-dark-color);
}

.subtitle {
    font-size: 1rem;
    color: var(--secondary-dark-color);
}

.footer {
    font-size: 0.8rem;
    color: var(--accent-dark-color);
}

.create-button-container {
  text-align: center;
  margin-top: 2rem;
}

.create-button {
  background-color: var(--secondary-light-color);
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
}

.create-button:hover {
  background-color: var(--secondary-dark-color);
}
</style>
