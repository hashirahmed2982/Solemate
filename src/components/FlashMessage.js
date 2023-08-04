import React, { useEffect } from "react";

const FlashMessage = ({ type, message }) => {
  return (
    
      <div
        className={`alert alert-${type} alert-dismissible fade show`}
        role="alert"
      >
        {message}
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
        ></button>
      </div>
  );
};

export default FlashMessage;
