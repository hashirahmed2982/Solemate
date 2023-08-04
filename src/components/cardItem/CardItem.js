import React, { useState, useEffect } from "react";

import { db, storage } from '../../firebase';
import firebase, { firestore } from "firebase";import "../../pages/cart/cart.css";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import { TiDeleteOutline } from "react-icons/ti";
import { useNavigate } from "react-router";

const CardItem = ({image, name, brand, size, price, id, quantity, index, cartPassed}) => {
  const navigate = useNavigate();
  var counter = 0;
  var counters = 0;
  var indexs = 0;
  const [cart, setCart] = useState(cartPassed);
  const [total, setTotal] = useState(0);
  const [qua, setqua] = useState(quantity);
  var changed = true;
   
  async function removeInDatabase() {
    await db.collection('users').doc(firebase.auth().currentUser.uid).update({cart: cart});
  }

  useEffect(() => {
    if (cart.length != 0){
      removeInDatabase();
    } 
    console.log("CART AFTER REMOVAL: ", cart);
  }, [cart])

  async function remove(){
    console.log("CART BEFORE REMOVAL: ", cart);
    var temp = [...cart];
    if (temp.length > 1) {
      temp.map((cartItem, i) => {
        if (cartItem.ID == id && cartItem.size == size) {
          console.log("NAME: ", name);
          console.log("SIZE: ", size);
          temp.splice(i, 1);
          setCart(temp);
        }
      })
    }
    else {
      setCart([]);
      await db.collection('users').doc(firebase.auth().currentUser.uid).update({cart: []});

    }
  }

  /*function plus(){
    setqua(qua+1);
    
    cart.forEach(val => {
      if(val.ID == id){
        index=counter;
      }
      counter+=1       
    })
    console.log(index);
    cart[index].quantity = qua;
    db.collection('users').doc(firebase.auth().currentUser.uid).update({cart:cart,total:parseInt(total) + parseInt(cart[index].price) });
  }
  
  function minus(){
    setqua(qua-1);
    cart.forEach(val => {
      if(val.ID == id){
        indexs=counters;
      }
      counters+=1;       
    })
    console.log(indexs);
    db.collection('users').doc(firebase.auth().currentUser.uid).get().then((snapshot) => {
      cart[indexs].quantity = qua;
    }).then(()=>{
      db.collection('users').doc(firebase.auth().currentUser.uid).update({cart:cart,total:parseInt(total) - parseInt(cart[index].price) });
    })
  }*/

  return (
    <>
      <div align="center">
        <hr style={{ width: "90%" }} />
      </div>
      <div className="Cart-Items">
        <div className="image-box" onClick={() => navigate("/product")}>
          <img src={image} style={{ height: "120px" }} />
        </div>
        <div className="about" style={{display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
          <h1 className="title">{name}</h1>
          <h3 className="subtitle">{brand}</h3>
          <h3 className="subtitle">{size}</h3>
        </div>

        <div className="counter">
          <AiOutlinePlusCircle size={30} onClick={() => {}} />
          <div className="count">{qua}</div>
          <AiOutlineMinusCircle size={30} onClick={() => {}}/>
        </div>
        <div className="prices">
          <button className="remove" onClick={remove}>
            <TiDeleteOutline size={30} />
          </button>
          <div className="amount">{price}TL</div>
        </div>
      </div>
    </>
  );
};

export default CardItem;
