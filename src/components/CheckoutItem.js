import React from "react";

const CheckoutItem = ({title,price,desc}) => {
  return (
    <li class="list-group-item d-flex justify-content-between lh-condensed">
      <div>
        <h6 class="my-0">{title}</h6>
        <small class="text-muted">{desc}</small>
      </div>
      <span class="text-muted">{price}</span>
    </li>
  );
};

export default CheckoutItem;
