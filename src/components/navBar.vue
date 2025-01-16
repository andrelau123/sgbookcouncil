<template>
  <div class="header">
    <img src="../assets/logonobg.png" alt="Logo" class="logo" />
    <h2 class="portal-title">SBC Portal</h2>
  </div>
  <nav class="navbar">
    <div class="nav-links">
      <router-link to="/" active-class="activeclass" class="nav-link"
        >Home</router-link
      >
      <router-link to="/tasks" active-class="activeclass" class="nav-link"
        >Tasks</router-link
      >
      <router-link to="/aiPage" active-class="activeclass" class="nav-link"
        >AI</router-link
      >
    </div>

    <div class="nav-actions">
      <font-awesome-icon
        :icon="['fas', 'bell']"
        class="notification-bell"
        id="notificationDropdown"
        aria-expanded="false"
        @click="handleNotificationTabClick"
      />

      <div class="dropdown">
        <router-link
          to="/profile"
          class="profile-link dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          id="profileDropdown"
        >
          <img :src="profileimage" class="profile-icon" />
        </router-link>
        <ul
          class="dropdown-menu dropdown-menu-end profile"
          aria-labelledby="profileDropdown"
        >
          <li>
            <router-link to="/profile" class="dropdown-item"
              >Profile</router-link
            >
          </li>
          <li>
            <button class="dropdown-item" @click="handleLogout">Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useRouter } from "vue-router";
import { ref } from "vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

library.add(faBell);
const router = useRouter();
const profileimage = ref(require("../assets/profiledefault.png"));

function handleLogout() {
  signOut(auth);
  router.replace("/login");
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: #f4f5f7; /* Soft light grey background for focus */
  border-bottom: 2px solid #dfe1e6; /* Subtle border for separation */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* Soft shadow for depth */
  font-family: 'Poppins', sans-serif; /* Clean font */
  color: #172b4d; /* Neutral dark grey for text */
}

/* General Layout */
body {
  font-family: 'Poppins', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: #ffffff; /* Crisp white to improve contrast */
}

.header {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background-color: #dfe1e6; /* Soft grey to match Jira-like tones */
  color: #172b4d;
}

.logo {
  height: 50px;
  margin-right: 15px;
}

.portal-title {
  font-size: 2rem;
  font-weight: 600;
  color: #344563; /* Slightly darker grey for better contrast */
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: #172b4d;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 5px;
  transition: background-color 0.3s ease, color 0.3s ease;
  font-size: 1rem;
  font-weight: 500;
}

.nav-link:hover {
  background-color: #dfe1e6; /* Subtle hover effect */
  color: #0052cc; /* Accent blue for hover interaction */
}

.activeclass {
  background-color: #dfe1e6;
  color: #0052cc;
  font-weight: 600;
}

/* Actions */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.notification-bell {
  font-size: 1.5rem;
  cursor: pointer;
  color: #344563;
  transition: color 0.3s ease, transform 0.3s ease;
}

.notification-bell:hover {
  color: #0052cc; /* Accent color for hover */
  transform: scale(1.1); /* Subtle scaling for interactivity */
}

/* Dropdown */
.profile-link {
  text-decoration: none;
  color: #344563;
  cursor: pointer;
  transition: color 0.3s ease, transform 0.3s ease;
}

.profile-link:hover {
  color: #0052cc;
  transform: scale(1.05);
}

.dropdown-menu {
  background-color: white;
  border: 1px solid #dfe1e6;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
  text-decoration: none;
  color: #172b4d;
  padding: 8px 12px;
  display: block;
  border-radius: 5px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.dropdown-item:hover {
  background-color: #dfe1e6;
  color: #0052cc;
}

.profile-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .nav-links {
    flex-direction: column;
    gap: 15px;
    margin-bottom: 15px;
  }

  .nav-actions {
    flex-direction: column;
    gap: 15px;
  }
}

</style>
