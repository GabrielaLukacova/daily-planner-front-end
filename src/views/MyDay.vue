<template>
  <div class="my-day">
    <DayPlan :activities="activities" />
    <button class="add-btn" @click="showPopup = true">+</button>
    <AddActivityForm
      v-if="showPopup"
      @close="showPopup = false"
      @add-activity="addActivity"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DayPlan from '@/components/DayPlan.vue'
import AddActivityForm from '@/components/AddActivityForm.vue'
import type { Activity } from '@/interfaces/interfaces'

const activities = ref<Activity[]>([
  {
    title: 'Go to gym',
    description: 'Workout session',
    date: new Date(),
    startTime: '18:00',
    endTime: '19:00',
    place: 'Fitness center',
    isRepeating: false,
    _createdBy: 'user123'
  }
])

const showPopup = ref(false)

function addActivity(newActivity: Activity) {
  activities.value.push(newActivity)
}
</script>

<style scoped>
.my-day {
  position: relative;
}
.add-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #cb4540;
  color: white;
  font-size: 2rem;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
}
</style>
