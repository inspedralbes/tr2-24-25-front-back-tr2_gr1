<script setup>
import { ref } from 'vue'
import 'primeicons/primeicons.css'
import Header from '@/components/Header.vue'
// import { useUserStore } from '@/stores/users';
const color = ref(null)
import { onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { checkToken } from './services/comunicationManager';
import { useLoggedUsers } from "@/stores/users";
import { getServiceStatus } from './services/comunicationManager';
const router = useRouter()
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const notify = () => {
  toast("Servei en manteniment", {
    autoClose: 1000,
    progressClassName: 'toast-progress',
    theme: 'light',
    type: 'error'
  }); // ToastOptions
}

const logRouteChange = async () => {
  if (router.currentRoute.value.fullPath != "/" && router.currentRoute.value.fullPath != "/register" && router.currentRoute.value.fullPath != "/login" && router.currentRoute.value.fullPath != "/loading") {
    let response = await checkToken()
    if (response.status != 200) {
      const loggedUsersStore = useLoggedUsers();
      loggedUsersStore.emptyUser();
      router.push('/login')
    }
  }

}

const checkServiceStatus = async (to,from ,next) => {
  const service = to.path.includes('/xat') ? 'chat' :
                  to.path.includes('/noticies') && (!from.path.includes('/login')&&!from.path.includes('/register')) ? 'news' :
                  to.path.includes('/propostes') || to.path.includes('/calendar') ? 'activity' : null;

  if (!service) {
    next(true);
    return;
  }

  const status = await getServiceStatus(service);
    if (status.status === "tancat") {
      toast.error('Servei en manteniment');
      next(false); 
      notify();
    } else {
      next(true);
    }
  
  next(false)
}

onMounted(() => {
  router.beforeEach(checkServiceStatus)
  router.afterEach(logRouteChange)
})

onBeforeUnmount(() => {
  router.afterEach(() => { })
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
.toast-progress {
  background-color: #ff2d55;
  
}
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
