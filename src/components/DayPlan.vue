<template>
  <div class="day-plan-container w-full h-full overflow-y-auto relative" ref="containerRef">
    <div class="timeline relative" ref="contentRef" @scroll="syncScroll">
      <div class="clock-bg absolute inset-0" />

      <!-- Hours -->
      <div v-for="hour in 24" :key="hour" class="hour-block">
        <div class="time-label">
          {{ (hour-1).toString().padStart(2, '0') }}:00
        </div>
      </div>

      <!-- Now Line -->
      <div class="now-line absolute left-0 right-0 h-0.5 bg-red-500" :style="{ top: nowLinePosition + 'px' }" />

      <!-- Activities -->
      <div
        v-for="(activity, index) in activities"
        :key="index"
        class="activity-box absolute"
        :class="{ active: isActiveNow(activity) }"
        :style="getStyleForActivity(activity)"
      >
        <font-awesome-icon
          :icon="getIcon(activity.title)"
          class="activity-icon"
        />
        <div class="activity-content">
          <span class="activity-title">{{ activity.title }}</span>
          <span class="activity-time">{{ activity.startTime }} - {{ activity.endTime }}</span>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { keywordIconMap } from '@/utils/iconMap';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { Activity } from '@/interfaces/interfaces';

defineProps<{
  activities: Activity[];
}>();

const containerRef = ref<HTMLDivElement | null>(null);
const contentRef = ref<HTMLDivElement | null>(null);
const nowLinePosition = ref(0);

// update "now" line every minute
onMounted(() => {
  updateNowLine();
  setInterval(updateNowLine, 60000);
});

function updateNowLine() {
  const now = new Date();
  nowLinePosition.value = (now.getHours() + now.getMinutes() / 60) * 60;
}

function getStyleForActivity(activity: Activity) {
  const start = parseTimeToOffset(activity.startTime);
  const end = parseTimeToOffset(activity.endTime);
  return {
    top: `${start}px`,
    height: `${end - start}px`,
  };
}

function parseTimeToOffset(timeStr: string) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function isActiveNow(activity: Activity) {
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const startMins = parseTimeToOffset(activity.startTime);
  const endMins = parseTimeToOffset(activity.endTime);
  return nowMins >= startMins && nowMins < endMins;
}

function getIcon(title: string) {
  const lower = title.toLowerCase();
  const keyword = Object.keys(keywordIconMap).find(k => lower.includes(k));
  return keywordIconMap[keyword || 'default'];
}

function syncScroll() {
  if (containerRef.value && contentRef.value) {
    containerRef.value.scrollTop = contentRef.value.scrollTop;
  }
}
</script>

<style scoped>
.day-plan-container {
  position: relative;
  height: 100vh;
  overflow-y: auto;
  width: calc(100% - 36rem);
  padding-left: 24rem;
}

.timeline {
  position: relative;
  width: 100%;
  padding-top: 20px;
}

.clock-bg {
  position: absolute;
  width: 100%;
  height: 1440px;
  pointer-events: none;
}

.hour-block {
  height: 60px;
  border-bottom: 1px solid #ddd;
  position: relative;
}

.time-label {
  position: absolute;
  left: 0;
  top: -8px;
  font-size: 14px;
  color: #888;
}

.now-line {
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: red;
  animation: pulse 1.5s infinite;
  z-index: 2;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

.activity-box {
  position: absolute;
  left: 90px;
  right: 20px;
  background: #F4F3EB;
  border-left: 4px solid #FAD809;
  border-radius: 6px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  font-size: 16px;
  margin-bottom: 4px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}

.activity-box.active {
  background: #fff176;
  border-left-color: #fbc02d;
  transform: scale(1.02);
}

.activity-icon {
  margin-right: 8px;
  color: #333;
  font-size: 18px;
}

.activity-content {
  display: flex;
  flex-direction: column;
}
</style>