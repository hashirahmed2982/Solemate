import "./bootstrap-custom.css";
import "./index.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AppProvider } from "./context";

ReactDOM.render(
  <React.StrictMode>
    {/* <AppProvider> */}
    <App />
    {/* </AppProvider> */}
  </React.StrictMode>,
  document.getElementById("root")
);


