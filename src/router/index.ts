// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      name: 'contacts',
      component: () => import('@/views/ContactsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/contacts/:id',
      name: 'contact-detail',
      component: () => import('@/views/ContactDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/contacts/:id/edit',
      name: 'contact-edit',
      component: () => import('@/views/ContactEditView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/contacts/new',
      name: 'contact-new',
      component: () => import('@/views/ContactNewView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router