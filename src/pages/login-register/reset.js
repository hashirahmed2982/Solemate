import React, { useEffect, useState, Component } from 'react';
import { Button, TextField } from '@mui/material';
import firebase from 'firebase';
import Template from '../../template/Template';


function Reset(){
    const [email, setEmail] = useState("");

    const sendPasswordReset = async () => {
        try {
          firebase.auth().sendPasswordResetEmail(email);
          alert("Password reset link sent!");
        } catch (err) {
          console.error(err);
          alert(err.message);
        }
      };

    return (
      <Template>

          <div className="wrap-login100">
            <div className="login100-pic">
              <a href="/">
                <img
                  src="https://t4.ftcdn.net/jpg/02/34/14/01/360_F_234140114_P6F2WevPp2iilkFJmoLOmlApM0Nn57AL.jpg"
                  alt="img"
                />
              </a>
            </div>
      
            <form className="login100-form">
              <span className="login100-form-title">RESET YOUR PASSWORD</span>
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
      
              
      
      
              <div className="container-login100-form-btn">
                <button className="login100-form-btn" type="submit" onClick={sendPasswordReset}>Register</button>
              </div>
              <div class="text-center p-t-116">
                    <a class="txt2" href="/">
                      Login Page
                    </a>
                  </div>
            </form>
          </div>
      </Template>
      );

}
export default Reset;