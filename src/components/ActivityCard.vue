<template>
    <div class="activity-card">
      <div class="icon-title">
        <FontAwesomeIcon :icon="icon" class="icon" />
        <input
          v-model="activity.title"
          type="text"
          placeholder="Enter activity title"
          @input="updateIcon"
        />
      </div>
      <p><strong>Description:</strong> {{ activity.description }}</p>
      <p><strong>Date:</strong> {{ formattedDate }}</p>
      <p><strong>Time:</strong> {{ activity.startTime }} - {{ activity.endTime }}</p>
      <p><strong>Place:</strong> {{ activity.place }}</p>
      <p><strong>Repeats:</strong> {{ activity.isRepeating ? activity.repeating : "No" }}</p>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, defineProps } from 'vue';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import { keywordIconMap } from '@/utils/iconMap';
  import type { Activity } from '@/interfaces/interfaces';

  
  
  const props = defineProps<{ initialActivity: Activity }>();
  const activity = ref({ ...props.initialActivity });
  
  function getIconForTitle(text: string) {
    const lowerText = text.toLowerCase();
    for (const [keyword, icon] of Object.entries(keywordIconMap)) {
      if (keyword !== 'default' && lowerText.includes(keyword)) {
        return icon;
      }
    }
    return keywordIconMap.default;
  }
  
  const icon = ref(getIconForTitle(activity.value.title));
  
  function updateIcon() {
    icon.value = getIconForTitle(activity.value.title);
  }
  
  const formattedDate = computed(() =>
    new Date(activity.value.date).toLocaleDateString()
  );
  </script>
  
  <style scoped>
  .activity-card {
    border: 1px solid #ddd;
    padding: 1rem;
    border-radius: 8px;
    max-width: 400px;
  }
  .icon-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .icon {
    font-size: 1.5rem;
    color: #cb4540;
  }
  input {
    flex: 1;
    padding: 0.3rem;
    font-size: 1rem;
  }
  </style>
  