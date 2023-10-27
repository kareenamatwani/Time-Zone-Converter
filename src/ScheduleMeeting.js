import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment-timezone';

function ScheduleMeeting({ selectedTimeZones, eventDurationMinutes }) {
    const createGoogleCalendarLink = () => {
      if (isNaN(eventDurationMinutes) || eventDurationMinutes <= 0) {
        // Handle the case where eventDurationMinutes is not a valid number
        alert('Invalid event duration');
        return;
      }
  
      // Replace 'Asia/Calcutta' with the desired timezone
      const timeZone = 'Asia/Calcutta'; 
      const startTime = moment().tz(timeZone); // Use moment-timezone for working with timezones
      const endTime = startTime.clone().add(eventDurationMinutes, 'minutes');
  
      // Format the start and end times
      const startTimeStr = startTime.format();
      const endTimeStr = endTime.format();
  
      // Create the event details including the selected time zones
      const eventDetails = encodeURIComponent(`Meeting in different time zones:\n\n${selectedTimeZones.join('\n')}\n\nSchedule with Time Zone Converter by Kareena Matwani`);
      
      // Replace 'Online' and 'Scheduled Meeting' with the desired location and event name
      const location = encodeURIComponent('Online');
      const eventName = encodeURIComponent('Scheduled Meeting');
  
      // Construct the Google Calendar link
      const googleCalendarLink = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${eventName}&dates=${startTimeStr}/${endTimeStr}&ctz=${timeZone}&details=${eventDetails}&location=${location}&sprop=sprop=name:`;
  
      // Open the link in a new tab
      window.open(googleCalendarLink, '_blank');
    };
  
    return (
      <button onClick={createGoogleCalendarLink}>
        <FontAwesomeIcon icon={faCalendar} />
      </button>
    );
  }
  
export default ScheduleMeeting;
