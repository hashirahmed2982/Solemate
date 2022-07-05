import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import { styled, useTheme } from '@mui/material/styles';
import { Button } from '@mui/material';


import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { db, storage } from '../../firebase';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HomeIcon from '@mui/icons-material/Home';
import CancelIcon from '@mui/icons-material/Cancel';
import TextField from "@mui/material/TextField";
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : theme.palette.secondary.main,
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    //justifyContent: 'space-between',
    display: 'flex',
    color: theme.palette.text.secondary.main,
    
}));

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
}));

function ManageInvoicesListItem(props) {
    const theme = useTheme();

    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const [openReturn, setOpenReturn] = useState(false);

    const handleClickOpenReturn = () => {
        setOpenReturn(true);
    };

    const handleCloseReturn = () => {
        setOpenReturn(false);
    };

    async function viewInvoice() {
        const storageRef = storage.ref(`invoices/`);
        await storageRef.listAll().then((listResults) => {
            listResults.items.map((item) => {
                if (item.name.includes(props.order.orderID)) {
                    item.getDownloadURL().then((url) => {
                        window.open(url, '_blank');
                    })
                }
            });
        });
    }

    async function confirmReturnRequest() {
        await db.collection('orders').get()
        .then((querySnapshot) => {
            querySnapshot.forEach(async (snapshot) =>  {
                if (snapshot.id.toString().includes(props.order.orderID)){
                    await db.collection('orders').doc(snapshot.id).update({
                        status: 'returnProcessed',
                    })
                }
            })
        })
        props.order.cart.map((car) => {
            db.collection('products').doc(car.ID).get().then((snapshot) => {
                var data = snapshot.data();
                var sizesStocks = data.sizesStocks;
                var idx = sizesStocks.findIndex((element) => element.size === car.size);
                //console.log(idx);
                console.log(sizesStocks[idx].size, " ", sizesStocks[idx].stock);
                var updatedStock = (parseInt(sizesStocks[idx].stock, 10) + car.quantity).toString()
                var obj = {
                    size: car.size,
                    stock: updatedStock,
                }
                sizesStocks.splice(idx, 1, obj);
                db.collection('products').doc(car.ID).update({
                    sizesStocks: sizesStocks,
                })
            })
        })
        
    }


    
    return (
        <Item>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
                <Grid item container justifyContent='center' xs ={6} md={2} lg={2} xl={2} >
                    <Box display='flex'>
                        <Typography variant='h6' sx={{justifySelf: 'flex-start', lineHeight: '80px'}}>{props.order.orderID}</Typography>
                    </Box>
                </Grid>
                <Grid item container justifyContent='center' xs ={6} md={3} lg={3} xl={3} >
                    <Box display='flex'>
                        <Typography variant='h6' sx={{justifySelf: 'flex-start', lineHeight: '80px'}}>{(props.order.customerDetails.firstName + " " + props.order.customerDetails.lastName).toUpperCase()}</Typography>
                    </Box>
                </Grid>
                <Grid item container justifyContent='center' xs ={6} md={2} lg={2} xl={2} >
                    <Box display='flex'>
                        <Typography variant='h6' sx={{justifySelf: 'flex-start', lineHeight: '80px'}}>{props.order.total.toString()} TL</Typography>
                    </Box>
                </Grid>
                <Grid item container justifyContent='center' xs ={6} md={2} lg={2} xl={2} >
                    <Box display='flex' flexDirection='column'>
                        {props.order.status === 'confirmed' &&
                            <Typography variant='h6' sx={{justifySelf: 'flex-start', lineHeight: '80px'}}>Confirmed</Typography>
                        }
                        {props.order.status === 'inTransit' &&
                            <Typography variant='h6' sx={{justifySelf: 'flex-start', lineHeight: '80px'}}>In Transit</Typography>
                        }
                        {props.order.status === 'delivered' &&
                            <Typography variant='h6' sx={{justifySelf: 'flex-start', lineHeight: '80px'}}>Delivered</Typography>
                        }
                        {props.order.status === 'cancelled' &&
                            <Typography variant='h6' sx={{justifySelf: 'flex-start', lineHeight: '80px'}}>Cancelled</Typography>
                        }
                        {props.order.status === 'cancelled' &&
                            <Typography sx={{color:'#cb144e'}} variant='p'>{props.order.cancelReason}</Typography>
                        }
                        {props.order.status === 'cancelledUser' &&
                            <Typography variant='h6' sx={{justifySelf: 'flex-start', lineHeight: '80px'}}>User Cancelled</Typography>
                        }
                        {props.order.status === 'returnRequested' &&
                            <Typography variant='h6' sx={{justifySelf: 'flex-start', lineHeight: '80px'}}>Return Requested</Typography>
                        }
                        {props.order.status === 'returnProcessed' &&
                            <Typography variant='h6' sx={{justifySelf: 'flex-start', lineHeight: '80px'}}>Return Processed</Typography>
                        }
                        {props.order.status === 'cancelledUser' &&
                            <Typography variant='h6' sx={{justifySelf: 'flex-start', lineHeight: '80px'}}>Cancelled by Customer</Typography>
                        }
                    </Box>
                </Grid>
                <Grid container justifyContent='center' item xs ={6} md={3} lg={3} xl={3} >
                    <Box display='flex'>
                        <div title='Order Details' style={{lineHeight: '80px'}}>
                            <ExpandMore
                                expand={expanded}
                                onClick={handleExpandClick}
                                aria-expanded={expanded}
                                aria-label="show more"
                            >
                                <ExpandMoreIcon />
                            </ExpandMore>
                        </div>
                        <div title='View Invoice' style={{lineHeight: '80px'}}>
                            <IconButton onClick={viewInvoice}>
                                <ReceiptIcon />
                            </IconButton>
                        </div>
                          
                        <div title='Return Requested' style={{lineHeight: '80px'}}>
                            {props.order.status === 'returnRequested' ? 
                                <IconButton onClick={handleClickOpenReturn}>
                                    <AssignmentReturnedIcon sx={{color: '#f77d0b'}} />
                                </IconButton> : props.order.status === 'returnProcessed' ?
                                <IconButton disabled>
                                    <AssignmentReturnedIcon  sx={{color: '#4BB543'}} />
                                </IconButton> : 
                                <IconButton disabled>
                                    <AssignmentReturnedIcon />
                                </IconButton>
                            }
                        </div>

                        
                    </Box>
                </Grid>

                <Dialog
                    open={openReturn}
                    onClose={handleCloseReturn}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle sx={{backgroundColor: 'primary.main'}} id="alert-dialog-title">
                        <Typography variant='h6' sx={{color: '#ffffff'}}>Confirm return?</Typography>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText paddingTop='20px' id="alert-dialog-description">
                            You are about to confirm this <strong>return</strong>. This change is permanent and cannot be reversed.
                            The amount of money paid by the customer for this order would be returned back to them, and the stocks would be
                            updated accordingly.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant='contained' onClick={() => {
                            confirmReturnRequest().then(() => {
                                handleCloseReturn();
                            })
                        }}
                        >
                            Confirm Return
                        </Button>
                        
                        <Button onClick={handleCloseReturn} autoFocus>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
                
                <Grid item xs ={12} md={12} lg={12} xl={12}>
                    <Collapse in={expanded} timeout="auto" unmountOnExit sx={{backgroundColor:'secondary.light'}}>
                        <Grid sx={{flex: 1}} container rowSpacing={1} justifyContent='center' columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
                            <Grid item xs ={12} md={3} lg={3} xl={3}>
                                
                                <Paper justifyContent='center'
                                    sx={{
                                        paddingTop: '10px',
                                        paddingRight: '10px',
                                        paddingBottom: '10px',
                                        paddingLeft: '10px',
                                        backgroundColor: 'primary.main',
                                        margin: '20px',
                                    }}
                                >
                                    <Typography component='span' sx={{color:'#ffffff'}}>Order Details</Typography>
                                
                                </Paper>
                                

                            </Grid>
                            <Grid item container xs ={12} md={10} lg={10} xl={10} justifyContent='center'>
                                {props.order.cart.map((cartItem, i) => (
                                    <Grid item xs={12} md={2} lg={2} xl={2} container justifyContent='center'>
                                        <Box sx={{ padding: '10px', width: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                            <img src={cartItem.picture} style={{ width:'100%', }}></img>
                                            <Typography variant='h6'><strong>{cartItem.ID}</strong></Typography>
                                            <Typography variant='h6'>Name: {cartItem.name}</Typography>
                                            <Typography variant='h6'>Brand: {cartItem.brand}</Typography>
                                            <Typography variant='h6'>Size: {cartItem.size}</Typography>
                                            <Typography variant='h6'>Quantity: {cartItem.quantity.toString()}</Typography>
                                        </Box> 
                                    </Grid>
                                ))}   
                                
                            </Grid>
                            <Grid item container xs ={12} md={10} lg={10} xl={10} justifyContent='center'>
                                <Typography>______________________________________________________________________________________</Typography> 
                            </Grid>
                            <Grid item container xs={12} md={10} lg={10} xl={10} justifyContent='center' sx={{paddingTop:'30px'}}>
                                <Grid item xs={12} md={4} lg={4} xl={4}>
                                    <Typography variant='h6'><b>Customer Details</b></Typography>
                                    <Typography variant='h6'>Name: {props.order.customerDetails.firstName} {props.order.customerDetails.lastName}</Typography>
                                    <Typography variant='h6'>Email: {props.order.customerDetails.email}</Typography>
                                    <Typography variant='h6'>Address: {props.order.customerDetails.address}
                                    <br/>{props.order.customerDetails.city} - {props.order.customerDetails.zip}
                                    <br/>{props.order.customerDetails.country}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Collapse>
                </Grid>

            </Grid>
            
            
            
        </Item>
    )
}

export default ManageInvoicesListItem