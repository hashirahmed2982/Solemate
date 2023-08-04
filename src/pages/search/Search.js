import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Product from "./ProductSearch";

import Template from "../../template/Template";
import ScrollToTopOnMount from "../../template/ScrollToTopOnMount";
import { db } from "../../firebase";

// will be pulled from database until line 23 (categories,brands,manufacturers)
const categories = [
  "All Products",
  "Phones & Tablets",
  "Cases & Covers",
  "Screen Guards",
  "Cables & Chargers",
  "Power Banks",
];

const brands = ["Nike", "Adidas", "Puma", "Yeezy"];



function Search() {
  const [viewType, setViewType] = useState({ grid: true });

  function changeViewType() {}
  const [products, setProducts] = useState([]);
  useEffect(() => {
    // this code fires when the app.js loads
    db.collection("products").onSnapshot((snapshot) => {
      //console.log((snapshot.docs.map(doc => doc.data().name)));
      setProducts(
        snapshot.docs.map((doc) => {
          const name = doc.data().name;
          const id = doc.data().ID;
          const price = doc.data().price;
          const url = doc.data().pictureURLs;
          const rating = doc.data().rating;
          const brand = doc.data().brand;
          return { name, id, price, url, rating,brand };
        })
      );
    });
  }, []);

  console.log(products);

  const [selectedOption, setSelectedOption] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [brand,setBrand] = useState([]);
  
  const handleChange = (e) => {
    // Destructuring
    const { value, checked } = e.target;
    

    console.log(`${value} is ${checked}`);

    // Case 1 : The user checks the box
    if (checked) {
      setBrand([...brand,value]);     
    }
    // Case 2  : The user unchecks the box
    else {
      setBrand(brand.filter((e) => e !== value));
    }
    
  };
  useEffect(() => {
    const sortArray = (type) => {
      if (type == "incPrice") {
        const sorted = [...products].sort((a, b) => a.price - b.price);
        setProducts(sorted);
      }
      if (type == "decPrice") {
        const sorted = [...products].sort((a, b) => b.price - a.price);
        setProducts(sorted);
      }
      if (type == "incRating") {
        const sorted = [...products].sort((a, b) => a.rating - b.rating);
        setProducts(sorted);
      }
      if (type == "decRating") {
        const sorted = [...products].sort((a, b) => b.rating - a.rating);
        setProducts(sorted);
      }
    };

    sortArray(selectedOption);
  }, [selectedOption]);


  return (
    <Template>
      <div className="container mt-5 py-4 px-xl-5">
        <ScrollToTopOnMount />
        <nav
          aria-label="breadcrumb"
          className="bg-custom-light rounded"
          style={{ marginTop: "25px" }}
        >
          <ol className="breadcrumb p-3 mb-0">
            <li className="breadcrumb-item">
              <Link
                className="text-decoration-none link-secondary"
                to="/products"
                replace
              >
                All Products
              </Link>
            </li>
          </ol>
        </nav>

        <div className="h-scroller d-block d-lg-none">
          <nav className="nav h-underline">
            {categories.map((v, i) => {
              return (
                <div key={i} className="h-link me-2">
                  <Link
                    to="/products"
                    className="btn btn-sm btn-outline-dark rounded-pill"
                    replace
                  >
                    {v}
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>

        <div className="row mb-3 d-block d-lg-none">
          <div className="col-12">
            <div id="accordionFilter" className="accordion shadow-sm">
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingOne">
                  <button
                    className="accordion-button fw-bold collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseFilter"
                    aria-expanded="false"
                    aria-controls="collapseFilter"
                  >
                    Filter Products
                  </button>
                </h2>
              </div>
              <div
                id="collapseFilter"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionFilter"
              >
                <div className="accordion-body p-0">
                  <ul className="list-group list-group-flush rounded">
                    <li className="list-group-item">
                      <h5 className="mt-1 mb-1">Brands</h5>
                      <div className="d-flex flex-column">
                        {brands.map((v, i) => {
                          return (
                            <div key={i} className="form-check input-container">
                              <input
                                className="form-check-input"
                                type="checkbox"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault"
                              >
                                {v}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </li>
                    
                    <li className="list-group-item">
                      <h5 className="mt-1 mb-2">Price Range</h5>
                      <div className="d-grid d-block mb-3">
                        <div className="form-floating mb-2">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Min"
                            onChange={(e) => setMinPrice(e.target.value)}
                          />
                          <label htmlFor="floatingInput">Min Price</label>
                        </div>
                        <div className="form-floating mb-2">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Max"
                            onChange={(e) => setMaxPrice(e.target.value)}
                          />
                          <label htmlFor="floatingInput">Max Price</label>
                        </div>
                        <button
                          className="btn search-btn"
                          onClick={() => {
                            if (maxPrice != "" && minPrice != "") {
                              setProducts(
                                products.filter((product) => {
                                  return (
                                    product.price >= parseInt(minPrice) &&
                                    product.price <= parseInt(maxPrice)
                                  );
                                })
                              );
                            }
                            console.log(brand);
                          }}
                        >
                          Apply
                        </button>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-4 mt-lg-3">
          <div className="d-none d-lg-block col-lg-3">
            <div className="border rounded shadow-sm">
              <ul className="list-group list-group-flush rounded">
                <li className="list-group-item">
                  <h5 className="mt-1 mb-1">Brands</h5>
                  <div className="d-flex flex-column">
                    {brands.map((v, i) => {
                      return (
                        <div key={i} className="form-check input-container">
                          <input className="form-check-input" type="checkbox" value={v} onChange={handleChange} />
                          <label
                            className="form-check-label"
                            htmlFor="flexCheckDefault"
                          >
                            {v}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </li>
                
                <li className="list-group-item">
                  <h5 className="mt-1 mb-2">Price Range</h5>
                  <div className="d-grid d-block mb-3">
                    <div className="form-floating mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Min"
                        onChange={(e) => setMinPrice(e.target.value)}
                      />
                      <label htmlFor="floatingInput">Min Price</label>
                    </div>
                    <div className="form-floating mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Max"
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                      <label htmlFor="floatingInput">Max Price</label>
                    </div>
                    <button
                      className="btn search-btn"
                      onClick={() => {
                          setProducts(
                            products.filter((product) => {
                              var check = false;
                              if (maxPrice != "" && minPrice != "" && brand.length != 0){
                                return (product.price >= parseInt(minPrice) &&
                                product.price <= parseInt(maxPrice) && brand.includes(product.brand))
                              }
                              else if ((maxPrice == "" || minPrice == "") && brand.length != 0){
                                return brand.includes(product.brand)
                              }
                              else if (maxPrice != "" && minPrice != "" && brand.length == 0){
                                return product.price >= parseInt(minPrice) &&
                                product.price <= parseInt(maxPrice) 
                              }
                              else if ((maxPrice == "" || minPrice == "") && brand.length == 0){
                                return true;
                              }
                              else{
                                return true;
                              }
                              
                            })
                          );
                        
                        
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-lg-9">
            <div className="d-flex flex-column h-100">
              <div className="row mb-3">
                <div className="container">
                  <div className="col-lg-3 d-none d-lg-block">
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      defaultValue=""
                      onChange={(e) => setSelectedOption(e.target.value)}
                    >
                      <option value="sort">Sort</option>
                      <option value="decPrice">Decreasing Price</option>
                      <option value="incPrice">Increasing Price</option>
                      <option value="decRating">Decreasing Rating</option>
                      <option value="incRating">Increasing Rating</option>
                    </select>
                  </div>
                </div>
              </div>
              <div
                className={
                  "row row-cols-1 row-cols-md-2 row-cols-lg-2 g-3 mb-4 flex-shrink-0 " +
                  (viewType.grid ? "row-cols-xl-3" : "row-cols-xl-2")
                }
              >
                {products.map((product) => {
                  return (
                    <Product
                      key={product.id}
                      percentOff={product.id % 2 === 0 ? 15 : null}
                      image={product.url[0]}
                      title={product.name}
                      price={product.price}
                      prodID={product.id}
                      rating={product.rating}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Template>
  );
}

export default Search;
