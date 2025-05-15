<template>
  <div class="calendar">
    <div class="month-year">{{ formattedMonthYear }}</div>
    <div class="week-days">
      <button class="arrow" @click="prevWeek">←</button>
      <div class="days">
        <div
          v-for="(day, index) in weekDays"
          :key="index"
          class="day"
          :class="{ today: isToday(day.date) }"
          @click="selectDay(day.date)"
        >
          <div class="day-name">{{ day.label }}</div>
          <div class="day-number">{{ day.date.getDate() }}</div>
        </div>
      </div>
      <button class="arrow" @click="nextWeek">→</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { format, startOfWeek, addDays, subWeeks, addWeeks, isSameDay } from 'date-fns'

const emit = defineEmits(['day-selected'])

const currentDate = ref(new Date())
const formattedMonthYear = computed(() => format(currentDate.value, 'MMMM yyyy'))

const startOfCurrentWeek = computed(() => startOfWeek(currentDate.value, { weekStartsOn: 1 }))

const weekDays = computed(() => {
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfCurrentWeek.value, i)
    return { label: labels[i], date }
  })
})

function selectDay(date) {
  emit('day-selected', date)
}

const isToday = (date) => isSameDay(date, new Date())
const prevWeek = () => (currentDate.value = subWeeks(currentDate.value, 1))
const nextWeek = () => (currentDate.value = addWeeks(currentDate.value, 1))
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
  max-width: 800px;
  width: 100%;
}

.day {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  border-radius: 10px;
  height: 85px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s, border-color 0.3s, color 0.3s;
  background-color: white;
  color: #111;
  box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.1);
  border: 2px solid transparent;
  position: relative;
}

.day::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 35%;  
  background-color: #F4F3EB;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  z-index: 0;
}

/* Make sure text is above the pseudo bg */
.day-name,
.day-number {
  position: relative;
  z-index: 1;
}

.day.selected,
.day.today.selected {
  background-color: #fad809;
  box-shadow: 0 0 12px 3px #fadb09cc;
  border-color: #fadb09cc;
  color: black;
}

.day.today:not(.selected)::before {
  background-color: #fad809;
  box-shadow: none;
  border-color: transparent;
}

.day:not(.selected):not(.today) {
  box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.1);
  border-color: transparent;
  color: #111;
}

.day-name {
  font-size: 18px;
  opacity: 0.7;
  width: 100%;
  text-align: center;
  padding: 4px 0;
  user-select: none;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.day-number {
  font-size: 24px;
  margin-top: 4px;
  user-select: none;
}


</style>

