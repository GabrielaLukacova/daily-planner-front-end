<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <div v-if="route.name !== 'auth'" class="w-64 flex-shrink-0">
      <Sidebar />
    </div>

    <!-- Main content -->
    <div class="flex-1 flex flex-col">
      <WeekDays
        v-if="route.name !== 'auth'"
        class="border-b border-gray-300 p-4"
        @day-selected="selectedDate = $event"
      />
      <main class="flex-1 p-6 overflow-auto">
        <RouterView :selectedDate="selectedDate" />
      </main>
    </div>
       
    <!-- Footer -->
<div v-if="route.name !== 'auth'">
  <Footer />
</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import Footer from '@/components/Footer.vue'
import WeekDays from '@/components/WeekDays.vue'
import { useUsers } from './modules/auth/useUsers'
import { state } from './modules/globalStates/state'


const { logout } = useUsers()
const route = useRoute()

const isLoggedIn = computed(() => state.isLoggedIn)
const selectedDate = ref(new Date())
</script>

<style scoped>
.content-wrapper {
  margin-left: 16rem;
  padding: 2rem;
}
</style>
