<template>
  <div class="login-container">
    <div class="login-box">
      <img src="../assets/logonobg.png" />
      <h2 class="subtitle">SGBOOKCOUNCIL PORTAL</h2>
      <h1 class="title">LOGIN</h1>
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

  background-image: url("@/assets/bg.jpg"); /* Replace with your image path */
  background-size: cover; /* Ensures the image covers the entire screen */
  background-position: center; /* Centers the image */
  background-repeat: no-repeat; /* Prevents tiling */
  min-height: 100vh; /* Ensures the background covers the full height of the viewport */
}

/* Global Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Arial", sans-serif;
  background-color: #fffae1; /* Soft yellow background */
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

  background-image: url("@/assets/bg.jpg"); /* Retaining your image background */
  background-size: cover; /* Ensures the image covers the entire screen */
  background-position: center; /* Centers the image */
  background-repeat: no-repeat; /* Prevents tiling */
  min-height: 100vh; /* Ensures the background covers the full height of the viewport */
}

.login-box {
  background-color: rgba(
    255,
    255,
    255,
    0.85
  ); /* Slightly transparent white background for contrast */
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15); /* Soft shadow for depth */
  width: 320px;
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
  padding: 12px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  transition: border 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #ff9800; /* Yellow focus border for consistency */
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
  background-color: #ff5a5f; /* Soft red for sign-up button */
  color: white;
  border: none;
}

.signup-button:hover {
  background-color: #e04e51; /* Darker red on hover */
}

.login-button {
  background-color: #4e9df8; /* Soft blue for login button */
  color: white;
  border: none;
  margin-top: 10px;
}

.login-button:hover {
  background-color: #3678d0; /* Darker blue on hover */
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
import { auth, db } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "vue-router";
import { collection, setDoc, addDoc, doc } from "firebase/firestore";

const email = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();

function register() {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((data) => {
      router.push("/");
      console.log(data.user.email);
      const docref = doc(db, "users", data.user.email);
      setDoc(docref, { profile: [] });
    })
    .catch((err) => (error.value = err));
}

function login() {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((data) => {
      router.push("/");
    })
    .catch((err) => (error.value = err));
}
</script>
