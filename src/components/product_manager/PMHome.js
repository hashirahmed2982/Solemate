import React, { useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import PMHeader from './PMHeader';
import { useNavigate } from "react-router-dom";
import { db } from '../../firebase';
import firebase from "firebase";

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar     
    ...theme.mixins.toolbar,
  }));

function PMHome() {

    const [username, setUsername] = useState('');

    useEffect(() => {
        if (firebase.auth().currentUser !== null){
            db.collection('users').doc(firebase.auth().currentUser.uid).get().then(doc => {
                var values = doc.data();
                setUsername(values.user);
            })
        }
        else {
            //let path = '/';
            //navigate(path);
        }
    })

    let navigate = useNavigate(); 

    const handleProductClick = () =>{ 
        let path = '/pmManageProducts'; 
        navigate(path);
    }

    const handleDeliveryClick = () => {
        let path = '/pmManageDeliveries'
        navigate(path);
    }

    const handleCommentClick = () => {
        let path = '/pmManageComments'
        navigate(path);
    }

    return (
        <PMHeader>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <Typography variant='h4' align='center' padding={5}>Welcome Product Manager, {username}</Typography>
                <Grid sx={{ flexGrow: 1 }} container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container justifyContent="center" spacing={7} paddingTop={5}>
                            <Grid key='0' item>
                            <Button onClick={handleProductClick}>
                                <Paper direction='column' justifyContent='center'
                                sx={{
                                    padding: '30px',
                                    backgroundColor: 'secondary.light'
                                }}
                                >
                                <Typography variant='h1' align='center'>
                                    <InventoryIcon fontSize='50'></InventoryIcon>
                                </Typography>
                                
                                <Typography variant='h6' align='center'> Manage Products<br/>&amp; Comments </Typography>
                                </Paper>
                            </Button> 
                            </Grid>
                            <Grid key='1' item>
                            <Button onClick={handleDeliveryClick}>
                                <Paper direction='column' justifyContent='center'
                                sx={{
                                    padding: '30px',
                                    backgroundColor: 'secondary.light'
                                }}
                                >
                                <Typography variant='h1' align='center'>
                                    <LocalShippingIcon fontSize='50'></LocalShippingIcon>
                                </Typography>
                                
                                <Typography variant='h6' align='center'> Manage Deliveries </Typography>
                                </Paper>
                            </Button>
                            </Grid>
                            {/*<Grid key='2' item>
                            
                            <Button onClick={handleCommentClick}>
                                <Paper direction='column' justifyContent='center'
                                sx={{
                                    padding: '30px',
                                    backgroundColor: 'secondary.light'
                                }}
                                >
                                <Typography variant='h1' align='center'>
                                    <CommentBankIcon fontSize='50'></CommentBankIcon>
                                </Typography>
                                
                                <Typography variant='h6' align='center'> Manage Comments </Typography>
                                </Paper>
                            </Button>
                            
                            </Grid>*/}
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </PMHeader>
        
        
    )
}

export default PMHome