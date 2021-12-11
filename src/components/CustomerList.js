import React, { useEffect, useState} from 'react';
import MaterialTable from 'material-table';
import { Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, FormControl } from '@mui/material';
import { forwardRef } from 'react';
import { AddBox, ArrowDownward, Check, ChevronLeft, 
  ChevronRight, Search, Clear, LastPage, FirstPage, FilterList, SaveAlt, Edit, DeleteOutline } from '@mui/icons-material';
import { LocalizationProvider, DateTimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import fiLocale from 'date-fns/locale/fi';

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
};

export default function CustomerList() {
    
  const [open, setOpen] = React.useState(false);
  const [customers, setCustomers] = useState([]);
  const [training, setTraining] = useState({activity: '', date: Date(), duration: '', customer: ''});

  useEffect(() => fetchData(), []);

  const fetchData = () => {
      fetch('https://customerrest.herokuapp.com/api/customers')
      .then(response => response.json())
      .then(data => setCustomers(data.content))  
  }

  const columns = [
    { title: '', render: rowData => 
      <Button
        onClick={() => {
          setTraining({...training, customer: rowData.links[0].href})
          setOpen(true);
        }}
      >
      ADD TRAINING
      </Button> },
    { title: 'First name', field: 'firstname' },
    { title: 'Last name', field: 'lastname' },
    { title: 'Email', field: 'email' },
    { title: 'Phone', field: 'phone' },
    { title: 'Address', field: 'streetaddress'},
    { title: 'Postcode', field: 'postcode'},
    { title: 'City', field: 'city'}
  ];

  const handleInputChange = (event) => {
    setTraining({...training, [event.target.name]: event.target.value})
}

  const addRow = (newData) => {
    fetch('https://customerrest.herokuapp.com/api/customers', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'
    }, body: JSON.stringify(newData)
    })
    .then(res => fetchData())
    .catch(err => console.error(err));
  }

  const updateRow = (link, updatedData) => {
    fetch(link, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'
    }, body: JSON.stringify(updatedData)
    })
    .then(res => fetchData())
    .catch(err => console.error(err));
    
  }

  const deleteRow = (link) => {
    if (window.confirm('Are you sure?')) {
      fetch(link, {method: 'DELETE'})
      .then(res => fetchData())
      .catch(err => console.error(err))
    }  
  }

  const addTraining = () => {
    console.log('training', training)
    fetch('https://customerrest.herokuapp.com/api/trainings', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'
    }, body: JSON.stringify(training)
    })
    .then(res => fetchData())
    .catch(err => console.error(err));

    setOpen(false);
  }

  const dateChanged = (date) => {
    setTraining({...training, 'date': date.toISOString()});
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>New training</DialogTitle>
        <DialogContent>
          <FormControl>
        <TextField
            autoFocus
            margin="normal"
            variant="standard"
            name="activity"
            value={training.activity}
            label="Activity"
            onChange={e => handleInputChange(e)}
            fullWidth
        />
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={fiLocale}>
          <DateTimePicker
            renderInput={(props) => <TextField fullWidth variant="standard" {...props} />}
            value={training.date}
            label="Date"
            disableMaskedInput={true}
            onChange={(date) => {
              dateChanged(date);
            }}
          />
        </LocalizationProvider>
        <TextField
            margin="normal"
            variant="standard"
            name="duration"
            value={training.duration}
            label="Duration"
            onChange={e => handleInputChange(e)}
            fullWidth
        />
        </FormControl>
        </DialogContent>
        <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={() => addTraining()}>Save</Button>
        </DialogActions>
    </Dialog>
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
        isEditable: rowData => true, 
        isEditHidden: rowData => false,
        isDeletable: rowData => true,
        isDeleteHidden: rowData => false,
        onRowAddCancelled: rowData => console.log('Row adding cancelled'),
        onRowUpdateCancelled: rowData => console.log('Row editing cancelled'),
        onRowAdd: newData =>
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    addRow(newData);
                    resolve();
                }, 1000);
            }),
        onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    updateRow(oldData.links[0].href, newData);

                    resolve();
                }, 1000);
            }),
        onRowDelete: oldData =>
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    deleteRow(oldData.links[0].href);

                    resolve();
                }, 1000);
            })
    }}
    />
    </LocalizationProvider>
  )
}