<template>
    <div class="activity-modal">
      <div class="activity-box">
        <h2>🕒 Add Activity</h2>
  
        <input v-model="activity.title" placeholder="Title *" class="modern-input" />
  
        <div class="time-selection">
          <label>Start Time</label>
          <div class="time-options">
            <input 
              v-model="activity.startTime" 
              type="time" 
              class="modern-input" 
            />
          </div>
        </div>
  
        <div class="duration-selection">
          <label>End Time</label>
          <div class="time-options">
            <input 
              v-model="activity.endTime" 
              type="time" 
              class="modern-input" 
            />
          </div>
          <div class="duration-buttons">
            <button @click="setDuration(30)">+30 min</button>
            <button @click="setDuration(60)">+1 hour</button>
            <button @click="setDuration(120)">+2 hours</button>
          </div>
        </div>
  
  
        <textarea v-model="activity.description" placeholder="Description (optional)" class="modern-input" />
        <input v-model="activity.place" placeholder="Place (optional)" class="modern-input" />
  
        <div class="repeating-row">
          <label>Repeating:</label>
          <div class="repeating-options">
            <button 
              v-for="option in repeatingOptions" 
              :key="option" 
              @click="activity.repeating = option"
              :class="{ active: activity.repeating === option }">
              {{ option }}
            </button>
          </div>
        </div>
  
        <div class="button-row">
          <button class="submit" @click="emitAdd">Save</button>
          <button class="cancel" @click="$emit('close')">Cancel</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const emit = defineEmits(['close', 'add-activity'])
  
  const activity = ref({
    title: '',
    description: '',
    place: '',
    repeating: 'None',
    startTime: '13:00',
    endTime: ''
  })
  
  const repeatingOptions = ['None', 'Daily', 'Weekly', 'Monthly']
  
  function setDuration(mins: number) {
    const [h, m] = activity.value.startTime.split(':').map(Number)
    const start = new Date()
    start.setHours(h)
    start.setMinutes(m)
  
    const end = new Date(start.getTime() + mins * 60000)
    const endH = String(end.getHours()).padStart(2, '0')
    const endM = String(end.getMinutes()).padStart(2, '0')
    activity.value.endTime = `${endH}:${endM}`
  }
  
  function emitAdd() {
    if (activity.value.title && activity.value.startTime && activity.value.endTime) {
      emit('add-activity', activity.value)
    }
  }
  </script>
  
  <style scoped>
  .activity-modal {
    position: fixed;
    top: 0;
    left: 80px;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
  }
  
  .activity-box {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    width: 400px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    animation: pop-in 0.3s ease-out;
  }
  
  @keyframes pop-in {
    0% { transform: scale(0.9); opacity: 0 }
    100% { transform: scale(1); opacity: 1 }
  }
  
  .modern-input {
    width: 100%;
    padding: 0.7rem;
    margin: 0.5rem 0;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    font-size: 1rem;
  }
  
  .time-selection,
  .duration-selection {
    margin-bottom: 1rem;
  }
  
  .time-options {
    display: flex;
    justify-content: space-between;
    margin: 0.5rem 0;
  }
  
  .duration-buttons {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
  }
  
  .duration-buttons button {
    flex: 1;
    margin: 0 0.2rem;
    padding: 0.6rem;
    background: #f0f0f0;
    border: none;
    border-radius: 0.4rem;
    font-weight: bold;
    transition: all 0.2s;
  }
  
  .duration-buttons button:hover {
    background: #ddd;
  }
  
  .end-time-display {
    font-size: 1rem;
    color: #444;
    margin-bottom: 1rem;
  }
  
  .repeating-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .repeating-options {
    display: flex;
    gap: 1rem;
  }
  
  .repeating-options button {
    padding: 0.7rem 1rem;
    background: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    cursor: pointer;
  }
  
  .repeating-options button.active {
    background-color: #FAD809;
    color: black;
    font-weight: bold;
  }
  
  .button-row {
    display: flex;
    justify-content: space-between;
    margin-top: 1.5rem;
  }
  
  .submit {
    background: #FAD809;
    color: black;
    padding: 0.7rem 1.2rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: bold;
  }
  
  .cancel {
    background: #ccc;
    padding: 0.7rem 1.2rem;
    border: none;
    border-radius: 0.5rem;
  }
  </style>
  