<template>
  <NavBar />
  <div class="profile-container">
    <h1>My Profile</h1>
    <img src="../assets/profiledefault.png" class="profile-image" />
    <div class="profile-fields">
      <h2>Name:</h2>
      <input
        placeholder="Name"
        v-model="name"
        type="text"
        class="profile-input"
      />
      <h2>Age:</h2>
      <input
        placeholder="Age"
        v-model="age"
        type="number"
        class="profile-input"
      />
      <h2>ID Number:</h2>
      <input
        placeholder="ID Number"
        v-model="id"
        type="text"
        class="profile-input"
      />
      <h2>Email:</h2>
      <input
        placeholder="Email"
        v-model="email"
        type="email"
        class="profile-input"
      />
      <h2>Phone Number:</h2>
      <input
        placeholder="Phone number"
        v-model="phone"
        type="text"
        class="profile-input"
      />
    </div>
    <div class="save-button">
      <button @click="savedetails" class="btn-save">Save details</button>
    </div>

    <!-- Success message -->
    <div v-if="isSaved" class="success-message">
      <p>Your details have been saved successfully!</p>
    </div>
  </div>
</template>

<style scoped>
/* General Layout */
.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f5f7fb;
  border-radius: 8px;
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.profile-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 20px;
  border: 3px solid #4e9df8;
}

.profile-fields {
  width: 100%;
  margin-bottom: 20px;
}

h2 {
  font-size: 1.2rem;
  color: #333;
  margin: 10px 0;
}

.profile-input {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 15px;
  background-color: #fff;
  box-sizing: border-box;
}

.profile-input:focus {
  border-color: #4e9df8;
  outline: none;
}

.save-button {
  margin-top: 20px;
}

.btn-save {
  background-color: #4e9df8;
  color: white;
  font-size: 1rem;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-save:hover {
  background-color: #338fd1;
}

.success-message {
  margin-top: 20px;
  background-color: #d4edda;
  color: #155724;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #c3e6cb;
}

@media (max-width: 768px) {
  .profile-container {
    width: 90%;
    padding: 15px;
  }

  h1 {
    font-size: 1.6rem;
  }

  .profile-image {
    width: 120px;
    height: 120px;
  }
}
</style>

const isSaved = ref(false); // This will control the success message visibility
function savedetails() { // Logic for saving details (you can use Firebase or
any other method here) // Simulate a successful save isSaved.value = true; //
Hide the success message after a few seconds setTimeout(() => { isSaved.value =
false; }, 3000); // Hide the message after 3 seconds }

<script setup>
import NavBar from "@/components/navBar.vue";
import { onMounted, ref } from "vue";
import { auth, db } from "../../firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";

const name = ref("");
const age = ref("");
const id = ref("");
const email = ref(auth.currentUser.email);
const phone = ref("");
const isSaved = ref(false);

onMounted(async () => {
  const docreff = doc(db, "users", auth.currentUser.email);
  const userDocSnapshot = await getDoc(docreff);

  if (userDocSnapshot.exists) {
    name.value = userDocSnapshot.data().name;
    age.value = userDocSnapshot.data().age;
    id.value = userDocSnapshot.data().id;
    email.value = userDocSnapshot.data().email;
    phone.value = userDocSnapshot.data().phone;
  }
});

function savedetails() {
  const docref = doc(db, "users", auth.currentUser.email);
  updateDoc(docref, {
    name: name.value,
    age: age.value,
    id: id.value,
    email: email.value,
    phone: phone.value,
  });
  isSaved.value = true;
  setTimeout(() => {
    isSaved.value = false;
  }, 3000);
}
</script>
