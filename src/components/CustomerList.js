import React, { useEffect, useState} from 'react';
import MaterialTable from 'material-table';
import { forwardRef } from 'react';
import { AddBox, ArrowDownward, Check, ChevronLeft, 
  ChevronRight, Search, Clear, LastPage, FirstPage, FilterList, SaveAlt, Edit, DeleteOutline} from '@mui/icons-material';

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
    
  const [customers, setCustomers] = useState([]);

  useEffect(() => fetchData(), []);

  const fetchData = () => {
      fetch('https://customerrest.herokuapp.com/api/customers')
      .then(response => response.json())
      .then(data => setCustomers(data.content))  
  }

  const columns = [
    { title: 'First name', field: 'firstname' },
    { title: 'Last name', field: 'lastname' },
    { title: 'Email', field: 'email' },
    { title: 'Phone', field: 'phone' },
    { title: 'Address', field: 'streetaddress'},
    { title: 'Postcode', field: 'postcode'},
    { title: 'City', field: 'city'}
  ];

  return (
    <MaterialTable
      icons={tableIcons}
      columns={columns}
      data={customers}
      title="Customers"
      options={{
        search: true,
        sorting: true,
      }}
    />
  )
}