<template>
  <aside class="w-64 h-screen bg-gray-800 text-white fixed left-0 top-0 flex flex-col p-6 space-y-4">
    <template v-for="item in navItems" :key="item.label">
      <RouterLink
        v-if="item.to"
        :to="item.to"
        class="flex items-center space-x-2 p-3 rounded-md hover:bg-yellow-400 hover:text-black"
        :class="{ 'bg-yellow-400 text-black': isActiveRoute(item.to) }"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span>{{ item.label }}</span>
      </RouterLink>

      <button
        v-else
        @click="handleLogout"
        class="flex items-center space-x-2 p-3 rounded-md hover:bg-yellow-400 hover:text-black"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span>{{ item.label }}</span>
      </button>
    </template>
  </aside>
</template>
  
  <script setup lang="ts">
import { useRoute } from 'vue-router'
import { useUsers } from '../modules/auth/useUsers' 
import { Home, ListTodo, StickyNote, User, LogOut } from 'lucide-vue-next'

const { logout } = useUsers(); 
const route = useRoute()

const navItems = [
  { label: 'My day', to: '/my-day', icon: Home },
  { label: 'To do list', to: '/to-do-list', icon: ListTodo },
  { label: 'Notes', to: '/notes', icon: StickyNote },
  { label: 'Log out', to: null, icon: LogOut }, 
]

const isActiveRoute = (path: string) => route.path === path

const handleLogout = () => {
  logout(); 
}
  </script>
  
  <style scoped>
  aside {
  width: 16rem;              
  height: 100vh;             
  background-color: #F4F3EB; 
  color: #000;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  padding:  5rem 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  position: fixed;
  z-index: 50;
}
button {
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.2rem 2rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s ease;
  color: black;
  font-size: 1.1rem;
}

.router-link-active,
.router-link-exact-active {
  background-color: #FAD809; 
  color: black;
}

a {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.2rem 2rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s ease;
  text-decoration: none;
  color: black;
  font-size: 1.1rem;
}

  </style>