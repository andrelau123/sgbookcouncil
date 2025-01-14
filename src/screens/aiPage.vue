<template>
  <navBar />
  <h1>AI Summariser</h1>
  <h2>Input your email text here!</h2>
  <textarea
    placeholder="Email text"
    v-model="email"
    rows="5"
    cols="50"
  ></textarea>
  <button @click="handlesummary" :disabled="loading">Summarise!!</button>

  <!-- Loading Spinner -->
  <div v-if="loading" class="loading-spinner">
    <div class="spinner"></div>
    <p>Loading...</p>
  </div>

  <!-- Response Box -->
  <div v-if="messresponse" class="response-box">
    <p><strong>Response:</strong></p>
    <p>{{ messresponse }}</p>
  </div>
</template>

<style scoped>
/* Center the content and provide padding */
h1 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-top: 50px;
}

h2 {
  text-align: center;
  font-size: 1.5rem;
  color: #666;
  margin-top: 10px;
}

textarea {
  display: block;
  margin: 20px auto;
  padding: 12px;
  width: 80%;
  max-width: 600px;
  border: 2px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
  resize: vertical; /* Allows vertical resizing */
}

textarea:focus {
  border-color: #4e73df;
  box-shadow: 0 0 5px rgba(78, 115, 223, 0.5);
}

button {
  display: block;
  margin: 20px auto;
  padding: 12px 20px;
  background-color: #4e73df;
  color: white;
  font-size: 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #375aeb;
}

.response-box {
  background-color: #f4f4f9;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 600px;
  margin: 20px auto;
  border: 2px solid #ccc;
  font-size: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.response-box p {
  margin: 10px 0;
  color: #333;
  line-height: 1.6;
}

.response-box strong {
  font-weight: bold;
  color: #4e73df;
}

.loading-spinner {
  text-align: center;
  padding: 20px;
}

.spinner {
  border: 4px solid #f3f3f3; /* Light gray */
  border-top: 4px solid #4e73df; /* Blue color for the spinner */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

<script setup>
import navBar from "@/components/navBar.vue";
import { auth, db } from "../../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { ref } from "vue";
import { addDoc, collection } from "firebase/firestore";

const email = ref("");
const messresponse = ref("");
const loading = ref(false);

const emailuser = auth.currentUser.email;

async function handlesummary() {
  loading.value = true; // Start loading
  console.log("test");
  const messageref = collection(db, "users", emailuser, "messages");
  console.log("0");
  const docref = await addDoc(messageref, {
    prompt: email.value + "summarise this for me",
    timestamp: new Date(),
    message: [],
  });
  console.log("1");

  console.log(docref.id);

  listenforresponse(docref.id);
  console.log("3");
}

function listenforresponse(parentmessid) {
  console.log("4");
  console.log(emailuser);
  console.log(parentmessid);
  const messageDocRef = doc(db, "users", emailuser, "messages", parentmessid);
  console.log("5");
  onSnapshot(messageDocRef, (doc) => {
    if (doc.exists) {
      messresponse.value = doc.data().response;
      loading.value = false; // Stop loading once we have the response
      console.log(messresponse.value);
    }
  });
}
</script>
