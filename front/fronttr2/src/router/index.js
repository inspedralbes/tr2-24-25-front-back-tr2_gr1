import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NewAssociacio from '../views/NewAssociacioView.vue'
import Login from '@/components/Login.vue';

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
    }
  ],
});

export default router;
