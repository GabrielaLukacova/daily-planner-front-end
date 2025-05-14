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
          :key="task._id"
          :class="{ done: task.isCompleted, priority: task.highPriority }"
        >
          <label class="custom-checkbox">
            <input
              type="checkbox"
              :checked="task.isCompleted"
              @change="completeTask(task)"
            />
            <span class="checkmark"></span>
          </label>

          <span
            class="task-text"
            v-if="!task.editing"
            @dblclick="editTask(task)"
          >
            {{ task.title }}
          </span>
          <input
            v-else
            v-model="task.title"
            @keyup.enter="saveEdit(task)"
            @blur="saveEdit(task)"
            class="edit-input"
          />

          <div class="task-actions">
            <i
              class="fas fa-star star-icon"
              :class="{ active: task.highPriority }"
              @click="togglePriority(task)"
            ></i>
            <i class="fas fa-edit edit-icon" @click="editTask(task)"></i>
            <i class="fas fa-trash delete-icon" @click="deleteTask(task._id)"></i>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import confetti from "canvas-confetti";
import type { Task } from "../interfaces/interfaces";

const userId = localStorage.getItem("userIDToken") ?? "";

// Extend Task with _id and local editing state
type TaskWithLocalState = Task & { _id: string; editing?: boolean };
const newTask = ref("");
const tasks = ref<TaskWithLocalState[]>([]);

const api = axios.create({
  baseURL: "https://daily-planner-kyar.onrender.com/api/tasks",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("lsToken") ?? ""}`,
  },
});

onMounted(fetchTasks);

async function fetchTasks() {
  try {
    const response = await api.get("/");
    tasks.value = response.data.map((task: TaskWithLocalState) => ({
      ...task,
      editing: false,
    }));
  } catch (err) {
    console.error("Failed to fetch tasks", err);
  }
}

async function addTask() {
  const taskText = newTask.value.trim();
  const token = localStorage.getItem("lsToken");
  const userId = localStorage.getItem("userIDToken");

  console.log("➡️ Triggered addTask()");
  console.log("📝 Task:", taskText);
  console.log("👤 User ID:", userId);
  console.log("🔐 Token:", token);

  if (!taskText || !userId || !token) {
    console.warn("❌ Missing required fields");
    return;
  }

  try {
    const res = await axios.post(
      "https://daily-planner-kyar.onrender.com/api/tasks",
      {
        title: taskText,
        _createdBy: userId,      // Make sure userId is correctly fetched
        isCompleted: false,      // Default value
        highPriority: false,     // Default value
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("✅ Task created:", res.data);
    tasks.value.push({ ...res.data, editing: false });
    newTask.value = "";
  } catch (err: any) {
    console.error("🚨 Failed to add task:", err?.response?.data || err.message);
  }
}


async function completeTask(task: TaskWithLocalState) {
  task.isCompleted = !task.isCompleted;
  await updateTask(task);

  if (task.isCompleted) {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }
}

async function togglePriority(task: TaskWithLocalState) {
  task.highPriority = !task.highPriority;
  await updateTask(task);
}

function editTask(task: TaskWithLocalState) {
  task.editing = true;
}

async function saveEdit(task: TaskWithLocalState) {
  task.editing = false;
  await updateTask(task);
}

async function updateTask(task: TaskWithLocalState) {
  try {
    await api.put(`/${task._id}`, {
      title: task.title,
      isCompleted: task.isCompleted,
      highPriority: task.highPriority,
    });
  } catch (err) {
    console.error("Failed to update task", err);
  }
}

async function deleteTask(taskId: string) {
  try {
    await api.delete(`/${taskId}`);
    tasks.value = tasks.value.filter((t) => t._id !== taskId);
  } catch (err) {
    console.error("Failed to delete task", err);
  }
}

const sortedTasks = computed(() => {
  return [...tasks.value].sort((a, b) => Number(b.highPriority) - Number(a.highPriority));
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
