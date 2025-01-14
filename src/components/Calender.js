import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'

const calendar = new Calendar(calendar, {
  plugins: [dayGridPlugin],
  initialView: 'dayGridMonth'
});