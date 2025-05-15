<template>
  <div class="calendar">
    <div class="month-year">
      {{ formattedMonthYear }}
    </div>

    <div class="week-days">
      <button class="arrow" @click="prevWeek">←</button>
      <div class="days">
        <div
          v-for="(day, index) in weekDays"
          :key="index"
          class="day"
          :class="{ today: isToday(day.date), selected: isSelected(day.date) }"
          @click="selectDate(day.date)"
        >
          <div class="day-name">{{ day.label }}</div>
          <div class="day-number">{{ day.date.getDate() }}</div>
        </div>
      </div>
      <button class="arrow" @click="nextWeek">→</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  format,
  startOfWeek,
  addDays,
  subWeeks,
  addWeeks,
  isSameDay,
} from 'date-fns'

import { selectedDate } from '@/modules/globalStates/state' // 👈 viktig!

const currentDate = ref(new Date())

// Set chosen date for localStorage when starting
onMounted(() => {
  const stored = localStorage.getItem('selectedNoteDate')
  if (stored) selectedDate.value = new Date(stored)
})

// Shoow chosen month and year
const formattedMonthYear = computed(() =>
  format(currentDate.value, 'MMMM yyyy')
)

// Start date for week
const startOfCurrentWeek = computed(() =>
  startOfWeek(currentDate.value, { weekStartsOn: 1 })
)

// Weekdays
const weekDays = computed(() => {
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfCurrentWeek.value, i)
    return {
      label: labels[i],
      date,
    }
  })
})

// Functions
const isToday = (date: Date) => isSameDay(date, new Date())
const isSelected = (date: Date) => isSameDay(date, selectedDate.value)

function prevWeek() {
  currentDate.value = subWeeks(currentDate.value, 1)
}

function nextWeek() {
  currentDate.value = addWeeks(currentDate.value, 1)
}

function selectDate(date: Date) {
  selectedDate.value = date
  localStorage.setItem('selectedNoteDate', date.toISOString())
}
</script>

<style scoped>
.calendar {
  padding: 80px;
}

.month-year {
  font-size: 28px;
  margin-bottom: 12px;
  text-align: center;
  color: #111;
}

.week-days {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 25px;
  padding: 16px 0;
}

.arrow {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #333;
  transition: transform 0.2s;
}
.arrow:hover {
  transform: scale(1.2);
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2rem;
  width: 100%;
  max-width: 800px;
}

.day {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  height: 85px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.day.today {
  background-color: #fad809;
}

.day.selected {
  background-color: #cb4540;
  color: white;
}

.day-number {
  font-size: 22px;
}

.day-name {
  font-size: 14px;
  opacity: 0.7;
}
</style>
