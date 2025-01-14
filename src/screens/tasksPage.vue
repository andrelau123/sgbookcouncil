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

<script>
import { db } from "../../firebase"; // Your Firebase initialization file
import { auth } from "../../firebase"; // Firebase authentication
import {
  collection,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  getDocs,
} from "firebase/firestore";

export default {
  data() {
    return {
      tasks: [], // Store tasks locally
      newTaskTitle: "",
      newTaskDescription: "",
    };
  },
  methods: {
    // Ensure the user's document exists
    async ensureUserDocumentExists() {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("No user logged in");

      const userDocRef = doc(db, "users", userId);
      await setDoc(userDocRef, { createdAt: new Date() }, { merge: true });
    },

    // Fetch tasks for the logged-in user
    async fetchTasks() {
      const userId = auth.currentUser?.uid;
      if (!userId) return console.error("No user logged in");

      const tasksRef = collection(db, `users/${userId}/tasks`);
      const snapshot = await getDocs(tasksRef);
      this.tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },

    // Add a new task
    async addTask() {
      const userId = auth.currentUser?.uid;
      if (!userId) return console.error("No user logged in");

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

    // Delete a task
    async deleteTask(taskId) {
      const userId = auth.currentUser?.uid;
      if (!userId) return console.error("No user logged in");

      const taskRef = doc(db, `users/${userId}/tasks`, taskId);
      await deleteDoc(taskRef);
      this.fetchTasks(); // Refresh tasks
    },

    // Toggle task completion
    async toggleTaskCompletion(taskId, completed) {
      const userId = auth.currentUser?.uid;
      if (!userId) return console.error("No user logged in");

      const taskRef = doc(db, `users/${userId}/tasks`, taskId);
      await updateDoc(taskRef, { completed: !completed });
      this.fetchTasks(); // Refresh tasks
    },
  },
  async mounted() {
    try {
      await this.ensureUserDocumentExists();
      await this.fetchTasks(); // Fetch tasks when the component loads
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  },
};

</script>
