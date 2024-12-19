import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NewAssociacio from '../views/NewAssociacioView.vue'
import Login from '@/components/Login.vue';
import bcrypt from "bcryptjs";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/newAssociacio',
      name: 'newAssociacio',
      component: NewAssociacio
    },
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView,
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/show',
      name: 'show',
      component: () => import('../views/ShowAssociations.vue'),
    },
    {
      path: '/noticies',
      name: 'noticies',
      component: () => import('../views/NoticiesView.vue'),
    },
    {
      path: '/noticies/:id',
      name: 'NotciaDetall',
      component:  () => import('../views/NotciaDetall.vue'),
      props: true 
    },
    {
      path: '/xat',
      name: 'xat',
      component: () => import('../views/XatView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }, 
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'), 
    },
    {
      path: '/calendari',
      name: 'calendari',
      component: () => import('../views/Calendar.vue')
    },
    {
      path: '/loading',
      name: 'loading',
      component: () => import('../views/LoadingView.vue')
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: () => import('../views/PerfilView.vue')
    },
    {
      path: '/propostes',
      name: 'propostes',
      component: () => import('../views/PropostesView.vue'),
    },
    {
      path: '/propostes/:id',
      name: 'PropostaDetall',
      component:  () => import('../views/PropostaDetall.vue'),
      props: true 
    },
    {
      path: '/propostes/add',
      name: 'AfegirProposta',
      component:  () => import('../views/NewActivity.vue'),
    }
  ],
});

export default router;
