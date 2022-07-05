import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Button, Collapse, Grid } from '@material-ui/core';
import { useNavigate } from "react-router-dom";
import firebase from 'firebase';
import { db } from '../../firebase';


const useStyles = makeStyles({
  root: {
    maxWidth: 645,
    background: 'rgba(0,0,0,0.5)',
    margin: '30px',
  },
  media: {
    height: 440,
  },
  title: {
    fontFamily: 'Nunito',
    fontWeight: 'bold',
    fontSize: '2rem',
    color: '#fff',
    textAlign: 'center',
  },
  desc: {
    fontFamily: 'Nunito',
    fontSize: '1.1rem',
    color: '#eee',
    textAlign: 'center',
    paddingBottom: '9px'
  },
});


export default function ImageCard({ place, checked, button }) {
  const classes = useStyles();
  let navigate = useNavigate();

  function handleSignIn() {
    let path = '/login';
    navigate(path);
  }

  async function handleAnon() {
    await firebase.auth().signInAnonymously().then(async () => {
        const member = "anonCustomer";
        const user = firebase.auth().currentUser;
        await db.collection('users').doc(`${user.uid}`).set({
            uid: user.uid,
            user: 'Anonymous Customer',
            pass: 'password',
            email: 'email',
            member: member,
            cart: [],
            favourite: [],
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
    }).then(() => {
        let path = '/home';
        navigate(path);
    })
  }

  return (
    <Collapse in={checked} {...(checked ? { timeout: 1000 } : {})}>
      <Card className={classes.root}>
        <CardContent>
            {button == 'signIn' && 
            <Typography
                gutterBottom
                variant="h5"
                component="h1"
                className={classes.title}
            >
                Sign in now to become an active part of the solemate community.
            </Typography>
            }
            <Grid container justifyContent='center'>
                {button == 'signIn' && 
                <Button variant='contained' onClick={handleSignIn} sx={{justifySelf: 'center'}}>
                    Sign In
                </Button>
                }
            </Grid>
            
            
            {button == 'anon' && 
            <Typography
                gutterBottom
                variant="h5"
                component="h1"
                className={classes.title}
            >
                Continue anonymously, without signing in.
            </Typography>
            }
            {button == 'anon' && 
            <Typography
                gutterBottom
                variant="h6"
                component="h6"
                className={classes.desc}
            >
                Data collected during this session may be lost, unless you sign in before exiting.
            </Typography>
            
            }
            <Grid container justifyContent='center'>
                {button == 'anon' &&       
                <Button variant='contained' onClick={handleAnon}>
                    Continue Anonymously
                </Button>
                }
            </Grid>

            
        </CardContent>
      </Card>
    </Collapse>
  );
}