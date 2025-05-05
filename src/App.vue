<template class="w-screen">
  <header class="text-white py-4">
    <div class="wrapper" >
      <nav class="sidebar">
        <RouterLink to="my-day" class="mr-4">My day</RouterLink>
        <RouterLink to="/to-do-list" class="mr-4">To do list</RouterLink>
        <RouterLink to="/notes" class="mr-4">Notes</RouterLink>
        <RouterLink to="/user-profile" class="mr-4">My profile</RouterLink>
        <RouterLink to="auth" class="mr-4">Log out</RouterLink>
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useUsers } from './modules/auth/useUsers'
import { state } from './modules/globalStates/state'

import { ref } from 'vue'


const { logout } = useUsers()

const isLoggedIn = computed(() => state.isLoggedIn)

</script>


<style scoped>

</style>
