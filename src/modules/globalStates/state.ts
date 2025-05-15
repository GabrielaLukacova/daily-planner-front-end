// src/modules/globalStates/state.ts
import { ref, watch, reactive } from 'vue'

// ✅ Global login-state
const isLoggedInFromStorage = localStorage.getItem('isLoggedIn') === 'true'
export const state = reactive({
  isLoggedIn: isLoggedInFromStorage
})
watch(() => state.isLoggedIn, (val) => {
  localStorage.setItem('isLoggedIn', String(val))
})

// ✅ Global selectedDate
export const selectedDate = ref(new Date())

// Oppdater fra localStorage ved oppstart
const storedDate = localStorage.getItem('selectedNoteDate')
if (storedDate) {
  selectedDate.value = new Date(storedDate)
}

// Synkroniser med localStorage
watch(selectedDate, (newVal) => {
  localStorage.setItem('selectedNoteDate', newVal.toISOString())
})

