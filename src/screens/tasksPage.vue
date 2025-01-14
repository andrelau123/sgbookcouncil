<template>
  <navBar />
  <!-- <br />
  <div class="row m-2">
    <div class="col-3 container border">Charts Visuals Overview</div>
    <div class="col-9 container border">Charts Visuals Overview</div>
  </div>

  <br />
  <div>Tasks List</div>
  <br />
  <div>
    <button>Create Task</button>
  </div>
  <br />
  <div>
    <button>Delete Task</button>
  </div> -->


  <div>
    <h1>Tasks</h1>
    <div>
      <input v-model="newTaskTitle" type="text" placeholder="Task Title" />
      <input v-model="newTaskDescription" type="text" placeholder="Task Description" />
      <button @click="addTask">Add Task</button>
    </div>
    <ul>
      <li v-for="task in tasks" :key="task.id">
        <span :style="{ textDecoration: task.completed ? 'line-through' : 'none' }">
          {{ task.title }}: {{ task.description }}
        </span>
        <button @click="toggleTaskCompletion(task.id, task.completed)">
          {{ task.completed ? "Undo" : "Complete" }}
        </button>
        <button @click="deleteTask(task.id)">Delete</button>
      </li>
    </ul>
  </div>

</template>

<script setup>
import navBar from "@/components/navBar.vue";
</script>

<script>
import { db } from "../../firebase"; // Your Firebase initialization file
import { collection, addDoc, deleteDoc, doc, updateDoc, getDocs } from "firebase/firestore";
import { auth } from "../../firebase"; // Firebase authentication

export default {
  data() {
    return {
      tasks: [], // Store tasks locally
      newTaskTitle: "",
      newTaskDescription: "",
    };
  },
  methods: {
    async fetchTasks() {
      const userId = auth.currentUser.uid;
      const tasksRef = collection(db, `users/${userId}/tasks`);
      const snapshot = await getDocs(tasksRef);
      this.tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
    async addTask() {
      const userId = auth.currentUser.uid;
      const tasksRef = collection(db, `users/${userId}/tasks`);
      await addDoc(tasksRef, {
        title: this.newTaskTitle,
        description: this.newTaskDescription,
        completed: false,
        createdAt: new Date(),
      });
      this.newTaskTitle = "";
      this.newTaskDescription = "";
      this.fetchTasks(); // Refresh tasks
    },
    async deleteTask(taskId) {
      const userId = auth.currentUser.uid;
      const taskRef = doc(db, `users/${userId}/tasks`, taskId);
      await deleteDoc(taskRef);
      this.fetchTasks(); // Refresh tasks
    },
    async toggleTaskCompletion(taskId, completed) {
      const userId = auth.currentUser.uid;
      const taskRef = doc(db, `users/${userId}/tasks`, taskId);
      await updateDoc(taskRef, { completed: !completed });
      this.fetchTasks(); // Refresh tasks
    },
  },
  mounted() {
    this.fetchTasks(); // Fetch tasks when the component loads
  },
};

</script>
