<template>
  <div>
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
            class="profile-link"
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
              <button class="dropdown-item" @click="handleLogout">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<style scoped>
/* General Layout */
body {
  font-family: "Arial", sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.header {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background-color: #4e9df8;
  color: white;
}

.logo {
  height: 50px;
  margin-right: 15px;
}

.portal-title {
  font-size: 1.8rem;
  font-weight: bold;
}

/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-links {
  display: flex;
  gap: 15px;
}

.nav-link {
  color: #333;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 5px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.nav-link:hover {
  background-color: #4e9df8;
  color: white;
}

.activeclass {
  background-color: #4e9df8;
  color: white;
}

/* Actions */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.notification-bell {
  font-size: 1.5rem;
  cursor: pointer;
  color: #4e9df8;
  transition: color 0.3s ease;
}

.notification-bell:hover {
  color: #333;
}

/* Dropdown */
.profile-link {
  text-decoration: none;
  color: #4e9df8;
  cursor: pointer;
  transition: color 0.3s ease;
}

.profile-link:hover {
  color: #333;
}

.dropdown-menu {
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.dropdown-item {
  text-decoration: none;
  color: #333;
  padding: 8px 12px;
  display: block;
  border-radius: 3px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.dropdown-item:hover {
  background-color: #4e9df8;
  color: white;
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
    gap: 10px;
    margin-bottom: 15px;
  }

  .nav-actions {
    flex-direction: column;
    gap: 10px;
  }
}
</style>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useRouter } from "vue-router";
import { ref } from "vue";

library.add(faBell);
const router = useRouter();
const profileimage = ref(require("../assets/profiledefault.png"));

function handleLogout() {
  signOut(auth);
  router.replace("/login");
}
</script>
