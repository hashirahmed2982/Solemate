import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { styled, useTheme } from '@mui/material/styles';
import { Button } from '@mui/material';
import AddProduct from './AddProduct';
import { Link } from "react-router-dom";
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SizesStocksTable from './SizesStocksTable';
import { db, storage } from '../../firebase';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import EditProduct from './EditProduct';

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

function ManageProductsListItem(props) {

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
    };

    async function deleteProduct(id) {
        db.collection('products').get()
        .then((querySnapshot) => {
            querySnapshot.forEach(async (snapshot) =>  {
                if (snapshot.id.toString() === id.toString()){
                    await db.collection('products').doc(`${id}`).delete();
                }
                }
            )
        })
        
        const storageRef = storage.ref(`products/${id}/`);
        await storageRef.listAll().then((listResults) => {
            const promises = listResults.items.map((item) => {
                return item.delete();
            });
            Promise.all(promises);
        });

    }

    function navigateToProduct() {
        let path = 'product/' + props.product.ID.toString();
        window.open(path, '_blank');
    }
    
    return (
        <Item>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
                <Grid item container justifyContent='center' xs ={6} md={2} lg={2} xl={2}>
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
                <Grid item container justifyContent='center' xs ={6} md={2} lg={2} xl={2} >
                    <Box display='flex'>
                        <Typography variant='h6' sx={{justifySelf: 'flex-start', lineHeight: '80px'}}>{props.product.price} TL</Typography>
                    </Box>
                </Grid>

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
                        <EditProduct ID={props.product.ID}/>
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
                        <div title='Delete' style={{lineHeight: '80px'}}>
                            <IconButton onClick={handleClickOpen}>
                                <DeleteForeverIcon />
                            </IconButton>
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
                        <Typography variant='h6' sx={{color: '#ffffff'}}>Delete this product?</Typography>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText paddingTop='20px' id="alert-dialog-description">
                            You are about to delete this product permanently! This means that you will not be able
                            to recover this product, and it will be no longer available on the website.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant='contained' color='error' onClick={() => {
                            deleteProduct(props.product.ID).then(() => {
                                handleClose();
                            })
                        }}
                        >
                            Delete
                        </Button>
                        <Button onClick={handleClose} autoFocus>
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

export default ManageProductsListItem