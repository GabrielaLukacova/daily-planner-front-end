<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import DayPlan from '@/components/DayPlan.vue'
import AddActivityForm from '@/components/AddActivityForm.vue'
import type { Activity } from '@/interfaces/interfaces'
import { selectedDate } from '@/modules/globalStates/state'

const allActivities = ref<Activity[]>([])
const showPopup = ref(false)

const token = localStorage.getItem('lsToken') || ''
const userId = localStorage.getItem('userIDToken') || ''

async function fetchActivities() {
  if (!token || !userId) return

  try {
    const res = await fetch(`https://daily-planner-kyar.onrender.com/api/activities`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await res.json()
    allActivities.value = data
  } catch (error) {
    console.error('❌ Failed to fetch activities:', error)
  }
}

const dayActivities = computed(() =>
  allActivities.value.filter(
    (a) =>
      new Date(a.date).toDateString() === selectedDate.value.toDateString()
  )
)

async function addActivity(activity: Activity) {
  if (!token || !userId) return

  const fullActivity = {
    ...activity,
    date: selectedDate.value.toISOString(),
    _createdBy: userId,
    isRepeating: activity.repeating !== 'None',
  }

  try {
    const res = await fetch(`https://daily-planner-kyar.onrender.com/api/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(fullActivity),
    })

    if (!res.ok) throw new Error('Failed to save activity.')

    const saved = await res.json()
    allActivities.value.unshift(saved)
    showPopup.value = false
  } catch (err: any) {
    console.error('❌ Error saving activity:', err.message)
  }
}

watch(selectedDate, fetchActivities)
onMounted(fetchActivities)
</script>

<template>
  <div class="my-day">
    <DayPlan :activities="dayActivities" />
    <button class="add-btn" @click="showPopup = true">+</button>
    <AddActivityForm
      v-if="showPopup"
      @close="showPopup = false"
      @add-activity="addActivity"
    />
  </div>
</template>

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
