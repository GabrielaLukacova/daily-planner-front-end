<template>
  <div>

      <!-- Login / Logout section -->
      <div>
        <p>Login / Logout</p>
        <input type="text" placeholder="Email" v-model="email" />
        <input type="password" placeholder="Password" v-model="password" />
        <button @click="fetchToken(email, password)">Login</button>
        <button @click="logout()">Logout</button>
      </div>

      <!-- Registration section -->
      <div>
        <p @click="toggleRegisterDialog">Click to register</p>
        <dialog ref="registerDialog">
          <form>
            <input type="text" placeholder="Name" v-model="name" />
            <input type="text" placeholder="Email" v-model="email" />
            <input type="password" placeholder="Password" v-model="password" />
            <button @click.prevent="registerUser(name, email, password)">Register</button>
          </form>
          <button @click="toggleRegisterDialog">Close</button>
        </dialog>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUsers } from '../modules/auth/useUsers'

// Get user state and actions from composable
const { fetchToken, registerUser, logout, name, email, password } = useUsers()

// Reference to the HTML dialog element
const registerDialog = ref<HTMLDialogElement | null>(null)

// Toggle dialog open/close
const toggleRegisterDialog = () => {
  if (!registerDialog.value) return
  registerDialog.value.open ? registerDialog.value.close() : registerDialog.value.show()
}
</script>




<style scoped>

</style>
