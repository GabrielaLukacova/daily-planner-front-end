<template>
  <div class="day-plan-container" ref="containerRef">
    <div class="timeline" ref="contentRef" @scroll="syncScroll">
      <div v-for="hour in 24" :key="hour- 1" class="hour-block">
        <div class="time-label">
          {{ ((hour -1) % 24).toString().padStart(2, '0') }}:00
        </div>
      </div>
      <div class="now-line" :style="{ top: nowLinePosition + 'px' }" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const containerRef = ref(null)
const contentRef = ref(null)
const nowLinePosition = ref(0)
const hasScrolled = ref(false)

const updateNowLine = () => {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Europe/Copenhagen" })
  )
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const px = hours * 60 + (minutes / 60) * 60
  nowLinePosition.value = px

  if (!hasScrolled.value && contentRef.value) {
    const scrollTarget = px - 100
    contentRef.value.scrollTop = scrollTarget > 0 ? scrollTarget : 0
  }
}

const syncScroll = () => {
  hasScrolled.value = true
}

let interval
onMounted(() => {
  updateNowLine()
  interval = setInterval(updateNowLine, 60000)
  contentRef.value?.addEventListener("scroll", syncScroll)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<style scoped>
.day-plan-container {
  display: flex;
  justify-content: center;
  padding: 0 12%;
  height: 100vh;
  font-family: 'Inter', sans-serif;
  background: linear-gradient(to bottom, #fdfbfb, #ebedee);
}

.timeline {
  width: 100%;
  position: relative;
  overflow-y: scroll;
  scroll-behavior: smooth;
  background-color: #fff;
  box-shadow: 0 0 0 1px #e0e0e0 inset;
}

.hour-block {
  height: 60px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  padding-left: 10px;
  font-size: 14px;
  color: #333;
  transition: background 0.2s;
}

.hour-block:hover {
  background: rgba(0, 0, 0, 0.03);
}

.time-label {
  font-weight: 500;
}

.now-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #212E6E;
  z-index: 10;
  pointer-events: none;
  transition: top 0.3s ease-out;
}
</style>
