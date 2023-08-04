

import "./login-register.css";
import Logo from '../../components/logo.jpeg';
import React, { useEffect, useState, Component } from 'react';
import { Button, TextField } from '@mui/material';
import firebase from 'firebase';
//import Todo from './Todo';
import { db } from '../../firebase';
import  {FaFacebook}  from "react-icons/fa";
import  {FaGoogle}  from "react-icons/fa";
import  {FaApple}  from "react-icons/fa";
import { AiOutlineArrowRight } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
//import { getAuth } from "firebase/auth";

import collection from "firebase/firebase-firestore";
//import getFirestore from "firebase/firebase-firestore";
import query from "firebase/firebase-firestore";
//import getDocs from "firebase/firebase-firestore";
import where from "firebase/firebase-firestore";
import addDoc from "firebase/firebase-firestore";
import Template from "../../template/Template";

const Login = () => {
  let navigate = useNavigate();  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const provider = new firebase.auth.GoogleAuthProvider;
  const provider1 = new firebase.auth.FacebookAuthProvider;

  const [anonData, setAnonData] = useState({});
  const [anonDataLoaded, setAnonDataLoaded] = useState(0);

  const google = async(event)=>{
    event.preventDefault();
    
    firebase.auth().signInWithPopup(provider).then(()=>{
  // This gives you a Google Access Token. You can use it to access the Google API.
  //const credential = firebase.auth.GoogleAuthProvider.credentialFromResult(result);
  //const token = credential.accessToken;
  // The signed-in user info.
  const user = firebase.auth().currentUser;
  const q = db.collection('users').where("uid", "==", user.uid).get().then((snapshot)=>{
  //const q = db.collection('users').doc(user.uid).get().then((snapshot)=>{
  const docs =  snapshot.docs;

  console.log(docs);
  if (docs.length == 0) {
    db.collection('users').add( {
      uid: user.uid,
      username: user.displayName,
      authProvider: "google",
      password:"googlesignin",
      email: user.email,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }
});
}).then(()=>{
  if(firebase.auth().currentUser != null){
    let path = '/'; 
      navigate(path);
  }
  })
.catch((error)=>{
  //Handle Errors here.
  const errorCode = error.code;
  setErrorMessage(error.message) ;
  //The email of the user's account used.
  const email = error.email;
  //The AuthCredential type that was used.
  const credential = firebase.auth.GoogleAuthProvider.credentialFromError(error);
  
//});
  });
}
  const facebook = async(event)=>{
    event.preventDefault();
    firebase.auth().signInWithPopup(provider1).then(() => {
  // This gives you a Google Access Token. You can use it to access the Google API.
  //const credential = firebase.auth.GoogleAuthProvider.credentialFromResult(result);
  //const token = credential.accessToken;
  // The signed-in user info.
  const user = firebase.auth().currentUser;
  const q = db.collection('users').where("uid", "==", user.uid).get().then((snapshot)=>{
    //const q = db.collection('users').doc(user.uid).get().then((snapshot)=>{
    const docs =  snapshot.docs;

    console.log(docs);
    if (docs.length == 0) {
      db.collection('users').add( {
        uid: user.uid,
        username: user.displayName,
        authProvider: "facebook",
        password:"fbsignin",
        email: user.email,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
  });
  }).then(()=>{
    if(firebase.auth().currentUser != null){
      let path = '/'; 
        navigate(path);
    }
    })
  .catch((error)=>{
    //Handle Errors here.
    const errorCode = error.code;
    setErrorMessage(error.message);
    //The email of the user's account used.
    const email = error.email;
    //The AuthCredential type that was used.
  // const credential = firebase.auth.GoogleAuthProvider.credentialFromError(error);
    
  //});
    });
  }

  const sendPasswordReset = async (email) => {
    try {
      firebase.auth().sendPasswordResetEmail('hashira690@gmail.com');
      alert("Password reset link sent!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  async function getAnonData (event){
    if (firebase.auth().currentUser != null){
      if (firebase.auth().currentUser.isAnonymous){
        await db.collection('users').doc(firebase.auth().currentUser.uid).get().then(snapshot => {
          setAnonData(snapshot.data());
        });
      }
    }
  }

  useEffect(() => {
    getAnonData();
    if (firebase.auth().currentUser !== null) {
      // let path = '/home';
      let path = "/login";
      navigate(path);
    }
  }, [])

  useEffect(() => {
    console.log(anonData);
    setAnonDataLoaded(1);
  }, [anonData])

  async function HandleAnonLogin (event) {
    event.preventDefault();
    let userType = '';
    await db.collection('users').doc(firebase.auth().currentUser.uid).delete().then(async () => {
      await firebase.auth().currentUser.delete();
    }).then(() => {
      firebase.auth().signInWithEmailAndPassword(email, password).then(async ()=>{
        const user = firebase.auth().currentUser;
        var cart = [];
        var favourite = [];
        await db.collection('users').doc(user.uid).get().then((doc) => {
          cart = doc.data().cart;
          favourite = doc.data().favourite;
        }).then(async () => {
          console.log(cart);
          console.log(favourite);
          anonData.cart.map((cartItem) => {
            const isFound = cart.some(element => {
              if (element.name == cartItem.name && element.size == cartItem.size) {
                return true;
              }

              return false;
            });
            if (!isFound){
              cart = [...cart, cartItem];
            }
          });
          anonData.favourite.map((favItem) => {
            const isFound = favourite.some(element => {
              if (element == favItem) {
                return true;
              }
              return false;
            });
            if (!isFound){
              favourite = [...favourite, favItem];
            }
          });
          //var updatedCart = [...cart, ...anonData.cart];
          //var updatedFavourite = [...favourite, ...anonData.favourite];
          await db.collection('users').doc(`${user.uid}`).update({
            cart: cart,
            favourite: favourite,
          });
        })
        }).then(() => {
            let path = '/home';
            navigate(path);
        })
  
      .catch ((err) =>{
      console.error(err);
      setErrorMessage(err.message);
      });
      setPassword('');
      setEmail('');
    })
  }  

  async function HandleLogin (event) {
    event.preventDefault();
    let userType = '';
    firebase.auth().signInWithEmailAndPassword(email, password).then(()=>{
      const user = firebase.auth().currentUser;
      db.collection('users').doc(`${user.uid}`).get().then((snapshot) => {
        let data = snapshot.data();
        userType = data['member']; 
      }).then(() => {
        if (userType == 'productManager') {
          let path = '/pmHome';
          navigate(path);
        }
        else if (userType == 'salesManager') {
          let path = '/smHome';
          navigate(path);
        }
        else if (firebase.auth().currentUser != null && userType == 'customer'){
          let path = '/'; 
          navigate(path);
        }
      })
      
      })
    .catch ((err) =>{
      console.error(err);
      setErrorMessage(err.message);
      //alert(err.message);
    });
  // navigate('/Homepage');
  setPassword('');
  setEmail('');
  
  }
  
  return (
    <Template>

    <div className="Login">
      <div className="wrap-login100">
        <div className="login100-pic">
          <a href="/">
            <img
              src={Logo}
              alt="logo"
              className="loginImg"
            />
          </a>
        </div>

        <form className="login100-form">
          <span className="login100-form-title">LOGIN</span>
          <div className="wrap-input100">
            <input
              className="input-field"
              type="text"
              name="email"
              placeholder="Email"
              value={email}
            onChange={event => setEmail(event.target.value)}
            />
          </div>

          <div className="wrap-input100">
            <input
              className="input-field"
              type="password"
              name="password"
              placeholder="Password"
              value={password}
            onChange={event => setPassword(event.target.value)}
            />
          </div>
          {firebase.auth().currentUser == null && 
            <div className="container-login100-form-btn">
              <button className="login100-form-btn" type="submit" onClick={HandleLogin}>Login</button>
            </div>
          }
          {firebase.auth().currentUser != null && firebase.auth().currentUser.isAnonymous == false && 
            <div className="container-login100-form-btn">
              <button className="login100-form-btn" type="submit" onClick={HandleLogin}>Login</button>
            </div>
          }
          {firebase.auth().currentUser != null && firebase.auth().currentUser.isAnonymous == true && anonDataLoaded == 1 && 
            <div className="container-login100-form-btn">
              <button className="login100-form-btn" type="submit" onClick={HandleAnonLogin}>Login to Existing Account</button>
            </div>
          }
          {firebase.auth().currentUser != null && firebase.auth().currentUser.isAnonymous == true && anonDataLoaded == 0 && 
            <div className="container-login100-form-btn">
              <button disabled className="login100-form-btn" type="submit">...</button>
            </div>
          }
          {errorMessage && <div className="error"> {errorMessage} </div>}

          <div className="loginText">Log In With</div>
          <div className="social-icons">
            <button>
              <FaFacebook className="social-icon" size={50}  onClick={facebook}/>
            </button>
            <button>
              <FaGoogle className="social-icon" size={50} onClick={google}/>
            </button>
            <button>
              <FaApple className="social-icon" size={50} />
            </button>
          </div>
          <div className="text-center p-t-12">
              <span className="txt1">Forgot </span>
              <a className="txt2" href={"/Reset"} >
                Username / Password?
              </a>
            </div>

          <div className="text-center p-t-56">
            <a className="txt2" href="/register">
              Create your Account <AiOutlineArrowRight />
            </a>
          </div>
        </form>
      </div>
    </div>
    </Template>
  );
};

export default Login;
