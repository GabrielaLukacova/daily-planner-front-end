<template>
  <footer class="footer">
    <div class="footer-content">
      <img
        src="@/media/planit_app_logo.jpeg"
        alt="Day Plan Logo"
        class="footer-logo"
        @click="goToTop"
        style="cursor: pointer"
      />

      <p class="quote">
        Because every great day deserves a great plan.
      </p>

      <div class="accent-line"></div>

      <p class="copyright">
        &copy; {{ currentYear }} Day plan app. All rights reserved.
      </p>
    </div>
  </footer>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const route = useRoute()
const currentYear = new Date().getFullYear()

function goToTop() {
  if (route.name !== 'my-day') {
    router.push({ name: 'my-day' }).then(() => {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 300)
    })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<style scoped>
.footer {
  background-color: white;
  padding: 2rem 0;
  border-top: 2px solid #FAD809;
  text-align: center;
  position: relative;
  z-index: 100;
}

.footer-content {
  max-width: 800px;
  margin: 0 auto;
}

.footer-logo {
  width: 120px;
  margin-bottom: 1rem;
}

.quote {
  font-size: 1.1rem;
  color: #000;
  margin-bottom: 1rem;
}

.accent-line {
  height: 2px;
  width: 400px;
  background-color: #FAD809;
  margin: 0.5rem auto 1.5rem auto;
  margin-bottom: 40px;
  border-radius: 2px;
}

p {
  color: #000;
  font-size: 0.9rem;
}
</style>
