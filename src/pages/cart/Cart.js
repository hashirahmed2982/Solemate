import { db, storage } from '../../firebase';
import firebase from "firebase";
import React, { useState, useEffect } from "react";
import "./cart.css";
import Template from "../../template/Template";
import { useNavigate } from "react-router";

import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import { TiDeleteOutline } from "react-icons/ti";

function Cart () {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [cartNums, setCartNums] = useState([]);
  const [sum, setSum] = useState(0);
  
  async function getData() {
    if (firebase.auth().currentUser != null) {
      var uid = firebase.auth().currentUser.uid;
      db.collection('users').doc(`${uid}`).get().then((snapshot) => {
        var values = snapshot.data();
        setCart(values.cart);
        setCartNums(values.cart);
      })
    }
  }

  var loggedIn = firebase.auth().currentUser != null ? firebase.auth().currentUser.isAnonymous : false;
  
  useEffect(() => {
    getData();
  }, []);

  async function removeAll(){
    setCart([]);
    await db.collection('users').doc(firebase.auth().currentUser.uid).update({cart: []});
  }

  async function remove(id, size){
    var temp = [...cart];
    if (temp.length > 1) {
      temp.map((cartItem, i) => {
        if (cartItem.ID == id && cartItem.size == size) {
          temp.splice(i, 1);
          console.log('CART', temp);
          setCart(temp);
        }
      })
    }
    else {
      setCart([]);
      await db.collection('users').doc(firebase.auth().currentUser.uid).update({cart: []});
    }
  }

  async function removeInDatabase() {
    await db.collection('users').doc(firebase.auth().currentUser.uid).update({cart: cart});
  }

  function total(){
    if (cart.length == 0){
      setSum(0);
    }
    else {
      var temp = 0;
      cart.map(val =>{
        temp += parseInt(val.price, 10) * val.quantity;
      })
      setSum(temp);
    }
  }

  useEffect(() => {
    total();
    if (cart.length != 0){
      setCartNums(cart);
      removeInDatabase();
    } 
  }, [cart])

  async function updateQuantityInDatabase() {
    await db.collection('users').doc(firebase.auth().currentUser.uid).update({cart: cartNums});
  }

  function add(idx){
    var temp = [...cartNums];
    temp[idx].quantity += 1;
    setCartNums(temp);
  }

  function subtract(idx){
    var temp = [...cartNums];
    temp[idx].quantity -= 1;
    setCartNums(temp);
  }

  useEffect(() => {
    total();
    if (cartNums.length != 0) {
      updateQuantityInDatabase();
    }
  }, [cartNums])
  

  return (
    <Template>
      <div className="Body-Container" >
        <div className="Cart-Container" style={{ overflowY: "scroll"}}>
          <div className="Header22">
            <h3 className="Heading">Shopping Cart</h3>
            {cart.length > 0 && 
              <button className="Action" onClick={removeAll}>Remove all</button>
            }
          </div>
          {/* {(image, name, brand, size, price,id)} */}
          {cart.length > 0 ? 
             <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 px-md-5">
              {cart.map((cartItem, idx) => (  
                <>
                  <div align="center">
                    <hr style={{ width: "90%" }} />
                  </div>
                  <div className="Cart-Items">
                    <div className="image-box" onClick={() => navigate("/product")}>
                      <img src={cartItem.picture} style={{ height: "120px" }} />
                    </div>
                    <div className="about">
                      <h1 className="title" style={{display:'flex', justifyContent:'center'}}>{cartItem.name}</h1>
                      <h3 className="subtitle" style={{display:'flex', justifyContent:'center'}}>{cartItem.brand} - Size {cartItem.size}</h3>
                      
                    </div>
            
                    <div className="counter">
                      {cartItem.quantity > 1 ?
                        <AiOutlineMinusCircle size={30} onClick={() => {subtract(idx);}}/> :
                        <AiOutlineMinusCircle size={30} color='#f8f9fb' onClick={null}/>
                      }
                      
                      <div className="count">{cartItem.quantity}</div>
                      {cartItem.quantity < 3 ?
                        <AiOutlinePlusCircle size={30} onClick={() => {add(idx);}} /> :
                        <AiOutlinePlusCircle size={30} color='#f8f9fb' onClick={null} />
                      }
                    </div>
                    <div className="prices">
                      <button className="remove" onClick={() => {remove(cartItem.ID, cartItem.size)}}>
                        <TiDeleteOutline size={30} />
                      </button>
                      <div className="amount">{cartItem.price}TL</div>
                    </div>
                  </div>
                </>
              ))}
            </div> : 
            <div style={{justifySelf:'center', textAlign:'center', display:'flex', justifyContent:'center'}}>Your cart is empty... :(</div>
          }
         
          <div align="right">
            <hr style={{ width: "100%" }} />
          </div>
          <div className="checkout">
            {cart.length > 0 && 
              <div className="total">
              <div>
                <div className="Subtotal">Total</div>
                <div className="items">{cart.length} items</div>
              </div>
              <div className="total-amount">{sum} TL</div>
            </div> 
            }
            {firebase.auth().currentUser != null && firebase.auth().currentUser.isAnonymous == false && cart.length > 0 &&
              <button className="checkoutbutton" onClick={()=>{
                navigate('/checkout');
              }}>
                Checkout
              </button>
            }
            {cart.length <= 0 &&
              <button className="checkoutbutton" onClick={()=>{
                navigate('/');
              }}>
                Continue Shopping
              </button>
            }
            {firebase.auth().currentUser != null && firebase.auth().currentUser.isAnonymous == true && cart.length > 0 &&
              <button className="checkoutbutton" onClick={()=>{
                navigate('/login');
              }}>
                Login Required
              </button>
            }
            {firebase.auth().currentUser == null &&
              <button className="checkoutbutton" onClick={()=>{
                navigate('/login');
              }}>
                Login Required
              </button>
            }

            
          </div>
        </div>
      </div>
    </Template>
  );
};

export default Cart;