import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
// import App from "./App";
import * as serviceWorker from "./serviceWorker";

import "bootstrap/dist/css/bootstrap.min.css";
import FormInput from "./components/form";

ReactDOM.render(
  <React.StrictMode>
    <FormInput />
  </React.StrictMode>,
  document.getElementById("root")
);

// export default Forms;

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
