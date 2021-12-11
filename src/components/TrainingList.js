import React, { useEffect, useState} from 'react';
import MaterialTable from 'material-table';
import { IconButton, Snackbar } from '@mui/material';
import { forwardRef } from 'react';
import { Close, AddBox, ArrowDownward, Check, ChevronLeft, 
  ChevronRight, Search, Clear, LastPage, FirstPage, FilterList, SaveAlt, Edit, DeleteOutline} from '@mui/icons-material';
import { format } from 'date-fns'

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

export default function TrainingList() {
    
  const [trainings, setTrainings] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => fetchData(), []);

  const fetchData = () => {
      fetch('https://customerrest.herokuapp.com/gettrainings')
      .then(response => response.json())
      .then(data => setTrainings(data))
  }

  const columns = [
    { title: 'Activity', field: 'activity' },
    { title: 'Date', field: 'date', render: rowData => format(new Date(rowData.date), "dd.MM.yyyy hh:mm a") },
    { title: 'Duration (min)', field: 'duration' },
    { title: 'Customer', render: rowData => rowData.customer ? `${rowData.customer.firstname} ${rowData.customer.lastname}` : ''},
  ];

  const deleteRow = (id) => {
    if (window.confirm('Are you sure?')) {
      fetch(`https://customerrest.herokuapp.com/api/trainings/${id}`, {method: 'DELETE'})
      .then(res => fetchData())
      .catch(err => console.error(err))

      setOpen(true);
    }  
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        style={{background: 'red'}}
        onClick={handleClose}
      >
        <Close fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <>
      <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          message="Training deleted"
          action={action}
        />
    <MaterialTable
      icons={tableIcons}
      columns={columns}
      data={trainings}
      title="Trainings"
      options={{
        search: true,
        sorting: true,
      }}
      editable={{
        isEditable: rowData => false, 
        isEditHidden: rowData => true,
        isDeletable: rowData => true,
        isDeleteHidden: rowData => false,
        onRowAddCancelled: rowData => console.log('Row adding cancelled'),
        onRowUpdateCancelled: rowData => console.log('Row editing cancelled'),
        onRowDelete: oldData =>
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    deleteRow(oldData.id);

                    resolve();
                }, 1000);
            })
    }}
    /></>
  )
}