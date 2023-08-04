import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import WelcomeHeader from './WelcomeHeader';
import PlaceToVisit from './PlaceToVisit';
import BackgroundFaded from '../../components/background_faded.png';
import { useNavigate } from "react-router-dom";
import firebase from 'firebase';

const useStyles = makeStyles((theme) => ({
    root: {
      minHeight: '100vh',
      //backgroundImage: `url(${process.env.PUBLIC_URL + '/assets/bg.jpg'})`,
      //backgroundImage: `url(https://wallpaper.dog/large/11000082.png)`,
      backgroundImage: `url(${BackgroundFaded})`,
      //backgroundColor: '#000000',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover'
    },
}));
export default function Welcome() {
    const classes = useStyles();
    let navigate = useNavigate();

    useEffect(() => {
        if (firebase.auth().currentUser !== null){
            let path = '/home'
            navigate(path);
        }
    }, [])
    return (
        <div className={classes.root}>
        <CssBaseline />
            <WelcomeHeader />
        <PlaceToVisit />
        </div>
    );
}