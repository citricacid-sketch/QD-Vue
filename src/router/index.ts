import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/ai',
      name: 'ai',
      component: () => import('../views/AIView.vue'),
    },
    {
      path: '/dest',
      name: 'dest',
      component: () => import('../views/DestView.vue'),
    },
    {
      path: '/trip',
      name: 'trip',
      component: () => import('../views/TripView.vue'),
    },
    {
      path: '/trip/:id',
      name: 'trip-detail',
      component: () => import('../views/TripDetailView.vue'),
    },
    {
      path: '/policy',
      name: 'policy',
      component: () => import('../views/PolicyView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthView.vue'),
    },
    // 404页面
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
