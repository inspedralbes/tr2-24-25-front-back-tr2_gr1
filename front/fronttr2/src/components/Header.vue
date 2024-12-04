<template>
    <Menubar :model="items" />
</template>

<script setup>
import router from '@/router';
import Menubar from 'primevue/menubar';
import 'primeicons/primeicons.css';
import { ref } from 'vue';

const items = ref([
    {
        label: 'Home',
        icon: 'pi pi-fw pi-home',
        command: () => router.push('/'),
    },
    {
        label: 'About',
        icon: 'pi pi-fw pi-info',
        command: () => router.push('/about'),
    },
    {
        label: 'Associacions',
        icon: 'pi pi-fw pi-users',
        command: () => router.push('/associations'),
    },
]);
</script>

<style scoped>
.p-menubar {
    background-color: var(--secondary-dark-color);
    color: var(--bold-color); /* Color del texto */
    border: none;
    width: 100%;
    border-radius: 0;
}

.p-menubar .p-menuitem-link {
    color: var(--bold-color); /* Color del texto en los items */
    font-weight: bold;
}

.p-menubar .p-menuitem-icon {
    color: var(--accent-light-color); /* Color del icono */
    font-size: 1.25rem; /* Tamaño adecuado para los iconos */
}

/* Cambiar el color al hacer hover */
.p-menubar .p-menuitem-link:hover .p-menuitem-icon {
    color: var(--main-color); /* Color del icono en hover */
}

.p-menubar .p-menuitem-link:hover {
    color: var(--secondary-light-color); /* Color del texto en hover */
}
</style>
