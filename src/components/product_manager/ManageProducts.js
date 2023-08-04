import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import ManageProductsListItem from './ManageProductsListItem';
import PMHeader from './PMHeader';
import Box from '@mui/material/Box';
import { Button, TextField } from '@mui/material';
import AddProduct from './AddProduct';
import AddCategory from './AddCategory';
import Grid from '@mui/material/Grid';
import firebase from 'firebase';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import ManageProductsListHead from './ManageProductsListHead';


function ManageProducts() {
    const [products, setProducts] = useState([]);
    const [noProducts, setNoProducts] = useState(false);

    async function getData() {
        db.collection('products').orderBy('timeStamp', 'desc').onSnapshot(snapshot => {
            setProducts(snapshot.docs.map(doc => doc.data()));
            setNoProducts(products.length === 0);
        })
    }

    useEffect(() => {
        getData();
    }, []);

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
        <PMHeader>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Box paddingTop={10} justifyContent='center' display='flex'>
                    <AddProduct />
                    <AddCategory />
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
                    {products.length > 0 && <ManageProductsListHead />}
                    {products.length === 0 && noProducts === false && <Box sx={{ paddingTop: '150px', display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                        <Typography sx={{padding: '8px', paddingLeft: '20px', color: 'secondary.dark'}}>Fetching products...</Typography>
                    </Box>}
                    {products.length === 0 && noProducts && <Box sx={{ paddingTop: '150px', display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                        <Typography sx={{padding: '8px', paddingLeft: '20px', color: 'secondary.dark'}}>No products found... :(</Typography>
                    </Box>}

                    {products.map(product => (
                        <ManageProductsListItem product={product} />
                    ))}
                </Stack>
            </Box>
        </PMHeader>
    )
}

export default ManageProducts