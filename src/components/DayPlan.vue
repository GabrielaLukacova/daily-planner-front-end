<template>
    <div class="day-plan-container" ref="containerRef">
      <div class="time-column" ref="syncScrollRef">
        <div v-for="hour in 25" :key="hour" class="time-label">
          {{ (hour % 24).toString().padStart(2, '0') }}:00
        </div>
      </div>
  
      <div class="content-column" ref="contentRef" @scroll="syncScroll">
        <div class="spacer" />
        <div v-for="hour in 25" :key="hour" class="hour-block"></div>
        <div class="now-line" :style="{ top: nowLinePosition + 'px' }" />
        <div class="spacer" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  
  const containerRef = ref(null)
  const contentRef = ref(null)
  const syncScrollRef = ref(null)
  const nowLinePosition = ref(0)
  const hasScrolled = ref(false)
  
  const updateNowLine = () => {
    const now = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Europe/Copenhagen" })
    )
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const px = hours * 40 + (minutes / 60) * 40
    nowLinePosition.value = px
  
    if (!hasScrolled.value && contentRef.value) {
      const scrollTarget = px - 100
      contentRef.value.scrollTop = scrollTarget > 0 ? scrollTarget : 0
    }
  }
  
  const syncScroll = () => {
    hasScrolled.value = true
    if (syncScrollRef.value && contentRef.value) {
      syncScrollRef.value.scrollTop = contentRef.value.scrollTop
    }
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
    height: 100vh;
    overflow: hidden;
    font-family: 'Inter', sans-serif;
  }
  
  .time-column {
    width: 15%;
    padding-top: 10px;
    background-color: #f4f4f4;
    text-align: right;
    padding-right: 8px;
    overflow: hidden;
    border-right: 1px solid #e0e0e0;
  }
  
  .time-label {
    height: 40px;
    line-height: 40px;
    font-size: 13px;
    color: #444;
    border-bottom: 1px solid #eaeaea;
    position: relative;
    padding-right: 4px;
  }
  
  .content-column {
    width: 85%;
    position: relative;
    overflow-y: scroll;
    border-left: none;
    padding-top: 0;
    scroll-behavior: smooth;
    background-color: #fff;
    box-shadow: inset 3px 0 5px -3px rgba(0,0,0,0.1);
  }
  
  .spacer {
    height: 400px;
    flex-shrink: 0;
  }
  
  .hour-block {
    height: 40px;
    border-bottom: 1px solid #f2f2f2;
    background-color: #fff;
  }
  
  .now-line {
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #e63946;
    z-index: 30;
    pointer-events: none;
    transition: top 0.3s ease-out;
  }
  </style>
  