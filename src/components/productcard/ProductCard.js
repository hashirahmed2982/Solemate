import React from "react";
import { Link } from "react-router-dom";

function ProductCard() {
  return (
    <div className="col">
      <div className="card shadow-sm">
        <img
          className="card-img-top bg-dark cover"
          height="240"
          alt=""
          src={
            "https://img-sneaksupincommerce.mncdn.com/mnresize/746/746/Content/Images/Originals/0094915_0.jpeg"
          }
        />
        <div className="card-body">
          <h5 className="card-title text-center">Sneaker</h5>
          <p className="card-text text-center text-muted">100 $</p>
          <div className="d-grid gap-2">
            <Link
              to="/product"
              className="btn btn-outline-dark productCard-btn"
              replace
              //style={{ borderColor: "#f77d0b" }}
            >
              Detail
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
