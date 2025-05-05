<template>
  <div class="my-day">
    <h1>This is my day page page</h1>
    <p>Calendar on top and day schedgule</p>
    <WeekDays />
    <DayPlan />

  </div>
</template>

<script setup lang="ts">
import WeekDays from '@/components/WeekDays.vue'
import DayPlan from '@/components/DayPlan.vue'
import { format, startOfWeek, addDays, subWeeks, addWeeks, isSameDay } from 'date-fns'



</script>

<style scoped>

</style>
