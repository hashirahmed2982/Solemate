import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { styled, useTheme } from '@mui/material/styles';
import { Button } from '@mui/material';
import AddProduct from './AddProduct';

import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import SizesStocksTable from './SizesStocksTable';
import Divider from '@mui/material/Divider';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#ffffff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    //justifyContent: 'space-between',
    display: 'flex',
    boxShadow: 'none',
}));

function ManageProductsListHead(props) {
    const theme = useTheme();
    
    return (
        <Item>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
                <Grid item container justifyContent='center' xs ={6} md={2} lg={2} xl={2}>
                    <Box sx={{ width: '100%', height: '80px', }}>
                    </Box>
                </Grid>
                <Grid container item justifyContent='center' xs ={6} md={2} lg={2} xl={2} sx={{alignItems: 'flex-end', alignContent: 'flex-end'}}>
                    <Box display='flex'>
                        <Typography variant='h6' fontWeight='bold' sx={{textDecoration: 'underline'}}>Name</Typography>   
                    </Box>

                </Grid>
                <Grid container item justifyContent='center' xs ={6} md={2} lg={2} xl={2} sx={{alignItems: 'flex-end', alignContent: 'flex-end'}}>
                    <Box display='flex' >
                        <Typography variant='h6' fontWeight='bold' sx={{textDecoration: 'underline'}}>Category</Typography> 
                    </Box>
                    
                </Grid>
                <Grid container item justifyContent='center' xs ={6} md={2} lg={2} xl={2} sx={{alignItems: 'flex-end', alignContent: 'flex-end'}}>
                    <Box display='flex' >
                        <Typography variant='h6' fontWeight='bold' sx={{textDecoration: 'underline'}}>ID</Typography>
                    </Box>
                    
                </Grid>
                <Grid container item justifyContent='center' xs ={6} md={2} lg={2} xl={2} sx={{alignItems: 'flex-end', alignContent: 'flex-end'}}>
                    <Box display='flex' >
                        <Typography variant='h6' fontWeight='bold' sx={{textDecoration: 'underline'}}>Price</Typography> 
                    </Box>
                    
                </Grid>
                <Grid container item justifyContent='center' xs={6} md={2} lg={2} xl={2} sx={{alignItems: 'flex-end', alignContent: 'flex-end'}}>
                    <Box display='flex' >
                        <Typography variant='h6' fontWeight='bold' sx={{textDecoration: 'underline'}}>Actions</Typography>
                    </Box>
                    
                </Grid>
            </Grid>
        </Item>
    )
}

export default ManageProductsListHead