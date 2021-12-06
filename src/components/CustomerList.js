import React, { useEffect, useState} from 'react';
import MaterialTable from 'material-table';
import { forwardRef } from 'react';
import { alpha } from '@material-ui/core/styles';
import { Button, Drawer, List, ListItem, Box, Divider, ListItemText, ListItemIcon} from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

export default function CustomerList() {
    
    const [customers, setCustomers] = useState([]);
    const [state, setState] = React.useState(false);

    useEffect(() => fetchData(), []);

    const fetchData = () => {
        fetch('https://customerrest.herokuapp.com/api/customers')
        .then(response => response.json())
        .then(data => setCustomers(data.content))  
    }

    const saveCustomer = (customer) => {
      fetch('https://customerrest.herokuapp.com/api/customers', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'
      }, body: JSON.stringify(customer)
      })
      .then(res => fetchData())
      .catch(err => console.error(err));
    }

    const updateCustomer = (link, customer) => {
      fetch(link, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'
      }, body: JSON.stringify(customer)
      })
      .then(res => fetchData())
      .catch(err => console.error(err));
  
    }; 

    const deleteCustomer = (link) => {
      fetch(link, {method: 'DELETE'})
      .then(res => fetchData())
  };

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
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

    const columns = [
      { title: 'First name', field: 'firstname' },
      { title: 'Last name', field: 'lastname' },
      { title: 'Email', field: 'email' },
      { title: 'Phone', field: 'phone' },
      { title: 'Address', field: 'streetaddress'},
      { title: 'Post code', field: 'postcode'},
      { title: 'city', field: 'city'}];
   
  return (
      <div>
        <>
          <Button onClick={toggleDrawer(true)}>drawer</Button>
          <Drawer
            open={state}
            onClose={toggleDrawer(false)}
          >
            {list()}
          </Drawer>
        </>
        ))}
        <MaterialTable
          icons={tableIcons}
          columns={columns}
          data={customers}
          title="Customers"
          options={{
            search: true,
            sorting: true,
          }}
          editable={{
            isEditable: row => true,
            isDeletable: row => true,
            onRowAddCancelled: rowData => console.log('Row adding cancelled'),
            onRowUpdateCancelled: rowData => console.log('Row editing cancelled'),
            onRowAdd: newData =>
            new Promise((resolve, reject) => {
              console.log("save", newData);
                setTimeout(() => {
                    saveCustomer(newData);
                    resolve();
                }, 1000);
            }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                console.log("save", newData, oldData);
                  setTimeout(() => {
                      updateCustomer(oldData.links[0].href, newData)

                      resolve();
                  }, 1000);
              }),
            onRowDelete: oldData =>
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    deleteCustomer(oldData.links[0].href)

                    resolve();
                }, 1000);
            })
        }}
        />
      </div> 
    );
}