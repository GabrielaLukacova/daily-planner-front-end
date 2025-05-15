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
    </div>

    <div
      class="note-editor"
      contenteditable
      ref="editor"
      @input="updateText"
      :style="{ fontSize: selectedSize }"
    ></div>
    <div class="save-button-container">
  <button @click="saveNote" class="button-save">Save</button>
</div>

    <p class="date-info">Note for: {{ formattedDate }}</p>
    <p v-if="successMessage" class="success-msg">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { selectedDate } from '@/modules/globalStates/state'
import { format } from 'date-fns'

const editor = ref<HTMLElement | null>(null)
const selectedSize = ref('18px')
const text = ref('')
const successMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

const token = ref('')
const userId = ref('')

const formattedDate = computed(() =>
  format(selectedDate.value, 'EEEE, d MMMM yyyy')
)

async function fetchNote() {
  if (!token.value || !userId.value) return

  try {
    const res = await fetch(
      `https://daily-planner-kyar.onrender.com/api/notes?userId=${userId.value}`,
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      }
    )

    if (!res.ok) throw new Error(`Failed to fetch notes. Status: ${res.status}`)
    const notes = await res.json()

    const match = notes.find(
      (n: any) =>
        new Date(n.date).toDateString() === selectedDate.value.toDateString()
    )

    if (match && editor.value) {
      editor.value.innerHTML = match.text
      text.value = match.text
    } else {
      if (editor.value) editor.value.innerHTML = ''
      text.value = ''
    }
  } catch (err: any) {
    console.error('❌ Load error:', err.message)
    errorMessage.value = 'Failed to load saved note.'
  }
}

function updateText() {
  if (editor.value) {
    text.value = editor.value.innerHTML
  }
}

function toggleBold() {
  document.execCommand('bold')
}

function toggleBullet() {
  document.execCommand('insertUnorderedList')
}

function changeFontSize() {
  if (editor.value) editor.value.style.fontSize = selectedSize.value
}

async function saveNote() {
  if (!token.value || !userId.value) {
    errorMessage.value = 'You must be logged in to save notes.'
    return
  }

  const noteData = {
    text: text.value,
    date: selectedDate.value.toISOString(),
    _createdBy: userId.value,
  }

  try {
    const res = await fetch('https://daily-planner-kyar.onrender.com/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify(noteData),
    })

    if (!res.ok) throw new Error('Failed to save note.')

    const saved = await res.json()
    console.log('✅ Note saved:', saved)
    successMessage.value = '✅ Note saved!'
    errorMessage.value = null
  } catch (err: any) {
    errorMessage.value = err.message
    successMessage.value = null
  }
}

onMounted(() => {
  token.value = localStorage.getItem('lsToken') || ''
  userId.value = localStorage.getItem('userIDToken') || ''
  fetchNote()
})

watch(selectedDate, fetchNote)
</script>

<style scoped>
.note-page {
  padding: 2rem;
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

.note-toolbar button,
.note-toolbar select {
  background: white;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
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
}
.error-msg {
  color: red;
  font-weight: bold;
}
.date-info {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
}

.save-button-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.button-save {
  background-color: #FAD809;
  color: black;
  font-weight: bold;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

</style>

