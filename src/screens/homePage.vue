<script setup>
import { ref } from "vue";
import navBar from "@/components/navBar.vue";
import CalendarComponent from "../components/Calender.vue";
import OrgCalendar from "../components/OrgCalender.vue";

const selectedCalendar = ref("myCalendar");
</script>
<template>
  <navBar />
  <div class="container">
    <!-- Welcome Back Header -->
    <div class="welcome-header">
      <h1>Welcome Back, {{ userName }}!</h1>
    </div>

    <div class="dropdown-container">
      <label for="calendar-select" class="dropdown-label"
        >Select Calendar:</label
      >
      <select
        id="calendar-select"
        v-model="selectedCalendar"
        class="dropdown-select"
      >
        <option value="myCalendar">My Calendar</option>
        <option value="orgCalendar">Organization Calendar</option>
      </select>
    </div>

    <!-- Conditional rendering of calendars -->
    <div v-if="selectedCalendar === 'myCalendar'">
      <h2>My Calendar</h2>
      <CalendarComponent />
    </div>

    <div v-else>
      <h2>Organization Calendar</h2>
      <OrgCalendar />
    </div>
  </div>
</template>

<style scoped>
/* Welcome Back Header */
.welcome-header {
  text-align: center;
  margin: 20px 0;
  padding: 20px;
  font-family: "Poppins", sans-serif; /* Modern, clean font */
}

.welcome-header h1 {
  font-size: 2rem; /* Large, bold font */
  color: #344563; /* Dark, neutral grey */
  margin-bottom: 10px; /* Space below the header */
}

.welcome-header p {
  font-size: 1rem; /* Smaller subtitle font */
  color: #6b778c; /* Softer grey for contrast */
  margin: 0; /* No extra margins */
}

/* Dropdown Container */
.dropdown-container {
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center; /* Align label and dropdown for a clean look */
  gap: 5px; /* Adds space between label and select box */
  font-family: "Poppins", sans-serif; /* Modern font for readability */
}

/* Label Styling */
.dropdown-label {
  font-weight: bold;
  font-size: 1.1rem;
  color: #344563; /* Neutral dark grey for contrast */
}

/* Dropdown Styling */
.dropdown-select {
  width: 100%; /* Ensures it spans the available width */
  max-width: 300px; /* Limits the dropdown width */
  padding: 8px 12px;
  border-radius: 8px; /* Soft, rounded edges */
  font-size: 1rem;
  font-weight: 500;
  background-color: #f4f5f7; /* Light grey background for a calming effect */
  border: 1px solid #dfe1e6; /* Subtle border for structure */
  color: #172b4d; /* Dark grey for text */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
  transition: all 0.3s ease; /* Smooth hover effects */
  appearance: none; /* Removes default browser styling */
  cursor: pointer;
}

/* Hover Effect */
.dropdown-select:hover {
  background-color: #e1e3e8; /* Slightly darker grey for hover effect */
  border-color: #0052cc; /* Accent color for hover interaction */
}

/* Focus Effect */
.dropdown-select:focus {
  outline: none;
  box-shadow: 0px 0px 5px 2px rgba(0, 82, 204, 0.5); /* Blue glow on focus */
  border-color: #0052cc; /* Blue border on focus */
}

/* Responsive Styling */
@media (max-width: 768px) {
  .dropdown-container {
    align-items: stretch; /* Ensures dropdown fits smaller screens */
  }

  .dropdown-select {
    width: 100%; /* Full-width for better mobile usability */
  }
}
</style>
