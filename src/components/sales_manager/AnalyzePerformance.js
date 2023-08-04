import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import ManageInvoicesListItem from './ManageInvoicesListItem';
import SMHeader from './SMHeader';
import Box from '@mui/material/Box';
import { Button, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import firebase from 'firebase';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import ManageInvoicesListHead from './ManageInvoicesListHead';
import RevenueGraph from './RevenueGraph';
import Paper from '@mui/material/Paper';

function AnalyzePerformance() {
    const [orders, setOrders] = useState([]);
    const [noOrders, setNoOrders] = useState(false);
    const [allSelected, setAllSelected] = useState(false);
  
    async function getOrders() {
      db.collection('orders').orderBy('timeStamp', 'desc').onSnapshot(snapshot => {
        setOrders(snapshot.docs.map(doc => doc.data()));
        setNoOrders(orders.length === 0);
        setAllSelected(true);
      })
    }

    // when the app loads, we need to listen to the database and fetch new todos as they get added/removed
    useEffect(() => {
        // this code fires when the app.js loads
        getOrders();
    }, []);

    async function sortByConfirmed() {
      db.collection('orders').where('status', '==', 'confirmed').onSnapshot(snapshot => {
        setOrders(snapshot.docs.map(doc => doc.data()));
        setNoOrders(orders.length === 0);
        setAllSelected(false);
      })
    }

    async function sortByInTransit() {
      db.collection('orders').where('status', '==', 'inTransit').onSnapshot(snapshot => {
        setOrders(snapshot.docs.map(doc => doc.data()));
        setNoOrders(orders.length === 0);
        setAllSelected(false);
      })
    }

    async function sortByDelivered() {
      db.collection('orders').where('status', '==', 'delivered').onSnapshot(snapshot => {
        setOrders(snapshot.docs.map(doc => doc.data()));
        setNoOrders(orders.length === 0);
        setAllSelected(false);
      })
    }

    async function sortByCancelled() {
      db.collection('orders').where('status', '==', 'cancelled').onSnapshot(snapshot => {
        setOrders(snapshot.docs.map(doc => doc.data()));
        setNoOrders(orders.length === 0);
        setAllSelected(false);
      })
    }

    async function sortByReturnRequested() {
      db.collection('orders').where('status', '==', 'returnRequested').onSnapshot(snapshot => {
        setOrders(snapshot.docs.map(doc => doc.data()));
        setNoOrders(orders.length === 0);
        setAllSelected(false);
      })
    }

    async function sortByReturnProcessed() {
      db.collection('orders').where('status', '==', 'returnProcessed').onSnapshot(snapshot => {
        setOrders(snapshot.docs.map(doc => doc.data()));
        setNoOrders(orders.length === 0);
        setAllSelected(false);
      })
    }

    var date = new Date();
    var dateToday = date.getDate();
    var monthToday = date.getMonth();
    var yearToday = date.getFullYear();
    const [fromDate, setFromDate] = React.useState(new Date(2022, 2, 1));
    const [tillDate, setTillDate] = React.useState(new Date(yearToday, monthToday, dateToday));
    const [errMsg, setErrMsg] = useState('');

    const handleFromDateChange = (e) => {
      var newDate = new Date(e.target.value);
      setFromDate(newDate);
    };
    const handleTillDateChange = (e) => {
      var newDate = new Date(e.target.value);
      setTillDate(newDate);
    };

    async function getDataFrom(date) {
      db.collection('orders').where('timeStamp', '>', date).onSnapshot(snapshot => {
        setOrders(snapshot.docs.map(doc => doc.data()));
        setNoOrders(orders.length === 0);
      })
    }

    async function getDataTill(date) {
      db.collection('orders').where('timeStamp', '<', date).onSnapshot(snapshot => {
        setOrders(snapshot.docs.map(doc => doc.data()));
        setNoOrders(orders.length === 0);
      })
    }

    async function getDataFromTill(fromDate, tillDate) {
      db.collection('orders').where('timeStamp', '>', fromDate).where('timeStamp', '<', tillDate).orderBy('timeStamp', 'asc').onSnapshot(snapshot => {
        setOrders(snapshot.docs.map(doc => doc.data()));
        setNoOrders(orders.length === 0);
      })
    }

    useEffect(() => {
      if (fromDate < tillDate){
        setErrMsg('');
        getDataFromTill(fromDate, tillDate);
      }
      else {
        setErrMsg('From date should be lesser than till date!');
      }
    }, [fromDate, tillDate])


    return (
        <SMHeader>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Box paddingTop={10} justifyContent='center' display='flex'>
                    <Button variant='contained' sx={{ margin: '10px' }} onClick={getOrders}>
                        All
                    </Button>
                    <Button variant='outlined' sx={{ margin: '10px' }} onClick={sortByConfirmed}>
                        Confirmed
                    </Button>
                    <Button variant='outlined' sx={{ margin: '10px' }} onClick={sortByInTransit}>
                        In Transit
                    </Button>
                    <Button variant='outlined' sx={{ margin: '10px' }} onClick={sortByDelivered}>
                        Delivered
                    </Button>
                    <Button variant='outlined' sx={{ margin: '10px' }} onClick={sortByCancelled}>
                        Cancelled
                    </Button>
                    <Button variant='outlined' sx={{ margin: '10px' }} onClick={sortByReturnRequested}>
                        Return Requested
                    </Button>
                    <Button variant='outlined' sx={{ margin: '10px' }} onClick={sortByReturnProcessed}>
                        Return Processed
                    </Button>
                </Box>
                {allSelected && 
                  <>
                    <Box paddingTop={2} justifyContent='center' display='flex'>
                      <Box padding={2} component="span">
                        <TextField
                          id="from_date"
                          label="From"
                          type="date"
                          defaultValue="2022-02-01"
                          sx={{ width: 220, alignSelf: 'center'}}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          onChange={handleFromDateChange}
                        />
                      </Box>
                      <Box padding={2} component="span">
                        <TextField
                          id="till_date"
                          label="Till"
                          type="date"
                          defaultValue={yearToday.toString() + '-' + ("0" + (monthToday + 1).toString()).slice(-2) + '-' + dateToday.toString()}
                          sx={{ width: 220, alignSelf: 'center'}}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          onChange={handleTillDateChange}
                        />
                      </Box>  
                    </Box>
                    <Box padding={2} display='flex' justifyContent='center'>
                      <Typography sx={{color: '#cb144e'}}>{errMsg}</Typography>
                    </Box>
                  </>
                }
                
                <Stack spacing={2} padding={1}>
                    {orders.length > 0 && <ManageInvoicesListHead />}
                    {orders.length === 0 && noOrders === false && <Box sx={{ paddingTop: '150px', display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                        <Typography sx={{padding: '8px', paddingLeft: '20px', color: 'secondary.dark'}}>Fetching invoices...</Typography>
                    </Box>}
                    {orders.length === 0 && noOrders && <Box sx={{ paddingTop: '150px', display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                        <Typography sx={{padding: '8px', paddingLeft: '20px', color: 'secondary.dark'}}>No invoices found... :(</Typography>
                    </Box>}

                    {orders.map(order => (
                        <ManageInvoicesListItem order={order} />
                    ))}
                </Stack>
                <Box paddingTop={10} justifyContent='center' display='flex'>
                  <Paper justifyContent='center'
                    sx={{
                        paddingTop: '10px',
                        paddingRight: '10px',
                        paddingBottom: '10px',
                        paddingLeft: '10px',
                        backgroundColor: 'primary.main',
                    }}
                  >
                    <Typography component='span' sx={{color:'#ffffff'}}>Revenue / Month (2022)</Typography>
                  
                  </Paper>
                </Box>
                <Box paddingTop={10} justifyContent='center' display='flex'>
                    <RevenueGraph orders={orders} />
                </Box>
            </Box>
        </SMHeader>
    )
}

export default AnalyzePerformance