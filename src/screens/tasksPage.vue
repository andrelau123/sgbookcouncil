<template>
  <NavBar />
  <div class="container">
    <h1 class="text-center my-4">Task Manager</h1>
    <div class="input-group mb-3">
      <input v-model="newTaskTitle" type="text" class="form-control" placeholder="Task Title" />
      <input v-model="newTaskDescription" type="text" class="form-control" placeholder="Task Description" />
      <select v-model="newTaskUrgency" class="form-select">
        <option value="" disabled>Select Urgency</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <input v-model="newTaskDueDate" type="date" class="form-control" />
      <select v-model="newTaskAssignee" class="form-select">
        <option value="" disabled>Select Assignee</option>
        <option v-for="user in allUsers" :key="user" :value="user">
          {{ user }}
        </option>
      </select>

      <!-- New field for assignee -->
      <button @click="addTask" class="btn btn-primary">Add Task</button>
    </div>

    <div class="row">
      <div v-for="task in sortedTasks" :key="task.id" class="col-md-4 col-sm-6 my-2">
        <div class="sticky-note p-3" :class="{
          'note-high': task.urgency === 'high',
          'note-medium': task.urgency === 'medium',
          'note-low': task.urgency === 'low',
          completed: task.completed,
        }">
          <button @click="deleteTask(task.id)" class="delete-btn">✖</button>
          <button @click="openEditModal(task)" class="edit-btn">✏️</button>
          <div class="taskblock">
            <h4>{{ task.title }}</h4>
            <p>{{ task.description }}</p>
            <p><strong>Assigned to:</strong> {{ task.assignee }}</p> <!-- Display assignee -->
            <p><strong>Due:</strong> {{ task.dueDate }}</p>
          </div>
          <button @click="toggleTaskCompletion(task.id, task.completed)"
            :class="['btn', 'btn-sm', task.completed ? 'btn-secondary' : 'btn-success', 'mt-2']">
            {{ task.completed ? "Undo" : "Complete" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="isEditModalOpen" class="modal">
      <div class="modal-content">
        <h3>Edit Task</h3>
        <input v-model="editTaskTitle" type="text" placeholder="Task Title" class="form-control" />
        <input v-model="editTaskDescription" type="text" placeholder="Task Description" class="form-control" />
        <select v-model="editTaskUrgency" class="form-select">
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <input v-model="editTaskDueDate" type="date" class="form-control" />
        <select v-model="editTaskAssignee" class="form-select">
          <option value="" disabled>Select Assignee</option>
          <option v-for="user in allUsers" :key="user" :value="user">
            {{ user }}
          </option>
        </select>

        <!-- Editable assignee field -->
        <button @click="updateTask" class="btn btn-primary mt-3">Save</button>
        <button @click="closeEditModal" class="btn btn-secondary mt-3">Cancel</button>
      </div>
    </div>
  </div>
</template>


<script setup>
import NavBar from "@/components/navBar.vue";
</script>

<script>
import { db } from "../../firebase";
import { auth } from "../../firebase";
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
      tasks: [],
      newTaskTitle: "",
      newTaskDescription: "",
      newTaskUrgency: "",
      newTaskDueDate: "",
      newTaskAssignee: "", // New property for the assignee
      isEditModalOpen: false,
      editTaskId: null,
      editTaskTitle: "",
      editTaskDescription: "",
      editTaskUrgency: "",
      editTaskDueDate: "",
      editTaskAssignee: "", // New property for editing assignee
    };
  },
  computed: {
    sortedTasks() {
      return this.tasks.sort((a, b) => {
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1; // Move completed tasks to the bottom
        }
        const urgencyOrder = { high: 1, medium: 2, low: 3 };
        if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
          return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
        }
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    },
  },
  methods: {
    async fetchUsers() {
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);
      this.allUsers = snapshot.docs.map((doc) => doc.id); // Extract email from document IDs
    },
    // async fetchTasks() {
    //   const userId = auth.currentUser?.email;
    //   if (!userId) return console.error("No user logged in");

    //   const tasksRef = collection(db, `users/${userId}/tasks`);
    //   const snapshot = await getDocs(tasksRef);
    //   this.tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    // },
    async fetchTasks() {
      const loggedInUserEmail = auth.currentUser?.email;
      if (!loggedInUserEmail) return console.error("No user logged in");

      const tasksRef = collection(db, "users");
      const snapshot = await getDocs(tasksRef);

      const allTasks = [];
      for (const userDoc of snapshot.docs) {
        const userId = userDoc.id; // User ID is the document ID
        const userTasksRef = collection(db, `users/${userId}/tasks`);
        const userTasksSnapshot = await getDocs(userTasksRef);

        // Add each user's tasks to allTasks
        userTasksSnapshot.forEach((taskDoc) => {
          const taskData = { id: taskDoc.id, ...taskDoc.data(), creator: userId };
          allTasks.push(taskData);
        });
      }

      // Filter tasks assigned to or created by the logged-in user
      this.tasks = allTasks.filter(
        (task) => task.assignee === loggedInUserEmail || task.creator === loggedInUserEmail
      );
    },
    async addTask() {
      const userId = auth.currentUser?.email;
      if (!userId) return console.error("No user logged in");

      const tasksRef = collection(db, `users/${userId}/tasks`);
      await addDoc(tasksRef, {
        title: this.newTaskTitle,
        description: this.newTaskDescription,
        urgency: this.newTaskUrgency,
        dueDate: this.newTaskDueDate,
        assignee: this.newTaskAssignee, // Include assignee
        completed: false,
      });
      this.newTaskTitle = "";
      this.newTaskDescription = "";
      this.newTaskUrgency = "";
      this.newTaskDueDate = "";
      this.newTaskAssignee = ""; // Reset assignee input
      this.fetchTasks();
    },
    openEditModal(task) {
      this.editTaskId = task.id;
      this.editTaskTitle = task.title;
      this.editTaskDescription = task.description;
      this.editTaskUrgency = task.urgency;
      this.editTaskDueDate = task.dueDate;
      this.editTaskAssignee = task.assignee; // Set assignee for editing
      this.isEditModalOpen = true;
    },
    async updateTask() {
      const userId = auth.currentUser?.email;
      if (!userId || !this.editTaskId) return console.error("Invalid operation");

      const taskRef = doc(db, `users/${userId}/tasks`, this.editTaskId);
      await updateDoc(taskRef, {
        title: this.editTaskTitle,
        description: this.editTaskDescription,
        urgency: this.editTaskUrgency,
        dueDate: this.editTaskDueDate,
        assignee: this.editTaskAssignee, // Include assignee when updating
      });
      this.isEditModalOpen = false;
      this.fetchTasks();
    },
    closeEditModal() {
      this.isEditModalOpen = false;
    },
    async deleteTask(taskId) {
      const userId = auth.currentUser?.email;
      if (!userId) return console.error("No user logged in");

      const taskRef = doc(db, `users/${userId}/tasks`, taskId);
      await deleteDoc(taskRef);
      this.fetchTasks();
    },
    async toggleTaskCompletion(taskId, completed) {
      const userId = auth.currentUser?.email;
      if (!userId) return console.error("No user logged in");

      const taskRef = doc(db, `users/${userId}/tasks`, taskId);
      await updateDoc(taskRef, { completed: !completed });
      this.fetchTasks();
    },
  },
  mounted() {
    this.fetchTasks();
    this.fetchUsers(); // Fetch user emails
  },
};
</script>

<style>
.sticky-note {
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  color: #333;
  text-align: left;
  word-wrap: break-word;
  min-height: 150px;
  overflow: hidden;
  padding-bottom: 20px;
  /* Add padding to the bottom of each sticky note */
}

.note-high {
  background-color: #ffcccb;
}

.note-medium {
  background-color: #fff9c4;
}

.note-low {
  background-color: #dcedc8;
}

.completed {
  background-color: lightgray;
  color: #999;
  text-decoration: line-through;
}

.delete-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 16px;
  color: #d32f2f;
  cursor: pointer;
  padding-bottom: 20px;
}

.edit-btn {
  position: absolute;
  top: 10px;
  left: 10px;
  background: none;
  border: none;
  font-size: 16px;
  color: #1976d2;
  cursor: pointer;
  padding-bottom: 20px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  /* margin-top: 10px;
  margin-bottom: 10px; */
}

.taskblock {
  margin-top: 18px;
}
</style>