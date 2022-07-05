import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import ManageDiscountsListItem from './ManageDiscountsListItem';
import SMHeader from './SMHeader';
import Box from '@mui/material/Box';
import { Button, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import firebase from 'firebase';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import ManageDiscountsListHead from './ManageDiscountsListHead';

function ManageDiscounts() {
    const [products, setProducts] = useState([]);
    const [noProducts, setNoProducts] = useState(false);
  
    async function getOrders() {
        db.collection('products').orderBy('timeStamp', 'desc').onSnapshot(snapshot => {
            setProducts(snapshot.docs.map(doc => doc.data()));
            setNoProducts(products.length === 0);
        })
    }

    useEffect(() => {
        getOrders();
    }, []);

    async function sortByDiscounted() {
        db.collection('products').where('isDiscount', '==', true).onSnapshot(snapshot => {
            setProducts(snapshot.docs.map(doc => doc.data()));
            setNoProducts(products.length === 0);
        })
    }

    async function getLatestFirst() {
        db.collection('products').orderBy('timeStamp', 'desc').onSnapshot(snapshot => {
            setProducts(snapshot.docs.map(doc => doc.data()));
            setNoProducts(products.length === 0);
        })
    }

    async function getOldestFirst() {
        db.collection('products').orderBy('timeStamp', 'asc').onSnapshot(snapshot => {
            setProducts(snapshot.docs.map(doc => doc.data()));
            setNoProducts(products.length === 0);
        })
    }

    return (
        <SMHeader>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Box paddingTop={10} justifyContent='center' display='flex'>
                    <Button variant='contained' sx={{ margin: '10px' }} onClick={getOrders}>
                        All
                    </Button>
                    <Button variant='outlined' sx={{ margin: '10px' }} onClick={sortByDiscounted}>
                        Discounted
                    </Button>
                </Box>
                <Box justifyContent='center' display='flex'>
                    <Button variant='outlined' sx={{ margin: '10px' }} onClick={getLatestFirst}>
                        Latest First
                    </Button> 
                    <Button variant='outlined' sx={{ margin: '10px' }} onClick={getOldestFirst}>
                        Oldest First
                    </Button> 
                </Box>
                <Stack spacing={2} padding={1}>
                    {products.length > 0 && <ManageDiscountsListHead />}
                    {products.length === 0 && noProducts === false && <Box sx={{ paddingTop: '150px', display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                        <Typography sx={{padding: '8px', paddingLeft: '20px', color: 'secondary.dark'}}>Fetching products...</Typography>
                    </Box>}
                    {products.length === 0 && noProducts && <Box sx={{ paddingTop: '150px', display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                        <Typography sx={{padding: '8px', paddingLeft: '20px', color: 'secondary.dark'}}>No products found... :(</Typography>
                    </Box>}

                    {products.map(product => (
                        <ManageDiscountsListItem product={product} />
                    ))}
                </Stack>
            </Box>
        </SMHeader>
    )
}

export default ManageDiscounts