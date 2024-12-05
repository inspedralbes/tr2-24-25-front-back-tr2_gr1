<template>
<div class="fixed bottom-0 left-0 z-50 w-full h-16 backgroundLight border-t border-gray-200 dark:backgroundDark dark:border-gray-600">
    <div class="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">

        <button type="button" class="inline-flex flex-col items-center justify-center px-5 bg-CustomMain  dark:hover:bg-CustomMain group" @click="this.$router.push({ path: '/noticies' }); ">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="var(--main-color)" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
</svg>

            <span class="text-sm textN dark:textDark group-hover:textNHover dark:group-hover:textDarkHover">Noticies</span>
        </button>
      
        <button type="button" class="inline-flex flex-col items-center justify-center px-5 hover:bg-ReallyDark dark:hover:bg-ReallyDark group" @click="this.$router.push({ path: '/propostes' }); ">
            <i class="pi pi-users" style="font-size: 1.5rem;"></i>
            <span class="text-sm textN dark:textDark group-hover:textNHover dark:group-hover:textDarkHover">Propostes</span>
        </button>
        <button type="button" class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group" @click="this.$router.push({ path: '/xat' }); ">
            <i class="pi pi-comments" style="font-size: 1.5rem;"></i>
            <span class="text-sm textN dark:textDark group-hover:textNHover dark:group-hover:textDarkHover">Xat</span>
        </button>
        <button type="button" class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group" @click="this.$router.push({ path: '/calendari' }); ">
            <i class="pi pi-calendar" style="font-size: 1.5rem'"></i>
            <span class="text-sm textN dark:textDark group-hover:textNHover dark:group-hover:textDarkHover">Calendari</span>
        </button>
    </div>
</div>
</template>
<script setup>
import { ref } from 'vue';

</script>
<style scoped>
/* Clases personalizadas */
i {
    font-size: 1.5rem;
    color: var(--main-color);
}
.textN {
    --tw-text-opacity: 1;
    color: var(--main-color, 1);
}
.textDark {
    --tw-text-opacity: 1;
    color: var(--main-color, 1);
}
.textNHover {
    --tw-text-opacity: 1;
    color: var(--secondary-dark-color, 1);
}
.textDarkHover {
    --tw-text-opacity: 1;
    color: var(--secondary-light-color, 1);
}
.backgroundLight {
    --tw-bg-opacity: 1;
    background-color: var(--secondary-dark-color, 1);
}
.backgroundDark {
    --tw-bg-opacity: 1;
    background-color: var(--secondary-light-color, 1);
}
.backgroundLightHover:hover {
    --tw-bg-opacity: 1;
    background-color: var(--secondary-dark-color, 1);
}
.hover\:backgroundDarkHover:hover {
    --tw-bg-opacity: 1;
    background-color: var(--secondary-light-color, 1);
}
</style>
