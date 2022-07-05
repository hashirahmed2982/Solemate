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

function ManageDeliveriesListItem(props) {
    const theme = useTheme();

    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const [openInTransit, setOpenInTransit] = useState(false);

    const handleClickOpenInTransit = () => {
        setOpenInTransit(true);
    };

    const handleCloseInTransit = () => {
        setOpenInTransit(false);
    };

    const [openDelivered, setOpenDelivered] = useState(false);

    const handleClickOpenDelivered = () => {
        setOpenDelivered(true);
    };

    const handleCloseDelivered = () => {
        setOpenDelivered(false);
    };

    const [openCancelled, setOpenCancelled] = useState(false);

    const handleClickOpenCancelled = () => {
        setOpenCancelled(true);
    };

    const handleCloseCancelled = () => {
        setCancelReason('');
        setOpenCancelled(false);
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

    async function changeStatusInTransit() {
        await db.collection('orders').get()
        .then((querySnapshot) => {
            querySnapshot.forEach(async (snapshot) =>  {
                if (snapshot.id.toString().includes(props.order.orderID)){
                    await db.collection('orders').doc(snapshot.id).update({
                        status: 'inTransit',
                    })
                }
            })
        })
    }

    async function changeStatusDelivered() {
        await db.collection('orders').get()
        .then((querySnapshot) => {
            querySnapshot.forEach(async (snapshot) =>  {
                if (snapshot.id.toString().includes(props.order.orderID)){
                    await db.collection('orders').doc(snapshot.id).update({
                        status: 'delivered',
                    })
                }
            })
        })
    }

    async function changeStatusCancelled() {
        await db.collection('orders').get()
        .then((querySnapshot) => {
            querySnapshot.forEach(async (snapshot) =>  {
                if (snapshot.id.toString().includes(props.order.orderID)){
                    await db.collection('orders').doc(snapshot.id).update({
                        status: 'cancelled',
                        cancelReason: cancelReason,
                    })
                }
            })
        })
    }

    const [cancelReason, setCancelReason] = useState('');

    function handleInputChange(e) {
        console.log(e.target.value);
        setCancelReason(e.target.value);
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
                        <div title='Change Status - Confirmed' style={{lineHeight: '80px'}}>
                            {props.order.status === 'confirmed' ? 
                                <IconButton disabled onClick={handleClickOpenCancelled}>
                                    <CheckCircleIcon sx={{color: '#f77d0b'}} />
                                </IconButton> :
                                props.order.status !== 'inTransit' && props.order.status !== 'delivered' && props.order.status !== 'cancelled' ?
                                    <IconButton disabled onClick={handleClickOpenCancelled}>
                                        <CheckCircleIcon />
                                    </IconButton> : 
                                    <IconButton disabled onClick={handleClickOpenCancelled}>
                                        <CheckCircleIcon />
                                    </IconButton>
                            }
                        </div>
                        <div title='Change Status - In Transit' style={{lineHeight: '80px'}}>
                            {props.order.status === 'inTransit' ? 
                                <IconButton disabled onClick={handleClickOpenInTransit}>
                                    <LocalShippingIcon sx={{color: '#f77d0b'}} />
                                </IconButton> :
                                props.order.status !== 'delivered' && props.order.status !== 'cancelled' && props.order.status !== 'cancelledUser' && props.order.status !== 'returnRequested' && props.order.status !== 'returnProcessed' ?
                                    <IconButton onClick={handleClickOpenInTransit}>
                                        <LocalShippingIcon />
                                    </IconButton> :
                                    <IconButton disabled onClick={handleClickOpenInTransit}>
                                        <LocalShippingIcon />
                                    </IconButton>
                            } 
                        </div>
                        <div title='Change Status - Delivered' style={{lineHeight: '80px'}}>
                            {props.order.status === 'delivered' ? 
                                <IconButton disabled onClick={handleClickOpenDelivered}>
                                    <HomeIcon sx={{color: '#f77d0b'}} />
                                </IconButton> : 
                                props.order.status !== 'cancelled' && props.order.status !== 'cancelledUser' && props.order.status !== 'returnRequested' && props.order.status !== 'returnProcessed' ? 
                                    <IconButton onClick={handleClickOpenDelivered}>
                                        <HomeIcon />
                                    </IconButton> : 
                                    <IconButton disabled onClick={handleClickOpenDelivered}>
                                        <HomeIcon />
                                    </IconButton>
                            }
                        </div>
                        {props.order.status !== 'delivered' && props.order.status !== 'cancelledUser' && props.order.status !== 'inTransit' && props.order.status !== 'returnRequested' && props.order.status !== 'returnProcessed' && 
                            <div title='Change Status - Cancelled' style={{lineHeight: '80px'}}>
                                {props.order.status === 'cancelled' ? 
                                    <IconButton disabled onClick={handleClickOpenCancelled}>
                                        <CancelIcon sx={{color: '#cb144e'}} />
                                    </IconButton> : 
                                    <IconButton onClick={handleClickOpenCancelled}>
                                        <CancelIcon />
                                    </IconButton>
                                }
                            </div>
                        }
                        
                        <div title='Return Requested' style={{lineHeight: '80px'}}>
                            {props.order.status === 'returnRequested' ? 
                                <IconButton disabled>
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
                    open={openInTransit}
                    onClose={handleCloseInTransit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle sx={{backgroundColor: 'primary.main'}} id="alert-dialog-title">
                        <Typography variant='h6' sx={{color: '#ffffff'}}>Change status to in transit?</Typography>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText paddingTop='20px' id="alert-dialog-description">
                            You are about to change this order's status to <strong>IN TRANSIT</strong>. This means that you will not be able
                            to cancel this order afterwards.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant='contained' onClick={() => {
                            changeStatusInTransit().then(() => {
                                handleCloseInTransit();
                            })
                            
                        }}
                        >
                            Change Status
                        </Button>
                        <Button color='error' onClick={handleCloseInTransit} autoFocus>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={openDelivered}
                    onClose={handleCloseDelivered}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle sx={{backgroundColor: 'primary.main'}} id="alert-dialog-title">
                        <Typography variant='h6' sx={{color: '#ffffff'}}>Change status to delivered?</Typography>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText paddingTop='20px' id="alert-dialog-description">
                            You are about to change this order's status to <strong>DELIVERED</strong>. This means that you will not be able
                            to cancel this order afterwards. Kindly make sure that this order was indeed delivered to the customer, otherwise
                            strict action may be taken against you.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant='contained' onClick={() => {
                            changeStatusDelivered().then(() => {
                                handleCloseDelivered();
                            })
                        }}
                        >
                            Change Status
                        </Button>
                        <Button color='error' onClick={handleCloseDelivered} autoFocus>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={openCancelled}
                    onClose={handleCloseCancelled}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle sx={{backgroundColor: 'primary.main'}} id="alert-dialog-title">
                        <Typography variant='h6' sx={{color: '#ffffff'}}>Cancel order?</Typography>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText paddingTop='20px' id="alert-dialog-description">
                            You are about to <strong>CANCEL</strong> this order. This change is permanent and cannot be reversed.
                            Kindly state the reason of cancellation, in the box below.
                        </DialogContentText>
                        <div style={{paddingTop: '20px'}}>    
                            <TextField 
                                type='text'
                                fullWidth
                                variant='outlined'
                                label='Reason for Cancellation'
                                onChange={handleInputChange}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        {cancelReason !== '' ? 
                            <Button color='error' variant='contained' onClick={() => {
                                changeStatusCancelled().then(() => {
                                    handleCloseCancelled();
                                })
                            }}
                            >
                                Cancel Order
                            </Button> : 
                            <Button disabled color='error' variant='contained'>
                                Add Cancellation Reason
                            </Button>
                        }
                        
                        <Button onClick={handleCloseCancelled} autoFocus>
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
                                    <Grid item xs={12} md={4} lg={4} xl={4} container justifyContent='center'>
                                        <Box sx={{ padding: '10px', width: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                            <img src={cartItem.picture} style={{ width:'100%', }}></img>
                                            <Typography variant='h6'><strong>{cartItem.ID}</strong></Typography>
                                            <Typography variant='h6'>Name: {cartItem.name}</Typography>
                                            <Typography variant='h6'>Category: {cartItem.category}</Typography>
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

export default ManageDeliveriesListItem