<template>
  <main>
    <div class="pb-16 main">
      <div class="grid">
        <Card 
          style="width: 100%; overflow: hidden" 
          v-for="proposta in propostes" 
          class="cardNew" 
          :key="proposta.id" 
          @click="goToProposta(proposta.id)"
        >
          <template #title>
            <div class="title">{{ proposta.titol }}</div>
          </template>
          <template #subtitle>
            <div class="subtitle">{{ proposta.subtitol }}</div>
          </template>
          <template #footer>
            <div class="flex gap-4 mt-1 footer">
              Per {{ proposta.autor.nomUsuari }} el {{ proposta.data }}
            </div>
          </template>
        </Card>
      </div>

      <!-- Botón para redirigir a la pantalla de creación de propuesta -->
      <div class="create-button-container">
        <Button 
          label="Crear Nueva Proposta" 
          icon="pi pi-plus" 
          @click="goToCreateProposta" 
          class="create-button" 
        />
      </div>
    </div>
  
    <footer>
      <NavigationBar />
    </footer>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getPropostes } from '@/services/comunicationManager.js';
import router from '@/router';
import Card from 'primevue/card';
import NavigationBar from '@/components/NavigationBar.vue';
import Button from 'primevue/button';

const propostes = ref([]);

const goToProposta = (id) => {
  router.push({ path: `/propostes/${id}` });
};

// Redirige a la página para crear una nueva propuesta
const goToCreateProposta = () => {
  router.push({ path: '/propostes/add' });
};

onMounted(async () => {
  try {
    console.log('Fetching data from backend...');
    propostes.value = await getPropostes();
  } catch (error) {
    console.error('Error fetching proposals:', error);
  }
});
</script>

<style scoped>
.main {
  background-color: var(--main-color);
  min-height: calc(100vh - 4rem);
  padding-bottom: 4rem;
  display: flex;
  flex-direction: column;
}

.footer {
  text-align: center;
  padding: 1rem 0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
  margin: 1% auto 16%;
  width: 100%;
}

@media screen and (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (min-width: 1024px) {
  .grid {
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