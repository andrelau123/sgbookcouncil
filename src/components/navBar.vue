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

    <div class="d-flex ms-auto align-items-center">
      <div class="d-flex align-items-center dropdown me-3 position-relative">
        <font-awesome-icon
          :icon="['fas', 'bell']"
          class="notification-bell"
          id="notificationDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          @click="handleNotificationTabClick"
        />
        <span v-if="notificationCount > 0" class="notification-badge">{{
          notificationCount
        }}</span>

        <div
          class="dropdown-menu dropdown-menu-end p-3"
          aria-labelledby="notificationDropdown"
        >
          <p class="mb-2 fw-bold">
            You have {{ notificationCount }} new notifications.
          </p>

          <ul v-if="notifications.length > 0" class="notification-list">
            <li
              v-for="notification in notifications"
              :key="notification.eventId"
              class="notification-item mb-2 p-2"
            >
              {{ notification.message }}
            </li>
          </ul>

          <p v-else class="text-muted">No new notifications at this time.</p>

          <!-- Style for the 'Mark all as read' button to make it more prominent -->
          <button
            v-if="notifications.length > 0"
            class="btn btn-sm btn-primary mt-2"
            @click="clearNotifications"
          >
            Mark all as read
          </button>
        </div>
      </div>

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
import { signOut, onAuthStateChanged } from "firebase/auth";
import {
  auth,
  db,
  doc,
  getDocs,
  collection,
  query,
  where,
  writeBatch,
} from "../../firebase";
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { useIntervalFn } from "@vueuse/core";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

library.add(faBell);
const router = useRouter();
const profileimage = ref(require("../assets/profiledefault.png"));
const user = ref(null);
const meeting = ref([]);
const notificationCount = ref(0); // Count of events within 24 hours
const notifications = ref([]); // Store upcoming events for display
const events = ref([]);
const dismissedNotifications = new Set();
const isDropdownOpen = ref(false);

function handleLogout() {
  signOut(auth);
  router.replace("/login");
}

const fetchAndMonitorEvents = async () => {
  onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      const meetingRef = collection(db, "users", currentUser.email, "meeting");
      const snapshot = await getDocs(meetingRef);
      events.value = [];
      meeting.value = snapshot.docs.map((doc) => doc.id);
      const currentTime = new Date();

      notifications.value = [];
      notificationCount.value = 0;
      events.value = [];
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      // Query to get events that are undismissed and in the future
      const eventsRef = collection(db, "users", currentUser.email, "meeting");
      const eventsQuery = query(eventsRef, where("dismissed", "==", false));

      const tasksRef = collection(db, "users", currentUser.email, "tasks");
      const tasksQuery = query(tasksRef, where("dismissed", "==", false));

      const eventsSnapshot = await getDocs(eventsQuery);
      const tasksSnapshot = await getDocs(tasksQuery);
      eventsSnapshot.forEach((doc) => {
        const eventData = doc.data();
        const eventDate = new Date(eventData.start);
        if (eventDate > currentTime) {
          events.value.push({
            meetingId: doc.id,
            ...eventData,
            eventId: doc.id,
          });
        }
      });

      tasksSnapshot.forEach((doc) => {
        const taskdata = doc.data();
        const taskdate = new Date(taskdata.dueDate);
        if (taskdate > currentTime) {
          events.value.push({
            taskId: doc.id,
            ...taskdata,
            eventId: doc.id,
          });
        }
      });

      // Check for events within the next 24 hours
      events.value.forEach((event) => {
        if (event.start) {
          const eventDate = new Date(event.start);
          const timeDifference = eventDate - currentTime;
          if (timeDifference > 0 && timeDifference <= 24 * 60 * 60 * 1000) {
            notifications.value.push({
              message: `You have a meeting at ${eventDate.toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )} for ${event.title}.`,
              eventId: event.eventId, //docid
              timeRemaining: Math.floor(timeDifference / (60 * 60 * 1000)), // Hours remaining
              meetingId: event.meetingId, //docid
            });
            notificationCount.value += 1;
          }
          //check events for in 1 wk
          else if (
            timeDifference > 0 &&
            timeDifference <= 24 * 60 * 60 * 1000 * 7
          ) {
            notifications.value.push({
              message: `You have a meeting at ${eventDate.toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )} on ${eventDate.getDate()} ${
                months[eventDate.getMonth()]
              } for ${event.title}.`,
              eventId: event.eventId,
              timeRemaining: Math.floor(timeDifference / (60 * 60 * 1000)), // Hours remaining
              meetingId: event.meetingId,
            });
            notificationCount.value += 1;
          }
        } else {
          //task in 24h
          const taskdate = new Date(event.dueDate);
          const timeDifference = taskdate - currentTime;
          if (timeDifference > 0 && timeDifference <= 24 * 60 * 60 * 1000) {
            notifications.value.push({
              message: `You have a task due at ${taskdate.toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )} for ${event.title}.`,
              eventId: event.eventId,
              timeRemaining: Math.floor(timeDifference / (60 * 60 * 1000)), // Hours remaining
              taskId: event.taskId,
            });
            notificationCount.value += 1;
          }
        }
      });
    }
  });
};

const clearNotifications = async () => {
  const currentUser = auth.currentUser;
  console.log(notifications.value);
  if (currentUser) {
    const batch = writeBatch(db);
    notifications.value.forEach((notification) => {
      if (!notification.taskId) {
        const eventRef = doc(
          db,
          "users",
          currentUser.email,
          "meeting",
          notification.meetingId
        );
        batch.update(eventRef, { dismissed: true }); // Update dismissed status to true
      } else {
        const eventRef = doc(
          db,
          "users",
          currentUser.email,
          "tasks",
          notification.taskId
        );
        batch.update(eventRef, { dismissed: true });
      }
    });

    await batch.commit();

    notifications.value = [];
    notificationCount.value = 0;
  }
};

const handleNotificationTabClick = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const { pause, resume } = useIntervalFn(fetchAndMonitorEvents, 30 * 60 * 1000, {
  immediate: true,
});

onMounted(() => {
  fetchAndMonitorEvents();
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
  });
});
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
  font-family: "Poppins", sans-serif; /* Clean font */
  color: #172b4d; /* Neutral dark grey for text */
}

/* General Layout */
body {
  font-family: "Poppins", sans-serif;
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

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ff3b3b;
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 50%;
  font-weight: bold;
}

/* Notification Badge */
.notification-badge {
  background-color: #dc3545; /* Red badge for visibility */
  color: white;
  border-radius: 50%;
  padding: 2px 8px;
  font-size: 0.75rem;
  position: absolute;
  top: 8px;
  right: 8px;
}

/* Notification Dropdown */
.dropdown-menu {
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fbf4eb !important;
}
.dropdown-menu-end {
  width: 250px;
  right: 0;
  left: auto;
}
.profile {
  width: 150px !important;
}
/* Notification List Styling */
.notification-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Notification Item Styling */
.notification-item {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  transition: background-color 0.3s;
  font-family: "Segoe UI", Arial, sans-serif;
}

.notification-item:hover {
  background-color: #e9ecef;
  cursor: pointer;
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
