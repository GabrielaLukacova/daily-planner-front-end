
<template>
  <div class="todo-wrapper">
    <div class="todo-container">
      <h1 class="title">My To-Do List</h1>

      <div class="input-group">
        <input
          v-model="newTask"
          @keyup.enter="addTask"
          type="text"
          placeholder="What do you need to do?"
        />
        <button @click="addTask" class="add-btn">
          <i class="fas fa-plus"></i>
        </button>
      </div>

      <ul class="task-list">
        <li
          v-for="(task, index) in sortedTasks"
          :key="index"
          :class="{ done: task.done, priority: task.priority }"
        >
          <label class="custom-checkbox">
            <input type="checkbox" v-model="task.done" @change="completeTask(task)" />
            <span class="checkmark"></span>
          </label>

          <span
            class="task-text"
            v-if="!task.editing"
            @dblclick="editTask(task)"
          >
            {{ task.text }}
          </span>
          <input
            v-else
            v-model="task.text"
            @keyup.enter="saveEdit(task)"
            @blur="saveEdit(task)"
            class="edit-input"
          />

          <div class="task-actions">
            <i
              class="fas fa-star star-icon"
              :class="{ active: task.priority }"
              @click="togglePriority(task)"
            ></i>
            <i class="fas fa-edit edit-icon" @click="editTask(task)"></i>
            <i class="fas fa-trash delete-icon" @click="deleteTask(index)"></i>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import confetti from "canvas-confetti";

const newTask = ref("");
const tasks = ref([]);

function addTask() {
  if (newTask.value.trim() === "") return;
  tasks.value.push({
    text: newTask.value,
    done: false,
    priority: false,
    editing: false,
  });
  newTask.value = "";
}

function togglePriority(task) {
  task.priority = !task.priority;
}

function completeTask(task) {
  if (task.done) {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }
}

function editTask(task) {
  task.editing = true;
}

function saveEdit(task) {
  task.editing = false;
}

function deleteTask(index) {
  tasks.value.splice(index, 1);
}

const sortedTasks = computed(() => {
  return [...tasks.value].sort((a, b) => {
    if (a.priority === b.priority) return 0;
    return a.priority ? -1 : 1;
  });
});
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");

.todo-wrapper {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
  margin-left: 24 rem;
}

.todo-container {
  background-color: white;
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 700px;
  min-height: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.title {
  text-align: center;
  color: #222;
  margin-bottom: 1.5rem;
  font-size: 2rem;
}

.input-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.input-group input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #fad809;
  border-radius: 8px;
  font-size: 1rem;
}

.input-group .add-btn {
  background-color: #fad809;
  border: none;
  padding: 0 1rem;
  border-radius: 8px;
  cursor: pointer;
  color: #fff;
  font-size: 1.2rem;
  transition: background-color 0.3s;
}

.input-group .add-btn:hover {
  background-color: #e2c208;
}

.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-list li {
  background-color: #fff;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.task-list li.done {
  text-decoration: line-through;
  opacity: 0.6;
}

.task-list li.priority {
  font-weight: bold;
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(250, 216, 9, 0.3);
}

/* Custom Checkbox */
.custom-checkbox {
  display: flex;
  align-items: center;
  margin-right: 0.75rem;
  position: relative;
  cursor: pointer;
}

.custom-checkbox input {
  opacity: 0;
  position: absolute;
  width: 0;
  height: 0;
}

.checkmark {
  width: 20px;
  height: 20px;
  background-color: transparent;
  border: 2px solid #fad809;
  border-radius: 50%;
  display: inline-block;
  position: relative;
}

.custom-checkbox input:checked ~ .checkmark {
  background-color: #fad809;
}

.checkmark::after {
  content: "";
  position: absolute;
  display: none;
}

.custom-checkbox input:checked ~ .checkmark::after {
  display: block;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.task-text {
  flex: 1;
  font-size: 1.1rem;
  color: #333;
  cursor: pointer;
}

.edit-input {
  flex: 1;
  font-size: 1.1rem;
  padding: 0.4rem 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.task-actions {
  display: flex;
  gap: 0.6rem;
  align-items: center;
  margin-left: 1rem;
}

.star-icon,
.edit-icon,
.delete-icon {
  cursor: pointer;
  font-size: 1.2rem;
  color: #bbb;
  transition: color 0.3s;
}

.star-icon.active {
  color: #fad809;
}

.edit-icon:hover {
  color: #3498db;
}

.delete-icon:hover {
  color: #e74c3c;
}
</style>
