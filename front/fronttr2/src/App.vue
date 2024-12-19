<script setup>
import { ref } from 'vue'
import 'primeicons/primeicons.css'
import Header from '@/components/Header.vue'
import { useUserStore } from '@/stores/users';
const color = ref(null)
import { onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { checkToken } from './services/comunicationManager';
import { useLoggedUsers } from "@/stores/users";
const router = useRouter()

const logRouteChange = async () => {
  if(router.currentRoute.value.fullPath!="/" && router.currentRoute.value.fullPath!="/register" && router.currentRoute.value.fullPath!="/login" && router.currentRoute.value.fullPath!="/loading"){
    console.log("entering"+router.currentRoute.value.fullPath )
    let response= await checkToken()
    console.log("et"+response)
    console.log(response.status)
    if(response.status!=200){
      const loggedUsersStore = useLoggedUsers();
      loggedUsersStore.emptyUser();
      router.push('/login')
    }
  }
 
}

onMounted(() => {
  router.afterEach(logRouteChange)
})

onBeforeUnmount(() => {
  router.afterEach(() => {})
})
</script>

<template>
  <div class="bg-[--main-color] h-max">
    <header>
      <!-- <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/newAssociacio">NewAssociacio</RouterLink>
      </nav>
    </div> -->
      <Header />
    </header>

    <RouterView />
  </div>


</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
