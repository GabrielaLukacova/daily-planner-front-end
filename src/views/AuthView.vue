<template>
  <div class="auth-wrapper">
    <div :class="['auth-container', isSignup ? 'signup-mode' : '']">
      <!-- Left Box -->
      <div class="form-box left-box">
        <div v-if="!isSignup" class="form-content">
          <h2>Login</h2>
          <input type="text" placeholder="Email" v-model="email" />
          <input type="password" placeholder="Password" v-model="password" />
          <button @click="fetchToken(email, password)">Login</button>
        </div>
        <div v-else class="toggle-text">
          <h2>Already have an account?</h2>
          <button class="switch-btn" @click="toggleMode">Login</button>
        </div>
      </div>

      <!-- Right Box -->
      <div class="form-box right-box">
        <div v-if="isSignup" class="form-content">
          <h2>Create account</h2>
          <input type="text" placeholder="Name" v-model="name" />
          <input type="text" placeholder="Email" v-model="email" />
          <input type="password" placeholder="Password" v-model="password" />
          <button @click.prevent="registerUser(name, email, password)">Register</button>
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

const { fetchToken, registerUser, logout, name, email, password } = useUsers()
const isSignup = ref(false)

const toggleMode = () => {
  isSignup.value = !isSignup.value
}
</script>

<style scoped>
.auth-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 15rem;

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

.left-box {
  color: #222;
}

.right-box {
  color: #222;
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
  background: #FAD809;
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

/* Slider background box */
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
</style>
