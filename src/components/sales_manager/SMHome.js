import React, { useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DiscountIcon from '@mui/icons-material/Discount';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SMHeader from './SMHeader';
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

function SMHome() {
    let navigate = useNavigate(); 

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

    const handleDiscountClick = () =>{ 
        let path = '/smManageDiscounts'; 
        navigate(path);
    }

    const handlePerformanceClick = () => {
        let path = '/smAnalyzePerformance'
        navigate(path);
    }

    return (
        <SMHeader>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <Typography variant='h4' align='center' padding={5}>Welcome Sales Manager, {username}</Typography>
                <Grid sx={{ flexGrow: 1 }} container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container justifyContent="center" spacing={7} paddingTop={5}>
                            <Grid key='0' item>
                            <Button onClick={handleDiscountClick}>
                                <Paper direction='column' justifyContent='center'
                                sx={{
                                    padding: '30px',
                                    backgroundColor: 'secondary.light'
                                }}
                                >
                                <Typography variant='h1' align='center'>
                                    <DiscountIcon fontSize='50'></DiscountIcon>
                                </Typography>
                                
                                <Typography variant='h6' align='center'> Manage Discounts </Typography>
                                </Paper>
                            </Button> 
                            </Grid>
                            <Grid key='1' item>
                            <Button onClick={handlePerformanceClick}>
                                <Paper direction='column' justifyContent='center'
                                sx={{
                                    padding: '30px',
                                    backgroundColor: 'secondary.light'
                                }}
                                >
                                <Typography variant='h1' align='center'>
                                    <AutoGraphIcon fontSize='50'></AutoGraphIcon>
                                </Typography>
                                
                                <Typography variant='h6' align='center'> Analyze Performance </Typography>
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
        </SMHeader>
        
        
    )
}

export default SMHome