<template>
    <main>
        <TheWelcome/>
        <!-- <div v-for=""></div> -->
    </main>
    
    <footer>
      <NavigationBar />
    </footer>
  </template>
  
  <script setup>
  import HelloWorld from '@/components/HelloWorld.vue';
import Header from '../components/Header.vue'
  import TheWelcome from '../components/TheWelcome.vue'
  import NavigationBar from '@/components/NavigationBar.vue';
  import { ref, onMounted } from 'vue'

    const noticies = ref([])
    onMounted(() => {
        console.log('Component is mounted')
        //getNoticies()
        noticies="asd";

    })
  </script>