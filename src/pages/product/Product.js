import React, { useState, useEffect } from "react";
import Ratings from "react-ratings-declarative";

import { BsFillHeartFill, BsHeart } from "react-icons/bs";
import ScrollToTopOnMount from "../../template/ScrollToTopOnMount";
import UserComment from "../../components/commentBox/UserComment";
import FlashMessage from "../../components/FlashMessage";
import Template from "../../template/Template";
import "./product.css";
import { useLocation, useParams } from 'react-router-dom';
import { db, storage } from '../../firebase';
import firebase from "firebase";
import CircularProgress from '@mui/material/CircularProgress';

const iconPath =
  "M18.571 7.221c0 0.201-0.145 0.391-0.29 0.536l-4.051 3.951 0.96 5.58c0.011 0.078 0.011 0.145 0.011 0.223 0 0.29-0.134 0.558-0.458 0.558-0.156 0-0.313-0.056-0.446-0.134l-5.011-2.634-5.011 2.634c-0.145 0.078-0.29 0.134-0.446 0.134-0.324 0-0.469-0.268-0.469-0.558 0-0.078 0.011-0.145 0.022-0.223l0.96-5.58-4.063-3.951c-0.134-0.145-0.279-0.335-0.279-0.536 0-0.335 0.346-0.469 0.625-0.513l5.603-0.815 2.511-5.078c0.1-0.212 0.29-0.458 0.547-0.458s0.446 0.246 0.547 0.458l2.511 5.078 5.603 0.815c0.268 0.045 0.625 0.179 0.625 0.513z";

function Product() {
  const params = useParams();
  const { id } = params;
  console.log("ID", id);
  var inside = false;
  var index = 0;
  var counter = 0;
  var buttonPressed = false;
  //const location = useLocation();
  //const { id } = location.state;
  const [rate, setRate] = useState(2.5);
  const [alert, setAlert] = useState(false);
  const [brand, setbrand] = useState(false);
  const [category, setcategory] = useState(false);
  const [distributor, setdistributor] = useState(false);
  const [description, setdescription] = useState(false);
  const [name, setname] = useState(false);
  const [url, seturl] = useState(false);
  const [price, setprice] = useState(false);
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [rating, setrating] = useState(2.5);
  const [size, setsize] = useState([]);
  const [sum, setsum] = useState(0);
  const [cart, setcart] = useState([]);
  const [favourite, setfavourite] = useState([]);
  const [warranty, setwarranty] = useState(false);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [user, setUser] = useState('');
  const [insideCart, setInsideCart] = useState(false);
  const [insideWishlist, setInsideWishlist] = useState(false);

  function changeRating(newRating) {
    setRate(newRating);
  }

  const [rendered, setRendered] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedSize, setSelectedSize] = useState('Select size');

  const getData = async () => {
    await db.collection('products').doc(`${id}`).get().then((snapshot) => {
      var values = snapshot.data();
      setname(values.name);
      setbrand(values.brand);
      seturl(values.pictureURLs);
      setprice(values.price);
      setDiscountedPrice(values.discountedPrice);
      setsize(values.sizesStocks);
      setwarranty(values.warrantyStatus);
      setdescription(values.description);
      setdistributor(values.distributor);
      setComments(values.comments);
      setcategory(values.category);
    })
    if (firebase.auth().currentUser != null) {
      await db.collection('users').doc(firebase.auth().currentUser.uid).get().then((snapshot) => {
        var values = snapshot.data();
        setcart(values.cart);
        setfavourite(values.favourite);
        setRendered(true);
        setUser(values.user);
      })
    }
  };
  
  useEffect(() => {
    getData();
    console.log(name);
  }, []);

  function alreadyInCart() {
    cart.map((cartItem) => {
      if (cartItem.ID == id){
        if (cartItem.size == selectedSize){
          setInsideCart(true);
          return;
        }
      }
    })
  }

  async function addToCart() {
    var cartItem = {
      name: name,
      brand: brand,
      picture: url[0],
      quantity: 1,
      ID: id,
      price: discountedPrice,
      size: selectedSize,
      category: category,
    }
    inside = false;
    cart.map((car, counter) =>{
      if(car.ID == cartItem.ID){
        if (car.size == cartItem.size){
          index = counter;
          inside = true;
        }
      }
    })
    if(!inside){
      setcart(oldArray => [...oldArray, cartItem]);
    }
    else{
      var tempcart = [...cart];
      if (tempcart[index].quantity <= 1){
        tempcart[index].quantity += 1;
        setcart(tempcart);
      }
    }
  }

  async function removeFromCart() {
    var bool = false;
    var temp = [...cart];
    cart.map((car, i) =>{
      if(car.ID == id){
        if (car.size == selectedSize){
          if (cart.length == 1){
            setcart([]);
            bool = true;
          }
          else {
            temp.splice(i, 1);
            setcart(temp);
          }
          
        }
      }
    })
    if (bool){
      await db.collection('users').doc(firebase.auth().currentUser.uid).update({cart: []});
    }
  }

  useEffect(() => {
    if (cart.length != 0){
      db.collection('users').doc(firebase.auth().currentUser.uid).update({cart: cart});
    }
    setInsideCart(false);
    alreadyInCart();
  }, [cart])

  useEffect(() => {
    console.log(selectedSize);
    setInsideCart(false);
    alreadyInCart();
  }, [selectedSize])

  function changeSize(e) {
    setSelectedSize(e.target.value);
    console.log(selectedSize);
  }

  function handleComment(e) {
    setComment(e.target.value);
  }

  function submitComment() {
    var obj = {
      user: user,
      rating: rate,
      comment: comment,
      timeStamp: firebase.firestore.Timestamp.now(),
      approved: false,
    }
    setComments([...comments, obj]);
  }

  function countComments(arr) {
    var count = 0;
    arr.map((a) => {
      if (a.approved == true){
        count++;
      }
    })
    return count;
  }

  useEffect(() => {
    if (comments.length > 0) {
      db.collection('products').doc(`${id}`).update({
        comments: comments,
      }).then(() => {
        setRate(2.5);
        setComment('');
      })
      var tempRating = 0;
      var tempCount = 0;
      comments.map((comment) => {
        if (comment.approved) {
          tempCount++;
          tempRating += comment.rating;
        }
      })
      if (tempCount > 0) {
        setrating(Math.ceil(tempRating/tempCount));
      }
      else {
        setrating(2.5);
      }
    }
  }, [comments])

  async function addToWishlist() {
    var inside = false;
    favourite.map((fav) =>{
      if(fav == id){
          inside = true;
      }
    })
    if(!inside){
      setfavourite(oldArray => [...oldArray, id]);
    }
  };

  async function removeFromWishlist() {
    var bool = false;
    var temp = [...favourite];
    favourite.map((fav, i) =>{
      if(fav == id){
        if (favourite.length == 1){
          setfavourite([]);
          bool = true;
        }
        else {
          temp.splice(i, 1);
          setfavourite(temp);
        }
      }
    })
    if (bool){
      await db.collection('users').doc(firebase.auth().currentUser.uid).update({favourite: []});
    }
  }

  function alreadyInWishlist() {
    favourite.map((fav) => {
      if (fav == id){
        setInsideWishlist(true);
        return;
      }
    })
  }

  useEffect(() => {
    if (favourite.length > 0) {
      db.collection('users').doc(firebase.auth().currentUser.uid).update({
        favourite: favourite,
      })
    }
    setInsideWishlist(false);
    alreadyInWishlist();
  }, [favourite])

  let check = false;

  if (rendered == true) {

    return (
      <Template>
        <div className="container mt-5 py-4 px-xl-5 ">
          <ScrollToTopOnMount />
          <div className="row mb-4 top-mg-20">
            <div className="d-none d-lg-block col-lg-1">
              <div className="image-vertical-scroller">
                <div className="d-flex flex-column">
                  {Array.from({ length: url.length }, (_, i) => {
                    let selected = i !== 1 ? "opacity-6" : "";
                    return (
                      <div key={i}>
                        <img
                          className={"rounded mb-2 ratio " + selected}
                          alt=""
                          src={url[i]}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="row">
                <div className="col-12 mb-4">
                  <img
                    className="border rounded ratio ratio-1x1"
                    alt=""
                    src= {url[0]}
                  />
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="d-flex flex-column h-100">
                <h2 className="mb-1">{name}</h2>
                {parseInt(discountedPrice, 10) >= parseInt(price, 10) && 
                  <h4 className="text-muted mb-4">{price} TL</h4>
                }
                {parseInt(discountedPrice, 10) < parseInt(price, 10) && 
                  <>
                    <h4 className="text-muted mb-4 nomargin" style={{textDecoration: 'line-through', textDecorationColor: '#cb144e', textDecorationThickness: '0.15rem'}}>{price} TL</h4> 
                    <h4 className="mb-4" style={{color: '#cb144e'}}>{discountedPrice} TL</h4>             
                  </>             
                }

                <div className="row g-3 mb-4">
                  {selectedSize !== 'Select size' && insideCart === false && 
                    <div className="col">
                      <button type='button' className="btn commentButton py-2 w-100" 
                      onClick={() => {
                        addToCart();
                      }}>
                        Add to Cart
                      </button>
                    </div>
                  }
                  {selectedSize !== 'Select size' && insideCart === true && 
                    <div className="col">
                      <button type='button' className="btn commentButtonRed py-2 w-100" 
                      onClick={() => {
                        removeFromCart();
                      }}>
                        Remove from Cart
                      </button>
                    </div>
                  }
                  {selectedSize === 'Select size' && 
                    <div className="col">
                      <button disabled className="btn commentButton py-2 w-100" >
                        Select Size
                      </button>
                    </div>
                  }

                  {insideWishlist == true && 
                    <div className="col" style={{display: 'flex', alignItems: 'end', color: '#f77d0b'}}>
                      <BsFillHeartFill size={40} onClick={removeFromWishlist}/>
                    </div>
                  }

                  {insideWishlist == false && 
                    <div className="col" style={{display: 'flex', alignItems: 'end'}}>
                      <BsHeart size={40} onClick ={addToWishlist}/>
                    </div>
                  }
                  
                </div>

                <label for="size-select" style={{ fontSize: "23px" }}>
                  Size:
                </label>
                <select
                  name="size"
                  id="size-select"
                  className="btn-outline py-1 w-100 bottom-mg-25"
                >
                  <option style={{ backgroundColor:'#ffffff' }} value="Select size" onClick={changeSize} >Select size</option>
                  {size.map((val) => {
                    if (parseInt(val.stock, 10) > 0){
                      return (
                        <option style={{ backgroundColor:'#ffffff' }} onClick={changeSize} value={val.size}>{val.size}</option>
                      )
                    }
                    else {
                      return (
                        <option style={{ backgroundColor:'#52525e', color:'#959595' }} value={val.size} disabled>
                          {val.size} - Out of Stock
                        </option>
                      )
                    }
                  })}
                  
                </select>
                  

                <h5 className="mb-0">{description}</h5>
                <hr />
                <dl className="row">
                  <dt className="col-sm-4">Code</dt>
                  <dd className="col-sm-8 mb-3">{id}</dd>

                  <dt className="col-sm-4">Category</dt>
                  <dd className="col-sm-8 mb-3">{category}</dd>

                  <dt className="col-sm-4">Brand</dt>
                  <dd className="col-sm-8 mb-3">{brand}</dd>

                  <dt className="col-sm-4">Distributor</dt>
                  <dd className="col-sm-8 mb-3">{distributor}</dd>

                  <dt className="col-sm-4">Warranty</dt>
                  <dd className="col-sm-8 mb-3">{warranty} day(s)</dd>

                  <dt className="col-sm-4">Rating</dt>
                  <dd className="col-sm-8 mb-3">
                    <Ratings
                      rating={rating}
                      widgetRatedColors="#f77d0b"
                      widgetSpacings="2px"
                    >
                      {Array.from({ length: 5 }, (_, i) => {
                        return (
                          <Ratings.Widget
                            key={i}
                            widgetDimension="20px"
                            svgIconViewBox="0 0 19 20"
                            svgIconPath={iconPath}
                            widgetHoverColor="rgb(253, 204, 13)"
                          />
                        );
                      })}
                    </Ratings>
                  </dd>
                </dl>

                <h4 className="mb-0">Comments</h4>
                <hr />
                <div className="lead flex-shrink-0">
                  {countComments(comments) > 0 ?
                    <div style={{ height: "150px", overflowY: "scroll" }}>
                      
                      {comments.map((com, i) => {
                        if (com.approved == true) {
                          return (
                            <UserComment
                              userName={com.user}
                              comment={com.comment}
                              rating={com.rating}
                            />
                          )
                        }
                      })}
                    </div> : 
                    <div style={{ display:'flex', justifyContent:'center' }}>
                      Be the first one to comment!
                    </div>
                  }

                  <Ratings
                    rating={rate}
                    widgetRatedColors="#f77d0b"
                    changeRating={changeRating}
                    widgetSpacings="2px"
                  >
                    {Array.from({ length: 5 }, (_, i) => {
                      return (
                        <Ratings.Widget
                          key={i}
                          widgetDimension="20px"
                          svgIconViewBox="0 0 19 20"
                          svgIconPath={iconPath}
                          widgetHoverColor="#f77d0b"
                        />
                      );
                    })}
                  </Ratings>
                  <div className="tags-box commentDiv">
                    <input
                      type="text"
                      className="tag form-control"
                      name="comment"
                      id="inlineFormInputName"
                      placeholder="Your Feedback"
                      value={comment}
                      onChange={handleComment}
                    />
                    {comment.length > 0 ? 
                      <button
                        type="submit"
                        class="btn commentButton"
                        onClick={submitComment}
                      >
                        Add Comment
                      </button> : 
                      <button
                        type="submit"
                        class="btn commentButton"
                        disabled
                      >
                        Add Comment
                      </button>
                    }
                  </div>
                  <br></br>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Template>
    );
  }
  else {
    return (
      <div className="container mt-5 py-4 px-xl-5" >

        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}>
          <CircularProgress />
          <div style={{padding:'20px'}}>Loading details...</div>
        </div>
      </div>
    )
    
  }
}

export default Product;
