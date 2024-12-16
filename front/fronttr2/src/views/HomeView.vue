<template>
  <div class="screen-container">
    <div class="relative isolate px-6 pt-14 lg:px-8">
      <div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div class="text-center">
          <h1 class="text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
            Benvingut a Associa't
          </h1>
          <p class="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat.
          </p>
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <a href="#" class="custom-button" @click="router.push('/login')">
              Inicia Sessió
            </a>
            <a href="#" class="custom-button" @click="router.push('/register')">
              Registra't
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import router from '@/router';
</script>

<style scoped>
.screen-container {
  background-color: var(--main-color);
  height: 100vh;
  display: flex; 
  justify-content: center; 
  align-items: center; 
  padding: 1rem;
  box-sizing: border-box; 
}

.custom-button {
  background-color: var(--secondary-light-color) !important;
  border-color: var(--secondary-light-color) !important;
  color: white !important;
  padding: 0.625rem 1.5rem; 
  font-size: 0.875rem; 
  font-weight: 600; 
  border-radius: 0.375rem; 
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); 
  text-align: center;
  text-decoration: none; 
  display: inline-block;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.custom-button:hover {
  background-color: var(--secondary-color) !important;
  border-color: var(--secondary-color) !important;
}

.custom-button:focus-visible {
  outline: 2px solid var(--secondary-color) !important;
  outline-offset: 2px;
}
</style>
