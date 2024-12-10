<template>
    <div class="main">
      <h1>{{ noticia.titol }}</h1>
      <h3>{{ noticia.subtitol }}</h3>
      <img :src="noticia.imatge" alt="Imatge de la noticia" />
      <p>{{ noticia.contingut }}</p>
      <p class="author">Per {{ noticia.autor }} el {{ noticia.updatedAt }}</p>
    </div>
      <NavigationBar />
  </template>
  
  <script setup>
import { ref, onMounted } from 'vue';
import noticiesSample from '../assets/noticiesSample.json'
import NavigationBar from '@/components/NavigationBar.vue';

    const props = defineProps(['id']);
    const noticia=ref({});
    onMounted(() => {
        console.log('Component is mounted')
        //getNoticies()
        noticia.value=noticiesSample.find(noticia => noticia.id == props.id);

    })
  
  </script>
  
  <style scoped>
    .main {
      background-color: var(--main-color);
      padding: 1rem;
      height: 100vh;
      width: 100%;
      box-sizing: border-box;
      margin: 0;
    }

    h1 {
      color: var(--secondary-dark-color);
      font-size: 2rem;
    }

    h3{
      color: var(--secondary-light-color);
      font-size: 1.5rem;
    }
    p {
      color: var(--bold-color);
      font-size: 1.2rem;
    }
    .author{
      font-size: 0.75rem;
    }
    img{
      display: block;
      margin: 0 auto;
      width: 50%;
    }
</style>