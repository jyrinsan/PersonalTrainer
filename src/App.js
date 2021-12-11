import React from 'react';
import { Box, IconButton, AppBar, Toolbar, Typography } from '@mui/material';
import { Drawer, List, ListItem, Divider, ListItemText, ListItemIcon } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CustomerIcon from '@mui/icons-material/AccountBox';
import TrainingIcon from '@mui/icons-material/DirectionsRun';
import EventIcon from '@mui/icons-material/Event';
import CustomerList from './components/CustomerList';
import TrainingList from './components/TrainingList';
import CalendarView from './components/CalendarView';

function App() {

  const [state, setState] = React.useState(false);
  const [view, setView] = React.useState('customers');


  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState(open);
  };

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
          <ListItem button key="Back">
            <ListItemIcon>
            <ChevronLeftIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText primary="" />
          </ListItem>
      </List>
      <Divider />
      <List>
          <ListItem button key="Customers" onClick={() => setView('customers')}>
            <ListItemIcon>
              <CustomerIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText primary="Customers" />
          </ListItem>
          <ListItem button key="Trainings" onClick={() => setView('trainings')}>
            <ListItemIcon>
              <TrainingIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText primary="Trainings" />
          </ListItem>
          <ListItem button key="Calendar" onClick={() => setView('calendar')}>
            <ListItemIcon>
              <EventIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText primary="Calendar" />
          </ListItem>
      </List>
    </Box>
  );


  return (
    <Box sx={{ flexGrow: 1 }}>
      <Drawer
          open={state}
          onClose={toggleDrawer(false)}
        >
          {list()}
      </Drawer>
      <AppBar position="static" style={{color: '#fff', background: '#3f50b5'}}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            PersonalTrainer
          </Typography>
        </Toolbar>
      </AppBar>
      {state ?
        (<Box sx={{ float: 'right', margin: 2, width: '80%' }}>
          {view === 'customers' &&
          <CustomerList />}
          {view === 'trainings' &&
          <TrainingList />}
          {view === 'calendar' &&
          <CalendarView />}
          </Box>) :
        (<Box sx={{ float: 'right', margin: 2, width: '98%' }}>
          {view === 'customers' &&
          <CustomerList />}
          {view === 'trainings' &&
          <TrainingList />}
          {view === 'calendar' &&
          <CalendarView />}
        </Box>)}
    </Box>
  )
}

export default App;