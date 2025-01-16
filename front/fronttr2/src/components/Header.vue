<template>
    <div class="menubar-wrapper relative top-0 left-0 w-full h-full">
        <div class="associacions-text">Associacions</div>
        <Menubar :model="items" class="p-menubar bg-secondary-dark text-secondary-light border-none p-2" />
    </div>
</template>

<script setup>
import router from '@/router';
import Menubar from 'primevue/menubar';
import 'primeicons/primeicons.css';
import { ref } from 'vue';

const items = ref([
    {
        label: 'Principal',
        icon: 'pi pi-fw pi-home',
        command: () => router.push('/'),
    },
    {
        label: 'Perfil',
        icon: 'pi pi-pw pi-id-card',
        command: () => router.push('/perfil'),
    },
    {
        label: 'Associacions',
        icon: 'pi pi-fw pi-users',
        command: () => router.push('/show'),
    },
]);
</script>

<style scoped>
.menubar-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--secondary-dark-color) !important;
    padding: 0 1rem;
    border-radius: 0;
    width: 100%;
    height: 100%;
}

.associacions-text {
    font-weight: bold;
    color: var(--main-color) !important;
    font-size: 1.1rem;
    margin-right: auto;
}

.p-menubar {
    border: none !important;
    background-color: var(--secondary-dark-color) !important;
}

.p-menubar .p-menuitem-link {
    color: var(--secondary-light-color) !important;
    font-weight: bold;
}

.p-menubar .p-menuitem-icon {
    color: var(--secondary-light-color) !important;
    font-size: 1.25rem;
}

.p-menubar .p-menuitem-link:hover .p-menuitem-icon {
    color: var(--main-color) !important;
}

.p-menubar .p-menuitem-link:hover {
    color: var(--main-color) !important;
}
</style>
