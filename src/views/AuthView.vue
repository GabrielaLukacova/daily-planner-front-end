<template>
  <div class="auth-wrapper">
    <img src="@/media/planit_app_logo.jpeg" alt="App Logo" class="auth-logo" />
    <div :class="['auth-container', isSignup ? 'signup-mode' : '']">
      <!-- Left Box (Login) -->
      <div class="form-box left-box">
        <div v-if="!isSignup" class="form-content">
          <h2>Login</h2>
          <input type="text" placeholder="Email" v-model="email" />
          <input type="password" placeholder="Password" v-model="password" />
          <button @click="handleLogin">Login</button>
          <p v-if="loginError" class="error-msg">{{ loginError }}</p>
        </div>
        <div v-else class="toggle-text">
          <h2>Already have an account?</h2>
          <button class="switch-btn" @click="toggleMode">Login</button>
        </div>
      </div>

      <!-- Right Box (Register) -->
      <div class="form-box right-box">
        <div v-if="isSignup" class="form-content">
          <h2>Create account</h2>
          <input type="text" placeholder="Name" v-model="name" />
          <input type="text" placeholder="Email" v-model="email" />
          <input type="password" placeholder="Password" v-model="password" />
          <button @click.prevent="handleRegister">Register</button>
          <p v-if="registerError" class="error-msg">{{ registerError }}</p>
          <p v-if="successMessage" class="success-msg">{{ successMessage }}</p>
        </div>
        <div v-else class="toggle-text">
          <h2>Don’t have an account?</h2>
          <button class="switch-btn" @click="toggleMode">Create account</button>
        </div>
      </div>

      <!-- Sliding background effect -->
      <div class="slider-box" :class="{ 'slide-left': isSignup }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUsers } from '../modules/auth/useUsers'
import { useRouter } from 'vue-router'

const { fetchToken, registerUser, successMessage, error } = useUsers()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const isSignup = ref(false)

const loginError = ref<string | null>(null)
const registerError = ref<string | null>(null)

const toggleMode = () => {
  isSignup.value = !isSignup.value
  loginError.value = null
  registerError.value = null
}

const handleLogin = async () => {
  try {
    loginError.value = null
    await fetchToken(email.value, password.value)
    console.log('✅ Logged in!')
    router.push('/my-day')
  } catch (err) {
    loginError.value = 'Invalid email or password'
    console.error('❌ Login error:', err)
  }
}

const handleRegister = async () => {
  registerError.value = null
  const success = await registerUser(name.value, email.value, password.value)

  if (success) {
    console.log('✅ Registered!')
    // redirect eller vis melding her om ønskelig
  } else {
    registerError.value = error.value
    console.error('❌ Register error:', registerError.value)
  }
}
</script>

<style>
body {
  background-color: #fff;
}
</style>

<style scoped>


.auth-wrapper {
  position: relative;   
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 5rem; 
  padding-top: 120px; 
}

.auth-logo {
  position: absolute;
  top: 0;  
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: auto;
  z-index: 10;
}

.auth-container {
  position: relative;
  display: flex;
  width: 900px;
  height: 500px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;
}

.form-box {
  width: 50%;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 2rem;
  transition: all 0.2s ease;
  flex-direction: column;
  position: relative;
}

.form-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  z-index: 3;
}

.form-content input {
  padding: 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 10px;
  box-shadow: inset 0 0 0 1px #ccc;
}

.form-content button {
  padding: 1rem;
  font-weight: bold;
  font-size: 1rem;
  background: #f4f3eb;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.1s;
}

.form-content button:hover {
  background: #fad809;
}

.toggle-text {
  text-align: center;
  z-index: 3;
}

.switch-btn {
  margin-top: 1rem;
  padding: 0.8rem 1.5rem;
  background: #fff;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.1s;
}

.switch-btn:hover {
  background: #f4f3eb;
}

.slider-box {
  position: absolute;
  width: 50%;
  height: 100%;
  top: 0;
  left: 50%;
  background: #f4f3eb;
  z-index: 1;
  transition: all 0.4s ease-in-out;
  border-radius: 20px;
}

.auth-container.signup-mode .slider-box {
  transform: translateX(-100%);
}

.slider-box::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(2px);
}

.error-msg {
  color: red;
  font-size: 0.9rem;
  margin-top: -0.5rem;
}

.success-msg {
  color: green;
  font-size: 0.9rem;
  margin-top: -0.5rem;
}
</style>

