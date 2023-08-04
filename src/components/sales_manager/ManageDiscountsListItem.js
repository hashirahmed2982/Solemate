import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { styled, useTheme } from '@mui/material/styles';
import { Button } from '@mui/material';

import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import DiscountIcon from '@mui/icons-material/Discount';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import { db, storage } from '../../firebase';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from "@mui/material/TextField";
import SizesStocksTable from '../product_manager/SizesStocksTable';
import { Link } from "react-router-dom";



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

function ManageDiscountsListItem(props) {
    const theme = useTheme();

    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setErrorText('');
        setDiscountedPrice('');
    };

    const [errorText, setErrorText] = useState('');

    async function offerDiscount(id) {
        await db.collection('products').doc(`${id}`).update({
            discountedPrice: discountedPrice,
            isDiscount: true,
        }).then(() => {
            db.collection('users').get().then(snapshot => {
                snapshot.docs.map((doc) => {
                    var values = doc.data();
                    var notifications = values.notifications;
                    var favourite = values.favourite;
                    if (favourite.includes(id)){
                        db.collection('products').doc(id).get().then(async (snapshot2) => {
                            var productName = snapshot2.data().name;
                            var newNotification = `Attention! ${productName.toUpperCase()} is now being sold for ${discountedPrice} TL only. Do not miss this limited offer!`;
                            notifications = [...notifications, newNotification]; 
                            await db.collection('users').doc(doc.id).update({
                                notifications: notifications,
                            })
                        })
                    }
                })
            })
        })
    }

    const [discountedPrice, setDiscountedPrice] = useState('');

    const handleInputChange = (e) => {
        var value = e.target.value;

        if (value[0] === '-'){
            setErrorText('Please enter a positive value!');
        }
        else {
            if (value[value.toString().length - 1] === '%'){
                var percentage = 100 - parseInt(value.substr(0, value.length - 1), 10);
                value = (Math.ceil(parseInt(props.product.price, 10) * (percentage / 100))).toString()
                console.log(value);
            }
            
            if (parseInt(value, 10) >= parseInt(props.product.price)) {
                setErrorText('Discounted price must be lesser than the current price!');
            }
            else if (parseInt(value, 10) <= 0) {
                setErrorText('Discounted price must be greater than 0!');
            }
            else {
                setErrorText('');
                setDiscountedPrice(value);
            }
        }

        
    };

    const [openCancel, setOpenCancel] = useState(false);

    const handleClickOpenCancel = () => {
        setOpenCancel(true);
    };

    const handleCloseCancel = () => {
        setOpenCancel(false);
    };

    async function cancelDiscount(id) {
        db.collection('products').doc(`${id}`).update({
            discountedPrice: props.product.price,
            isDiscount: false,
        })
    }
    
    return (
        <Item>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
                <Grid item xs ={6} md={2} lg={2} xl={2}>
                    <Box sx={{ width: '100%', height: '80px', }}>
                        <img src={props.product.pictureURLs[0]} style={{ height:'100%',}}></img>
                    </Box>
                    
                </Grid>
                <Grid item container justifyContent='center' xs ={6} md={2} lg={2} xl={2} >
                    <Box display='flex'>
                        <Typography variant='h6' sx={{justifySelf: 'flex-start', lineHeight: '80px'}}>{props.product.name.toString().toUpperCase()}</Typography>
                    </Box>
                </Grid>
                <Grid item container justifyContent='center' xs ={6} md={2} lg={2} xl={2} >
                    <Box display='flex'>
                        <Typography variant='h6' sx={{justifySelf: 'flex-start', lineHeight: '80px'}}>{props.product.category.toString().toUpperCase()}</Typography>
                    </Box>
                </Grid>
                <Grid item container justifyContent='center' xs ={6} md={2} lg={2} xl={2} >
                    <Box display='flex'>
                        <Typography variant='h6' sx={{justifySelf: 'flex-start', lineHeight: '80px'}}>{props.product.ID}</Typography>
                    </Box>
                </Grid>
                {parseInt(props.product.discountedPrice, 10) >= parseInt(props.product.price, 10) && 
                    <Grid item container justifyContent='center' xs ={6} md={2} lg={2} xl={2} >
                        <Box display='flex'>
                            <Typography variant='h6' sx={{justifySelf: 'flex-start', lineHeight: '80px'}}>{props.product.price} TL</Typography>
                        </Box>
                    </Grid>
                }
                {parseInt(props.product.discountedPrice, 10) < parseInt(props.product.price, 10) && 
                    <Grid item container justifyContent='center' xs ={6} md={2} lg={2} xl={2} >
                        <Box display='flex'>
                            <Typography variant='h6' sx={{justifySelf: 'flex-start', lineHeight: '80px', textDecoration: 'line-through', textDecorationThickness: '0.15rem', textDecorationColor: '#cb144e'}}>{props.product.price}</Typography>
                            <Typography variant='h6' sx={{justifySelf: 'flex-start', lineHeight: '80px', color: '#cb144e', fontWeight: 'bold'}}>&nbsp;{props.product.discountedPrice} TL</Typography>
                        </Box>
                    </Grid>
                }
                <Grid item container justifyContent='center' xs ={6} md={2} lg={2} xl={2} >
                    <Box display='flex'>
                        <div title='Product Details' style={{lineHeight: '80px'}}>
                            <ExpandMore
                                expand={expanded}
                                onClick={handleExpandClick}
                                aria-expanded={expanded}
                                aria-label="show more"
                            >
                                <ExpandMoreIcon />
                            </ExpandMore>
                        </div>
                        <div title='Offer Discount' style={{lineHeight: '80px'}}>
                            <IconButton onClick={handleClickOpen}>
                                <DiscountIcon />
                            </IconButton>
                        </div>
                        {parseInt(props.product.discountedPrice, 10) < parseInt(props.product.price, 10) && 
                            <div title='Cancel Discount' style={{lineHeight: '80px'}}>
                                <IconButton onClick={handleClickOpenCancel}>
                                    <MoneyOffIcon />
                                </IconButton>
                            </div>
                        }
                        <div title='View on Website' style={{lineHeight: '80px'}}>
                        <Link
                            to={'/product/' + props.product.ID}
                            key={props.product.ID}
                            state={{ id: props.product.ID }}
                        >
                            <IconButton >
                                <VisibilityIcon />
                            </IconButton>
                        </Link>
                            
                        </div>
                    </Box>
                </Grid>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle sx={{backgroundColor: 'primary.main'}} id="alert-dialog-title">
                        <Typography variant='h6' sx={{color: '#ffffff'}}>Offer discount</Typography>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText paddingTop='20px' id="alert-dialog-description">
                            Enter either the new price of the product, <br/> or the discount percentage (followed by %).
                        </DialogContentText>
                        <Stack direction='row' justifyContent='space-between'>
                            <Box marginRight='20px'>
                                <TextField
                                    autoFocus
                                    margin="normal"
                                    id="currentPrice"
                                    label="Current Price"
                                    type="text"
                                    variant="filled"
                                    value={props.product.discountedPrice}
                                    disabled
                                />
                            </Box>
                            <Box>
                                <TextField
                                    autoFocus
                                    margin="normal"
                                    id="discountedPrice"
                                    label="Discounted Price"
                                    type="text"
                                    variant="outlined"
                                    onChange={handleInputChange}
                                />
                            </Box>
                        </Stack>
                        <DialogContentText paddingTop='20px' id="alert-dialog-description" color='error'>
                            {errorText}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        {errorText == '' ? 
                        <Button variant='contained' onClick={() => {
                            offerDiscount(props.product.ID).then(() => {
                                handleClose();    
                            })
                        }}
                        >
                            Offer
                        </Button> : 
                        <Button variant='contained' disabled>
                            Offer
                        </Button>
                        }
                        <Button onClick={handleClose} autoFocus>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={openCancel}
                    onClose={handleCloseCancel}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle sx={{backgroundColor: 'primary.main'}} id="alert-dialog-title">
                        <Typography variant='h6' sx={{color: '#ffffff'}}>Cancel discount</Typography>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText paddingTop='20px' id="alert-dialog-description">
                            You are about to cancel the discount on this product, and revert its price to its original price
                            of <strong>{props.product.price} TL</strong>.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>

                        <Button variant='contained' color='error' onClick={() => {
                            cancelDiscount(props.product.ID).then(() => {
                                handleCloseCancel();    
                            })
                        }}
                        >
                            Cancel Discount
                        </Button> : 
                        <Button variant='contained' onClick={handleCloseCancel}>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
                
                <Grid item xs ={12} md={12} lg={12} xl={12} justifyContent='center'>
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
                                    <Typography component='span' sx={{color:'#ffffff'}}>Product Details</Typography>
                                
                                </Paper>
                                

                            </Grid>
                            <Grid item container xs ={12} md={10} lg={10} xl={10} justifyContent='center'>
                                {props.product.pictureURLs.map((url, i) => (
                                    <Grid item xs={12} md={2} lg={2} xl={2} container justifyContent='center'>
                                        <Box sx={{ padding: '10px', width: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                            <img src={url} style={{ width:'100%', }}></img>
                                        </Box> 
                                    </Grid>
                                    
                                ))}   
                            </Grid>
                            <Grid item container xs={12} md={10} lg={10} xl={10} justifyContent='center' sx={{paddingTop:'30px'}}>
                                <Grid item xs={12} md={2} lg={2} xl={2}>
                                    <Typography variant='h6'><b>Brand:</b><br/>{props.product.brand}</Typography>
                                </Grid>
                                <Grid item xs={12} md={2} lg={2} xl={2}>
                                    <Typography variant='h6'><b>Sizes &amp; Stocks:</b><br/></Typography>
                                    <SizesStocksTable rows={props.product.sizesStocks}/>
                                </Grid>
                                <Grid item xs={12} md={2} lg={2} xl={2}>
                                    <Typography variant='h6'><b>Distributor:</b><br/>{props.product.distributor}</Typography>
                                </Grid>
                                <Grid item xs={12} md={2} lg={2} xl={2}>
                                    <Typography variant='h6'><b>Warranty Status:</b><br/>{props.product.warrantyStatus} days</Typography>
                                </Grid>
                            </Grid>
                            <Grid item container xs={12} md={10} lg={10} xl={10} justifyContent='center' sx={{paddingTop:'30px', paddingBottom: '30px'}}>
                                <Grid item xs={12} md={10} lg={10} xl={10}>
                                    <Typography variant='h6'><b>Description:</b><br/>{props.product.description}</Typography>
                                </Grid>
                                
                            </Grid>
                        </Grid>

                        
                        
                    </Collapse>
                </Grid>

            </Grid>
            
            
            
        </Item>
    )
}

export default ManageDiscountsListItem