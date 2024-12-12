<template>
    <main>
        <div class="pb-16 main">
            <div class="grid">
                <Card style="width: 100%; overflow: hidden" v-for="noticia in noticies" class="cardNew"
                    :key="noticia.id" @click="router.push({ path: `/noticies/${noticia.id}` })">
                    <template #header>
                        <img alt="user header" class="banner"
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlYTylxm7BIjHX7C0QOwEA7iEVEheDE65ukQ&s" />
                    </template>
                    <template #title>
                        <div class="title">{{ noticia.titol }}</div>
                    </template>
                    <template #subtitle>
                        <div class="subtitle">{{ noticia.subtitol }}</div>
                    </template>
                    <template #footer>
                        <div class="flex gap-4 mt-1 footer">
                            Per {{ noticia.autor }} el {{ noticia.updatedAt }}
                        </div>
                    </template>
                </Card>

            </div>
        </div>

        <footer>
            <NavigationBar />
        </footer>
    </main>
</template>

<script setup>
import router from '@/router';
import Card from 'primevue/card';

import NavigationBar from '@/components/NavigationBar.vue';
import { ref, onMounted } from 'vue'
import noticiesSample from '../assets/noticiesSample.json'

const noticies = ref([])
onMounted(() => {
    console.log('Component is mounted')
    //getNoticies()
    noticies.value = noticiesSample;

})

function redirectoToSinglePost(id) {
    console.log('Redirecting to post with id: ', id)

}
</script>
<style scoped>
.main {
    background-color: var(--main-color);
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
</style>