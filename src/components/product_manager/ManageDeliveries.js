import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import ManageDeliveriesListItem from './ManageDeliveriesListItem';
import PMHeader from './PMHeader';
import Box from '@mui/material/Box';
import { Button, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import firebase from 'firebase';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import ManageDeliveriesListHead from './ManageDeliveriesListHead';

function ManageDeliveries() {
    const [orders, setOrders] = useState([]);
    const [noOrders, setNoOrders] = useState(false);
  
    async function getOrders() {
        db.collection('orders').orderBy('timeStamp', 'desc').onSnapshot(snapshot => {
          setOrders(snapshot.docs.map(doc => doc.data()));
          setNoOrders(orders.length === 0);
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
        })
    }

    async function sortByInTransit() {
        db.collection('orders').where('status', '==', 'inTransit').onSnapshot(snapshot => {
            setOrders(snapshot.docs.map(doc => doc.data()));
            setNoOrders(orders.length === 0);
        })
    }

    async function sortByDelivered() {
        db.collection('orders').where('status', '==', 'delivered').onSnapshot(snapshot => {
            setOrders(snapshot.docs.map(doc => doc.data()));
            setNoOrders(orders.length === 0);
        })
    }

    async function sortByCancelled() {
        db.collection('orders').where('status', '==', 'cancelled').onSnapshot(snapshot => {
            setOrders(snapshot.docs.map(doc => doc.data()));
            setNoOrders(orders.length === 0);
        })
    }

    async function sortByReturnRequested() {
        db.collection('orders').where('status', '==', 'returnRequested').onSnapshot(snapshot => {
            setOrders(snapshot.docs.map(doc => doc.data()));
            setNoOrders(orders.length === 0);
        })
    }

    async function sortByReturnProcessed() {
        db.collection('orders').where('status', '==', 'returnProcessed').onSnapshot(snapshot => {
            setOrders(snapshot.docs.map(doc => doc.data()));
            setNoOrders(orders.length === 0);
        })
    }

    return (
        <PMHeader>
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
                <Stack spacing={2} padding={1}>
                    {orders.length > 0 && <ManageDeliveriesListHead />}
                    {orders.length === 0 && noOrders === false && <Box sx={{ paddingTop: '150px', display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                        <Typography sx={{padding: '8px', paddingLeft: '20px', color: 'secondary.dark'}}>Fetching deliveries...</Typography>
                    </Box>}
                    {orders.length === 0 && noOrders && <Box sx={{ paddingTop: '150px', display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                        <Typography sx={{padding: '8px', paddingLeft: '20px', color: 'secondary.dark'}}>No deliveries found... :(</Typography>
                    </Box>}

                    {orders.map(order => (
                        <ManageDeliveriesListItem order={order} />
                    ))}
                </Stack>
            </Box>
        </PMHeader>
    )
}

export default ManageDeliveries