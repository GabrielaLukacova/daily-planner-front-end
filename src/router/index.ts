import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthView.vue'),
    },
    {
      path: '/',
      redirect: '/auth' 
    },
    {
      path: '/my-day',
      name: 'my-day',
      component: () => import('../views/MyDay.vue'),
    },
    {
      path: '/to-do-list',
      name: 'to-do-list',
      component: () => import('../views/ToDoList.vue'),
    },
    {
      path: '/notes',
      name: 'notes',
      component: () => import('../views/Notes.vue'),
    },
    {
      path: '/user-profile',
      name: 'user-profile',
      component: () => import('../views/UserProfile.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('lsToken')
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !isAuthenticated) {
    next('/auth')
  } else {
    next()
  }
})

export default router
