
import { AiOutlineArrowRight } from "react-icons/ai";
import "./login-register.css";
import Logo from "../../components/logo.jpeg";
import React, { useEffect, useState, Component } from 'react';
import { Button, TextField } from '@mui/material';
import firebase from 'firebase';
//import Todo from './Todo';
import { db } from '../../firebase';
import  {FaFacebook}  from "react-icons/fa";
import  {FaGoogle}  from "react-icons/fa";
import  {FaApple}  from "react-icons/fa";
import "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Template from "../../template/Template";


const Register = () => {

  function encrypt(text){
    var crypto = require('crypto');
    var cipher = crypto.createCipher('aes-256-cbc','d6F3Efeq')
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
  }
  function decrypt(text){
    var crypto = require('crypto');
    var decipher = crypto.createDecipher('aes-256-cbc','d6F3Efeq')
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
  }

  let navigate = useNavigate();  

  useEffect(() => {
    if (firebase.auth().currentUser !== null) {
      let path = '/home';
      navigate(path);
    }
    
  }, [])
    const [username, setUsername] = useState([]);
    const [rpass, setrpass] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const cart = [];


    const signup = (event) => {
        event.preventDefault();
        const member = "customer";
        //registerWithEmailAndPassword(username,email,password);
       const res = firebase.auth().createUserWithEmailAndPassword(email,password)
            .then(async () =>{
                const user = firebase.auth().currentUser;
                db.collection('users').doc(`${user.uid}`).set({
                     uid: user.uid,
                     user: username,
                     pass: encrypt(password),
                     email: email,
                     member: member,
                     cart: cart,
                     favourite: [],
                     timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                     notifications: [],
                   })

                   
                   if(firebase.auth().currentUser.uid != null){
                    let path = '/'; 
                      navigate(path);
                   }
        })
        setUsername('');
        setrpass('');
        setPassword('');
        setEmail('');
  
    }
  return (
    <Template>

      <div className="wrap-login100">
        <div className="login100-pic">
          <a href="/">
            <img src={Logo} alt="logo" className="loginImg" />
          </a>
        </div>

        <form className="login100-form">
          <span className="login100-form-title">REGISTER</span>
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
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={event => setUsername(event.target.value)}
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

          <div className="wrap-input100">
            <input
              className="input-field"
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              value={rpass}
              onChange={event => setrpass(event.target.value)}
            />
          </div>

          <div className="container-login100-form-btn">
            <button className="login100-form-btn" type="submit" onClick={signup}>Register</button>
          </div>

          <div className="loginText">Sign Up With</div>
          <div className="social-icons">
            <button>
              <FaFacebook className="social-icon" size={50} />
            </button>
            <button>
              <FaGoogle className="social-icon" size={50} />
            </button>
            <button>
              <FaApple className="social-icon" size={50} />
            </button>
          </div>
          <div class="text-center p-t-36">
            <a class="txt2" href="/login">
              Already Have An Account? <AiOutlineArrowRight />
            </a>
          </div>
        </form>
      </div>
    </Template>
  );
}

export default Register