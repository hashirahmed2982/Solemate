import React, { useEffect, useState } from 'react';
import ProductCard from "../../components/productcard/ProductCard";
import ScrollToTopOnMount from "../../template/ScrollToTopOnMount";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import '../home/home.css';
import Template from "../../template/Template";
import { db, storage } from '../../firebase';
import Product from '../product/Product';
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";
import firebase from "firebase";
import { useLocation } from 'react-router-dom';
import Header from '../../template/Header';
import Categories from './Categories';


function Catscreen(){
  const [products, setProducts] = useState([]);
  //const location = useLocation();
  //const { name } = location.state;
  const params = useParams();
  const { name } = params;
  console.log("NAME", name);
  useEffect(() => {
    // this code fires when the app.js loads
    db.collection('products').where('category', '==', name).onSnapshot(snapshot => {
      //console.log((snapshot.docs.map(doc => doc.data().name)));
      setProducts(snapshot.docs.map(doc => {
        const name = doc.data().name;
        const id = doc.data().ID;
        const price = doc.data().price;
        const discountedPrice = doc.data().discountedPrice;
        const url = doc.data().pictureURLs;
        const cat = doc.data().category;
        return {name,id,price,discountedPrice,url,cat}}));
    });

    if (firebase.auth().currentUser != null) {
      db.collection('users').doc(firebase.auth().currentUser.uid).get().then((snapshot) => {
        var values = snapshot.data();
      })
    }
  }, []);
  
  return (
    <Template>
      <ScrollToTopOnMount />
      <div className="d-flex flex-column bg-white py-4">
        solemate
      </div>
      <h2 className="text-muted text-center mt-4 mb-3">{name}</h2>
      <div className="container pb-5 px-lg-5">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 px-md-5">
        {products.map(product => {
            if(product.cat == name){
            return (
              <div className="col">
                <div className="card shadow-sm" >
                  <img
                    className="card-img-top bg-dark cover"
                    height="240"
                    alt=""
                    src={
                      product.url[0]
                    }
                  />
                  <div className="card-body">
                    {true && 
                      <h5 className="card-title text-center">{product.name}</h5>
                    }
                    
                    {parseInt(product.discountedPrice, 10) >= parseInt(product.price, 10) ?
                      <>
                        <p className="card-text text-center text-muted">{product.price} TL</p>
                        <p className="card-text text-center text-muted">&nbsp;</p>
                      </> :
                      <>
                        <p className="card-text text-center text-muted" style={{textDecoration: 'line-through', textDecorationColor: '#cb144e', textDecorationThickness: '0.1rem'}}>{product.price} TL</p>
                        <p className="card-text text-center" style={{color: '#cb144e', fontWeight: 'bold'}}>{product.discountedPrice} TL</p>
                      </>
                    }
                    
                    <div className="d-grid gap-2">
                      <Link
                        to={'/product/' + product.id}
                        key={product.id}
                        state={{ id: product.id }}
                        className="btn btn-outline-dark"
                        style={{ borderColor: "#f77d0b" }}
                      >
                        
                        Detail
                      </Link>
                    </div>
                    <Routes>
        <Route
          path="/product/:id"
          render={({ match }) => (
            <Product
              product
            />
          )}
        />
      </Routes>
                  </div>
                </div>
              </div>
            );
          }
        })}
        </div>
      </div>
      <div className="d-flex flex-column bg-white py-4">
        <h5 className="text-center mb-3">Follow us on</h5>
        <div className="d-flex justify-content-center">
          <a href="!#" className="me-3">
            <FaFacebook />
          </a>
          <a href="!#">
            <FaInstagram />
          </a>
          <a href="!#" className="ms-3">
            <FaTwitter />
          </a>
        </div>
      </div>
    </Template>
  );

}
export default Catscreen;