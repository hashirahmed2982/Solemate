import React, { useEffect, useState } from 'react';
import Banner from "./Banner";
import ProductCard from "../../components/productcard/ProductCard";
import ScrollToTopOnMount from "../../template/ScrollToTopOnMount";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import './home.css';
import Template from "../../template/Template";
import { db, storage } from '../../firebase';
import Product from '../product/Product';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import firebase from "firebase";
import Header from '../../template/Header';

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // this code fires when the app.js loads
    db.collection('products').onSnapshot(snapshot => {
      //console.log((snapshot.docs.map(doc => doc.data().name)));
      setProducts(snapshot.docs.map(doc => {
        const name = doc.data().name;
        const id = doc.data().ID;
        const price = doc.data().price;
        const discountedPrice = doc.data().discountedPrice;
        const url = doc.data().pictureURLs;
        return { name, id, price, discountedPrice, url }
      }));
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
      <Banner />
      <div className="d-flex flex-column bg-white py-4">
        <p className="text-center px-5">
          Welcome to Solemate! Find your solemate from hundreds of options.
        </p>
        <div className="d-flex justify-content-center">
          <Link to="/search" className="btn btn-primary bg-orange border-white">
            Browse Products
          </Link>
          <Link style={{marginLeft: '10px'}} to="/categories" className="btn btn-primary bg-black border-white">
            Browse Categories
          </Link>
        </div>
      </div>
      <h2 className="text-muted text-center mt-4 mb-3">New Arrivals</h2>
      <div className="container pb-5 px-lg-5">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 px-md-5">
          {products.map(product => {
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
                        <p className="card-text text-center text-muted" style={{ textDecoration: 'line-through', textDecorationColor: '#cb144e', textDecorationThickness: '0.1rem' }}>{product.price} TL</p>
                        <p className="card-text text-center" style={{ color: '#cb144e', fontWeight: 'bold' }}>{product.discountedPrice} TL</p>
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

                        Details
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

export default Home;
