import React from 'react'
import './myaccount.css';
import "../../template/Template";
import Template from "../../template/Template";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import firebase, { firestore } from 'firebase';
import { db } from '../../firebase';
import { useState, useEffect } from 'react';


const MyAccount = () => {
  const [username,setUsername] = useState();
  useEffect(()=>{
    setUsername(firebase.auth().currentUser.displayName);
  },[]);
  return (
    <Template>
      <html>
        <div className="Body-Container2">
          <div className="Cart-Container2" style={{ textAlign: "center" }}>
            <FaUserCircle
              style={{ color: "#f77d0b", margin: "0 20px 0 20px" }}
              size={150}
            />
            <div className="name">
              {username == null ? (
                <h1>`Ahsen`</h1>
              ) : (
                username
              )}
            </div>
            <hr className="horizon" />
            <div
              className="Cart-Container3"
              style={{ marginLeft: "10%", textAlign: "center" }}
            >
              <Link
                to="/myorder"
                className="btn btn-primary bottom-mg-15 bg-orange border-white"
                style={{ width: "125%", height: "25%", paddingTop: "20px" }}
                replace
              >
                My Orders
              </Link>
            </div>
          </div>
        </div>
      </html>
    </Template>
  );
}

export default MyAccount