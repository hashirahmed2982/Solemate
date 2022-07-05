
import { db, storage } from '../../firebase';
import firebase from "firebase";
import React, { useState, useEffect } from "react";
import "../cart/cart.css";
import Template from "../../template/Template";
import { useNavigate } from "react-router";

import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import { TiDeleteOutline } from "react-icons/ti";


function Notifications(){
    const [Notif, setNotif] = useState([]);
  const [NotifNums, setNotifNums] = useState([]);

  
  async function getData() {
    if (firebase.auth().currentUser != null) {
      var uid = firebase.auth().currentUser.uid;
      db.collection('users').doc(`${uid}`).get().then((snapshot) => {
        var values = snapshot.data();
        setNotif(values.notifications);
        setNotifNums(values.notifications);
      })
    }
  }

  var loggedIn = firebase.auth().currentUser != null ? firebase.auth().currentUser.isAnonymous : false;
  
  useEffect(() => {
    getData();
  }, []);

  async function removeAll(){
    setNotif([]);
    await db.collection('users').doc(firebase.auth().currentUser.uid).update({notifications: []});
  }

  async function removeNoti(idx){
    console.log("IDX", idx)
    var temp = [...Notif];
    console.log("TEMP BEFORE", temp);
    temp.splice(idx, 1);
    console.log(temp);
    setNotif(temp);
    if (temp.length == 0) {
        await db.collection('users').doc(firebase.auth().currentUser.uid).update({notifications: []});
    }
  }

  useEffect(() => {
    if (Notif.length > 0){
        db.collection('users').doc(firebase.auth().currentUser.uid).update({notifications: Notif});
    }
    }, [Notif])


  
  return (
    <Template>
      <div className="Body-Container" >
        <div className="Cart-Container" style={{ overflowY: "scroll"}}>
          <div className="Header22">
            <h3 className="Heading">Notifications</h3>
            {Notif.length > 0 && 
              <button className="Action" onClick={removeAll}>Dismiss all</button>
            }
          </div>
          {/* {(image, name, brand, size, price,id)} */}
          {Notif.length > 0 ? 
             <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 px-md-5">
              {Notif.map((Not, idx) => (  
                <>
                  <div align="center">
                    <hr style={{ width: "250%" }} />
                  </div>
                  <div className="Cart-Items">
                    <span className="about">
                      <h6 style={{display:'flex', justifyContent:'center'}}>{Not}</h6>           
                    </span>
                    <span>
                        <button className="remove" onClick={() => {removeNoti(idx)}}>
                            <TiDeleteOutline size={30} />
                        </button>         
                    </span>
                  </div>
                </>
              ))}
            </div> : 
            <div style={{justifySelf:'center', textAlign:'center', display:'flex', justifyContent:'center'}}>No New Notifications :(</div>
          }
         
          <div align="right">
            <hr style={{ width: "100%" }} />
          </div>
        </div>
      </div>
    </Template>
  );

}
export default Notifications;