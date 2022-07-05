
import React, { useState, useEffect } from "react";
import ScrollToTopOnMount from "./ScrollToTopOnMount";
import Template from "./Template";
import { useLocation } from 'react-router-dom';
import { db, storage} from "../firebase";
import firebase from "firebase";
import '../pages/home/home.css';
import Banner from "../pages/home/Banner";
import ProductCard from "../components/productcard/ProductCard";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import Product from '../pages/product/Product';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from './Header';


function Searchbar(){
    const [products, setProducts] = useState([]);
    const [filtered, setfiltered] = useState([]);
    const location = useLocation();
    const { query } = location.state;

  console.log(query);
  useEffect(() => {
    // this code fires when the app.js loads
    db.collection('products').onSnapshot(snapshot => {
      //console.log((snapshot.docs.map(doc => doc.data().name)));
      setProducts(snapshot.docs.map(doc => {
        
          if(doc.data().name == query || doc.data().price == query.toString()){
        const name = doc.data().name;
        const id = doc.data().ID;
        const price = doc.data().price;
        const url = doc.data().pictureURLs;
        return {name,id,price,url}}
    else{
        const name = "empty";
        const id = 0;
        const price = 0;
        const url = "empty";
        return {name,id,price,url}
    }}));
    
    });

    //products.map(product => {
      //  if(product.name == query){
        //    setfiltered(
          //      const name = product.name;
            //    const id = product.ID;
              //  const price = product.price;
                //const url = product.pictureURLs;
                //return {name,id,price,url});
        //}
    //});
    //console.log(filtered);

  }, [query]);

  console.log(products);

  return (
    <Template>
      <ScrollToTopOnMount />
    
      <div className="d-flex flex-column bg-white py-4">
        <p className="text-center px-5">
          Welcome to Solemate! Find your solemate from hundreds of options.
        </p>
        <div className="d-flex justify-content-center">
        </div>
      </div>
      <h2 className="text-muted text-center mt-4 mb-3">RESULT</h2>
      <div className="container pb-5 px-lg-5">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 px-md-5">
        {products.map(product => {
            if(product.name != "empty"){
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
                    <h5 className="card-title text-center">{product.name}</h5>
                    <p className="card-text text-center text-muted">{product.price} TL</p>
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
        }})}
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

export default Searchbar;