import React, { useEffect, useState} from 'react';
import { Box } from '@mui/material';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.css'; // needs additional webpack config!
import bootstrapPlugin from '@fullcalendar/bootstrap';

export default function CalendarView () {

  const [events, setEvents] = useState([]);

  const setTrainings = (data) => {
    const events = data.map((item) =>  {
      return {title: `${item.activity}/${item.customer.firstname} ${item.customer.lastname}`, date: item.date}
    })
    setEvents(events)
  }

  useEffect(() => fetchData(), []);

  const fetchData = () => {
    fetch('https://customerrest.herokuapp.com/gettrainings')
    .then(response => response.json())
    .then(data => setTrainings(data))
}

  return (
    <Box>
    <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin, bootstrapPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'today prev,next',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
          color: '#777777',
          backgroundColor: '#eeeef0' 
        }}
        buttonIcons={false}
        buttonText={{
          today: 'Today',
          month: 'Month',
          week: 'Week',
          day: 'Day',
          list: 'Agenda',
          prev: 'Back',
          next: 'Next'
        }}
        themeSystem= 'bootstrap'
        events={events}
        />
    </Box>
  )
}