import React, { useEffect, useState} from 'react';
import { Box } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Label } from 'recharts';
import _ from 'lodash';

export default function StatisticsView () {

  const [summedEvents, setSummedEvents] = useState([]);

  const setTrainings = (data) => {
    const events = data.map((item) =>  {
      return {activity: item.activity, duration: item.duration}
    })
    const groupedEvents = _.groupBy(events,'activity')
    const summed = Object.entries(groupedEvents).map((item) => {
      return {activity: item[0], duration: _.sumBy(item[1],'duration')}
    });
    setSummedEvents(summed)
  }

  useEffect(() => fetchData(), []);

  const fetchData = () => {
    fetch('https://customerrest.herokuapp.com/gettrainings')
    .then(response => response.json())
    .then(data => setTrainings(data))
  }

  return (
    <Box style={{height: '60vh'}}>
      <ResponsiveContainer width="100%" height="100%">
          <BarChart width={600} height={600} data={summedEvents} margin={{ top: 5, right: 5, left: 40, bottom: 5 }}>
            <XAxis dataKey="activity" />
            <YAxis type="number">
              <Label fontSize={20} fontFamily="Arial" position="left" angle={-90} value="Duration (min)"/>
            </YAxis>            
            <Bar dataKey="duration" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  )
}