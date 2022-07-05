
import './myorder.css';
import "../../template/Template";
import Template from "../../template/Template";
import React, { useEffect, useState } from 'react';

import { Link } from "react-router-dom";
import { db, storage } from '../../firebase';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import firebase from "firebase";

import { styled, useTheme } from '@mui/material/styles';
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import TextField from "@mui/material/TextField";


const MyOrder = () => {
    
const [orders, setOrders] = useState([]);
const [openReturn, setOpenReturn] = useState(false);
const [cancelReason, setCancelReason] = useState(false);

function handleInputChange(e) {
    console.log(e.target.value);
    setCancelReason(e.target.value);
}
function changeStatusCancelled(id) {
    db.collection('orders').get()
    .then((querySnapshot) => {
        querySnapshot.forEach(async (snapshot) =>  {
            if (snapshot.id.toString().includes(id)){
                await db.collection('orders').doc(snapshot.id).update({
                    status: 'cancelledUser',
                })
            }
        })
    })
}
function changeStatusReturn(id) {
    db.collection('orders').get()
    .then((querySnapshot) => {
        querySnapshot.forEach(async (snapshot) =>  {
            if (snapshot.id.toString().includes(id)){
                await db.collection('orders').doc(snapshot.id).update({
                    status: 'returnRequested',
                })
            }
        })
    })
}


const handleClickOpenReturn = () => {
    setOpenReturn(true);
};

const handleCloseReturn = () => {
    setCancelReason('');
    setOpenReturn(false);
};

function calculatetime(time){
    var date = new Date();
    var dateOrder = time.toDate();
    console.log("DATE", date);
    console.log("ORDER DATE", dateOrder);
    const diff = date - dateOrder;
    //console.log(diff);
    console.log("curr",diff);
    return diff;
}
  
useEffect(() => {
  // this code fires when the app.js loads
  db.collection('orders').onSnapshot(snapshot => {
    //console.log((snapshot.docs.map(doc => doc.data().name)));
    setOrders(snapshot.docs.map(doc => {
      const customerDetails = doc.data().customerDetails;
      const cuid = customerDetails.uid;
      const id = doc.data().orderID;
      const price = doc.data().total;
      const status = doc.data().status;
      const time = doc.data().timeStamp;
      const reason = doc.data().cancelReason;
      const diff = calculatetime(doc.data().timeStamp);
      return {customerDetails,id,price,cuid,status,time,diff,reason}}));
  });

  if (firebase.auth().currentUser != null) {
    db.collection('users').doc(firebase.auth().currentUser.uid).get().then((snapshot) => {
      var values = snapshot.data();
    })
  }

  console.log("order",orders);
  
}, []);
    return (
        <Template>
            <html style={{paddingTop: '4rem'}}>
            {
            orders.map(order => {
                if( order.cuid == firebase.auth().currentUser.uid){
                return(
                    <div class="container px-1 px-md-4 mx-auto">
                            <div class="card">
                                <div class="row d-flex justify-content-between px-3 top">
                                    <div class="d-flex">
                                        <h5>Order No:<span class="text-primary font-weight-bold">{order.id}</span></h5>
                                    </div>
                                    <div class="d-flex flex-column text-sm-right">


                                    </div>
                                </div>
                                <div class="row d-flex justify-content-center">
                                    <div class="col-12">
                                        <ul id="progressbar" class="text-center">
                                            {order.status == "confirmed" &&
                                                <><li class="active step0"></li><li class="active step0"></li><li class="step0"></li><li class="step0"></li></>}
                                            {order.status == "inTransit" &&
                                                <><li class="active step0"></li><li class="active step0"></li><li class="active step0"></li><li class="step0"></li></>}
                                            {order.status == "returnRequested" &&
                                                <><li class="active step0"></li><li class="active step0"></li><li class="active step0"></li><li class="active step0"></li></>}
                                            {order.status == "delivered" &&
                                                <><li class="active step0"></li><li class="active step0"></li><li class="active step0"></li><li class="active step0"></li></>}
                                        </ul>
                                    </div>
                                </div>
                                {order.status == "confirmed" && <div class="d-flex flex-column text-sm-right">
                                    <p class="mb-0" style={{ marginLeft: "165px" }}>Order Status: <span>Order is Confirmed</span></p>
                                </div>}
                                {order.status == "delivered" && <div class="d-flex flex-column text-sm-right">
                                    <p class="mb-0" style={{ marginLeft: "165px" }}>Order Status: <span>Delivered</span></p>
                                </div>}
                                {order.status == "inTransit" && <div class="d-flex flex-column text-sm-right">
                                    <p class="mb-0" style={{ marginLeft: "165px" }}>Order Status: <span>Order is on route</span></p>
                                </div>}
                                {order.status == "returnRequested" && <div class="d-flex flex-column text-sm-right">
                                    <p class="mb-0" style={{ marginLeft: "165px" }}>Order Status: <span>Return request is being evaluated</span></p>
                                </div>}
                                {order.status == "returnProcessed" && <div class="d-flex flex-column text-sm-right">
                                    <p class="mb-0" style={{ marginLeft: "165px" }}>Order Status: <span>Return request is accepted</span></p>
                                </div>}
                                {order.status == "cancelled" && <div class="d-flex flex-column text-sm-right">
                                    <p class="mb-0" style={{ marginLeft: "165px" }}>Order Status: <span>Cancelled by Distributor</span></p>
                                    <p class="mb-0" style={{ marginLeft: "165px" }}>Reason: <span>{order.reason}</span></p>
                                </div>}
                                {order.status == "cancelledUser" && <div class="d-flex flex-column text-sm-right">
                                    <p class="mb-0" style={{ marginLeft: "165px" }}>Order Status: <span>Cancelled by User</span></p>
                                </div>}
                                {order.status == "confirmed" && <div className="d-grid gap-2">
                                    <button
                                        className="btn btn-outline-dark"
                                        style={{ borderColor: "#f77d0b", marginLeft: '140px', marginRight: '140px', marginTop: '30px' }}
                                        onClick={() => {changeStatusCancelled(order.id)}}
                                    >
                                        Cancel
                                    </button>
                                </div>}
                                {order.status == "delivered" && order.diff <= 2592000000 && <div className="d-grid gap-2">
                                    <button
                                        className="btn btn-outline-dark"
                                        style={{ borderColor: "#f77d0b", marginLeft: '140px', marginRight: '140px', marginTop: '30px' }}
                                        onClick={() => {changeStatusReturn(order.id)}}
                                    >
                                        Return
                                    </button>
                                </div>}

                            </div>
                        </div>
                )}})}

                <hr className="horizon" />

               
            </html>

        </Template>

    )
}

export default MyOrder