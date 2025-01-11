<template>
  <div class="login-container">
    <div class="login-box">
      <h1 class="title">SGBOOKCOUNCIL Portal</h1>
      <h2 class="subtitle">Login</h2>
      <div class="form-group">
        <label for="email">Username</label>
        <input id="email" type="text" placeholder="Email" v-model="email" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          v-model="password"
        />
      </div>
      <div class="button-group">
        <button @click="register" class="signup-button">Sign Up</button>
        <button @click="login" class="login-button">Login</button>
      </div>
      <p class="error" v-if="error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      error: "",
    };
  },
  methods: {
    login() {
      // Add login logic here
      console.log("Logging in with", this.email, this.password);
    },
    register() {
      // Add registration logic here
      console.log("Registering with", this.email, this.password);
    },
  },
};
</script>

<style scoped>
/* Global Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Arial", sans-serif;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: #333;
}

h1,
h2 {
  text-align: center;
  color: #2a3d66;
}

/* Login Container */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to right, #4e9df8, #2a3d66);
}

.login-box {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
}

.title {
  font-size: 1.8rem;
  color: #2a3d66;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.2rem;
  margin-bottom: 20px;
  color: #666;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #4e9df8;
}

button {
  width: 100%;
  padding: 12px;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.signup-button {
  background-color: #ff5a5f;
  color: white;
  border: none;
}

.signup-button:hover {
  background-color: #e04e51;
}

.login-button {
  background-color: #4e9df8;
  color: white;
  border: none;
  margin-top: 10px;
}

.login-button:hover {
  background-color: #3678d0;
}

/* Error Message */
.error {
  color: red;
  font-size: 0.9rem;
  margin-top: 15px;
}
</style>

<script setup>
import { ref } from "vue";
import auth from "../../firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();

function register() {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((data) => {
      router.push("/");
    })
    .catch((err) => (error.value = err));
}
</script>
