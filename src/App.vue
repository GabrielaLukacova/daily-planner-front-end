<template>
  <div class="w-screen flex">
    <Sidebar />
    <WeekDays />
    <div class="flex-1 ml-64">
      <RouterView />
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

</style>
