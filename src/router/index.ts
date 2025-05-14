import { createRouter, createWebHistory } from 'vue-router';
import { state } from '../modules/globalStates/state';

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
      redirect: '/auth',
    },
    {
      path: '/my-day',
      name: 'my-day',
      component: () => import('../views/MyDay.vue'),
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/to-do-list',
      name: 'to-do-list',
      component: () => import('../views/ToDoList.vue'),
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/notes',
      name: 'notes',
      component: () => import('../views/Notes.vue'),
      meta: {
        requiresAuth: true,
      }
    },
  ],
});

// Global guard for protected routes
router.beforeEach((to, from, next) => {
  const isLoggedIn = state.isLoggedIn;
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !isLoggedIn) {
    next({ name: 'auth' });
  } else {
    next();
  }
});

export default router;
