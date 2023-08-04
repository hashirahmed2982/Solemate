import React from "react";
import { BiUserCircle } from "react-icons/bi";
import Ratings from "react-ratings-declarative";
const iconPath =
  "M18.571 7.221c0 0.201-0.145 0.391-0.29 0.536l-4.051 3.951 0.96 5.58c0.011 0.078 0.011 0.145 0.011 0.223 0 0.29-0.134 0.558-0.458 0.558-0.156 0-0.313-0.056-0.446-0.134l-5.011-2.634-5.011 2.634c-0.145 0.078-0.29 0.134-0.446 0.134-0.324 0-0.469-0.268-0.469-0.558 0-0.078 0.011-0.145 0.022-0.223l0.96-5.58-4.063-3.951c-0.134-0.145-0.279-0.335-0.279-0.536 0-0.335 0.346-0.469 0.625-0.513l5.603-0.815 2.511-5.078c0.1-0.212 0.29-0.458 0.547-0.458s0.446 0.246 0.547 0.458l2.511 5.078 5.603 0.815c0.268 0.045 0.625 0.179 0.625 0.513z";

const AvatarAndUsername = ({userName,rating}) => {
  return (
    <div>
      <BiUserCircle
        width="30"
        className="user-img rounded-circle mr-2"
        style={{ marginRight: "8px" }}
      />
      <small
        style={{ fontWeight: "bold", marginRight: "8px" }}
      >
        {userName}
      </small>
      <Ratings
        rating={rating}
        widgetRatedColors="#f77d0b"
        widgetSpacings="1px"
        style={{ marginBottom: "15px" }}
      >
        {Array.from({ length: 5 }, (_, i) => {
          return (
            <Ratings.Widget
              key={i}
              widgetDimension="15px"
              svgIconViewBox="0 0 19 20"
              svgIconPath={iconPath}
            />
          );
        })}
      </Ratings>
    </div>
  );
};

const UserComment = ({userName,comment,rating}) => {
  return (
    <div className="card" style={{paddingLeft:'15px',paddingTop:'8px', paddingRight:'8px', marginBottom: '8px'}}>
      <div className="d-flex justify-content-between align-items-center">
        <div className="user d-flex flex-row align-items-center">
          
          <span>
            <AvatarAndUsername userName={userName} rating={rating} />
            <small className="font-weight-bold">
              {comment}
            </small>
          </span>
        </div>
      </div>
      <div className="action d-flex justify-content-between mt-2 align-items-center"></div>
    </div>
  );
};

export default UserComment;
