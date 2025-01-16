<template>
  <NavBar />
  <div class="profile-container">
    <h1>My Profile</h1>
    <!-- Profile Image -->
    <label for="profile-image-upload" class="profile-image-label">
      <img
        :src="profileImage || '../assets/profiledefault.png'"
        class="profile-image"
        alt="Profile Image"
      />
      <input
        type="file"
        id="profile-image-upload"
        accept="image/*"
        @change="uploadProfileImage"
        hidden
      />
    </label>
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

<script setup>
import NavBar from "@/components/navBar.vue";
import { ref, onMounted } from "vue";
import { auth, db, storage } from "../../firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const name = ref("");
const age = ref("");
const id = ref("");
const email = ref(auth.currentUser.email);
const phone = ref("");
const profileImage = ref("");
const isSaved = ref(false);

onMounted(async () => {
  const docreff = doc(db, "users", auth.currentUser.email);
  const userDocSnapshot = await getDoc(docreff);

  if (userDocSnapshot.exists) {
    const userData = userDocSnapshot.data();
    name.value = userData.name;
    age.value = userData.age;
    id.value = userData.id;
    email.value = userData.email || auth.currentUser.email;
    phone.value = userData.phone;
    profileImage.value = userData.profileImage || ""; // Load existing profile image URL
  }
});

async function uploadProfileImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  const imageRef = storageRef(
    storage,
    `profile-images/${auth.currentUser.email}/${file.name}`
  );

  try {
    await uploadBytes(imageRef, file);
    const imageURL = await getDownloadURL(imageRef);
    profileImage.value = imageURL;

    // Save the image URL to Firestore
    const docref = doc(db, "users", auth.currentUser.email);
    await updateDoc(docref, {
      profileImage: imageURL,
    });

    console.log("Profile image uploaded and saved successfully.");
  } catch (error) {
    console.error("Error uploading profile image:", error);
  }
}

async function savedetails() {
  const docref = doc(db, "users", auth.currentUser.email);

  // Create an object with fields that were modified
  const updatedFields = {};

  if (name.value) updatedFields.name = name.value;
  if (age.value) updatedFields.age = age.value;
  if (id.value) updatedFields.id = id.value;
  if (phone.value) updatedFields.phone = phone.value;
  if (profileImage.value) updatedFields.profileImage = profileImage.value;

  // Update Firestore with the modified fields
  if (Object.keys(updatedFields).length > 0) {
    await updateDoc(docref, updatedFields);
    console.log("Details updated successfully.");

    isSaved.value = true;
    setTimeout(() => {
      isSaved.value = false;
    }, 3000);
  }
}
</script>

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

.profile-image-label {
  cursor: pointer;
  display: inline-block;
  position: relative;
}

.profile-image-label:hover .profile-image {
  opacity: 0.8;
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
