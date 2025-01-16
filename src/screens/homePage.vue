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
		<div class="dropdown-container" style="margin-bottom: 20px">
			<label
				for="calendar-select"
				style="margin-right: 10px; font-weight: bold"
				>Select Calendar:</label
			>
			<select
				id="calendar-select"
				v-model="selectedCalendar"
				style="padding: 5px; border-radius: 5px; font-size: 1rem"
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
