import React, { useEffect, useState } from 'react';
import ScrollToTopOnMount from "../../template/ScrollToTopOnMount";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import '../home/home.css';
import Template from "../../template/Template";
import { db, storage } from '../../firebase';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import firebase from "firebase";
import Header from '../../template/Header';
import { RiCreativeCommonsZeroLine } from 'react-icons/ri';
import Catscreen from './Catscreen';

function Categories() {
  const [cats, setCats] = useState([]);
  
  useEffect(() => {
    // this code fires when the app.js loads
    db.collection('categories').onSnapshot(snapshot => {
      //console.log((snapshot.docs.map(doc => doc.data().name)));
      setCats(snapshot.docs.map(doc => {
        const name = doc.data().name;
        const url = doc.data().url;
        
        return {name,url}}));
    });

  }, []);
  
  return (
    <Template>
      <ScrollToTopOnMount />
      <div className="d-flex flex-column bg-white py-4">
        <p className="text-center px-5">
          solemate
        </p>
        
      </div>
      <h2 className="text-muted text-center mt-4 mb-3">Categories</h2>
      <div className="container pb-5 px-lg-5">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 px-md-5">
        {cats.map(cat => {
            return (
              <div className="col">
                <div className="card shadow-sm" >
                  <img
                    className="card-img-top bg-dark cover"
                    height="240"
                    alt=""
                    src={
                      cat.url
                    }
                  />
                  <div className="card-body">
                    {true && 
                      <h5 className="card-title text-center">{cat.name}</h5>
                    }
                    
                    
                    <div className="d-grid gap-2">
                      <Link
                        state={{ name: cat.name }}
                        to={'/category/' + cat.name}
                        key={cat.name}
                        
                        className="btn btn-outline-dark"
                        style={{ borderColor: "#f77d0b" }}
                      >
                        
                        Browse
                      </Link>
                    </div>
                    <Routes>
                      <Route
                        path="/category/:name"
                        render={({ match }) => (
                          <Catscreen

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

export default Categories;