<template>
  <div class="note-page">
    <div class="note-toolbar">
      <button @click="toggleBold"><strong>B</strong></button>
      <button @click="toggleBullet">• List</button>
      <select v-model="selectedSize" @change="changeFontSize">
        <option value="14px">Small</option>
        <option value="18px">Normal</option>
        <option value="24px">Large</option>
        <option value="32px">Huge</option>
      </select>
      <button @click="saveNote">Save</button>
    </div>

    <div class="note-date-display">
      Note for: {{ formattedDate }}
    </div>

    <div
      class="note-editor"
      contenteditable
      ref="editor"
      @input="updateText"
      :style="{ fontSize: selectedSize }"
    ></div>

    <p v-if="successMessage" class="success-msg">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, defineProps } from 'vue'
import { format } from 'date-fns'
import type { Note } from '@/interfaces/interfaces'

const props = defineProps<{ selectedDate?: Date }>()
const editor = ref<HTMLElement | null>(null)
const selectedSize = ref('18px')
const text = ref('')
const successMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

const effectiveDate = computed(() => props.selectedDate || new Date())
const formattedDate = computed(() =>
  format(effectiveDate.value, 'EEEE, d MMMM yyyy')
)

function toggleBold() {
  document.execCommand('bold')
}

function toggleBullet() {
  document.execCommand('insertUnorderedList')
}

function changeFontSize() {
  if (editor.value) {
    editor.value.style.fontSize = selectedSize.value
  }
}

function updateText() {
  if (editor.value) {
    text.value = editor.value.innerHTML
  }
}

async function fetchNoteForDate() {
  const token = localStorage.getItem('lsToken')
  const userId = localStorage.getItem('userIDToken')
  if (!token || !userId) return

  try {
    const response = await fetch(
      `https://daily-planner-kyar.onrender.com/api/notes?userId=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    if (!response.ok) throw new Error('Failed to fetch notes.')

    const notes: Note[] = await response.json()
    const match = notes.find((n) =>
      new Date(n.date).toDateString() === effectiveDate.value.toDateString()
    )

    if (editor.value) {
      editor.value.innerHTML = match ? match.text : ''
      text.value = match ? match.text : ''
    }
  } catch (err: any) {
    console.error('❌ Error loading note:', err.message)
    errorMessage.value = 'Failed to load saved note.'
  }
}

async function saveNote() {
  const token = localStorage.getItem('lsToken')
  const userId = localStorage.getItem('userIDToken')
  if (!token || !userId) {
    errorMessage.value = 'You must be logged in to save notes.'
    return
  }

  const noteData = {
    text: text.value,
    date: effectiveDate.value.toISOString(),
    _createdBy: userId,
  }

  try {
    const response = await fetch('https://daily-planner-kyar.onrender.com/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(noteData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to save note.')
    }

    const saved = await response.json()
    console.log('✅ Note saved:', saved)
    successMessage.value = '✅ Note saved successfully!'
    errorMessage.value = null
  } catch (err: any) {
    console.error('❌ Error saving note:', err.message)
    errorMessage.value = err.message || 'An error occurred while saving.'
    successMessage.value = null
  }
}

onMounted(fetchNoteForDate)
watch(() => props.selectedDate, fetchNoteForDate)
</script>

<style scoped>
.note-page {
  min-height: 100vh;
  padding: 2rem;
  font-family: 'Helvetica Neue', sans-serif;
  color: #333;
  width: calc(100% - 36rem);
  padding-left: 24rem;
}

.note-toolbar {
  background-color: #f4f3eb;
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.note-toolbar button {
  background: white;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}

.note-toolbar button:hover {
  background: #f0f0f0;
}

.note-toolbar select {
  padding: 0.5rem;
  border-radius: 6px;
  border: none;
  background: white;
}

.note-date-display {
  font-size: 16px;
  margin-bottom: 1rem;
  font-weight: 500;
  color: #666;
}

.note-editor {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  min-height: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  outline: none;
  margin-bottom: 1rem;
}

.success-msg {
  color: green;
  font-weight: bold;
  margin-top: 1rem;
}

.error-msg {
  color: red;
  font-weight: bold;
  margin-top: 1rem;
}
</style>
