
import { Link } from "react-router-dom";
import Ratings from "react-ratings-declarative";

const iconPath =
  "M18.571 7.221c0 0.201-0.145 0.391-0.29 0.536l-4.051 3.951 0.96 5.58c0.011 0.078 0.011 0.145 0.011 0.223 0 0.29-0.134 0.558-0.458 0.558-0.156 0-0.313-0.056-0.446-0.134l-5.011-2.634-5.011 2.634c-0.145 0.078-0.29 0.134-0.446 0.134-0.324 0-0.469-0.268-0.469-0.558 0-0.078 0.011-0.145 0.022-0.223l0.96-5.58-4.063-3.951c-0.134-0.145-0.279-0.335-0.279-0.536 0-0.335 0.346-0.469 0.625-0.513l5.603-0.815 2.511-5.078c0.1-0.212 0.29-0.458 0.547-0.458s0.446 0.246 0.547 0.458l2.511 5.078 5.603 0.815c0.268 0.045 0.625 0.179 0.625 0.513z";

function ProductSearch(props) {
  let percentOff;
  let offPrice = `${props.price}$`;

  if (props.percentOff && props.percentOff > 0) {
    percentOff = (
      <div
        className="badge bg-dim py-2 text-white position-absolute"
        style={{ top: "0.5rem", right: "0.5rem" }}
      >
        {props.percentOff}% OFF
      </div>
    );

    offPrice = (
      <>
        <del>{props.price}$</del> {props.price - (props.percentOff * props.price) / 100}$
      </>
    );
  }

  return (
    <div className="col">
      <div className="card shadow-sm">
        <Link to={"/product/" + props.prodID} replace>
          {percentOff}
          <img
            className="card-img-top bg-dark cover"
            height="200"
            alt=""
            src={
              props.image
              // "https://img-sneaksupincommerce.mncdn.com/mnresize/746/746/Content/Images/Originals/0099621_0.jpeg"
            }
          />
        </Link>
        <div className="card-body">
          <h5 className="card-title text-center text-dark text-truncate">
            {props.title}
          </h5>
          <p className="card-text text-center text-muted mb-0">{offPrice}</p>
          <div className="text-center">
            <Ratings
              rating={props.rating}
              widgetRatedColors="#f77d0b"
              widgetSpacings="2px"
            >
              {Array.from({ length: 5 }, (_, i) => {
                return (
                  <Ratings.Widget
                    key={i}
                    widgetDimension="18px"
                    svgIconViewBox="0 0 19 20"
                    svgIconPath={iconPath}
                    widgetHoverColor="rgb(253, 204, 13)"
                  />
                );
              })}
            </Ratings>
          </div>
          <div className="d-grid d-block">
            <button className="btn productCard-btn mt-3">Details</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductSearch;
