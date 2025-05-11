<template>
    <div class="clock-picker">
      <label class="label">Start Time:</label>
      <div class="time-dropdown" @click="toggleDropdown">
        <span>{{ selectedTime }}</span>
        <div v-if="showDropdown" class="dropdown-menu">
          <div
            v-for="time in timeOptions"
            :key="time"
            class="dropdown-item"
            @click="selectTime(time)"
          >
            {{ time }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, defineProps, defineEmits } from 'vue'
  
  const props = defineProps<{
    selectedTime: string
  }>()
  
  const emit = defineEmits(['update:selectedTime'])
  
  const showDropdown = ref(false)
  
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2).toString().padStart(2, '0')
    const minute = (i % 2 === 0 ? '00' : '30')
    return `${hour}:${minute}`
  })
  
  function toggleDropdown() {
    showDropdown.value = !showDropdown.value
  }
  
  function selectTime(time: string) {
    emit('update:selectedTime', time)
    showDropdown.value = false
  }
  </script>
  
  <style scoped>
  .clock-picker {
    margin: 0.5rem 0;
  }
  
  .label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.3rem;
  }
  
  .time-dropdown {
    position: relative;
    padding: 0.7rem;
    border: 1px solid #ccc;
    border-radius: 0.4rem;
    cursor: pointer;
    background: #fff;
    transition: box-shadow 0.2s;
  }
  
  .time-dropdown:hover {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  }
  
  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    max-height: 200px;
    overflow-y: auto;
    width: 100%;
    background: white;
    border: 1px solid #ccc;
    border-radius: 0.4rem;
    z-index: 10;
    animation: fadeIn 0.2s ease-in-out;
  }
  
  .dropdown-item {
    padding: 0.6rem;
    cursor: pointer;
  }
  
  .dropdown-item:hover {
    background-color: #eee;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>
  