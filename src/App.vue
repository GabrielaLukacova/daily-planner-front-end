<template>
  <div class="flex min-h-screen"> 
    <!-- Sidebar on the left -->
    <div class="w-64 flex-shrink-0">
      <Sidebar />
    </div>

    <!-- Main content on the right -->
    <div class="flex-1 flex flex-col">
      <WeekDays class="border-b border-gray-300 p-4" />
      <main class="flex-1 p-6 overflow-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useUsers } from './modules/auth/useUsers'
import { state } from './modules/globalStates/state'
import { ref } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import WeekDays from '@/components/WeekDays.vue'
import { format, startOfWeek, addDays, subWeeks, addWeeks, isSameDay } from 'date-fns'




const { logout } = useUsers()

const isLoggedIn = computed(() => state.isLoggedIn)

</script>


<style scoped>
.content-wrapper {
  margin-left: 16rem; 
  padding: 2rem;      
}
</style>
