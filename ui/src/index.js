import React from "react";
import ReactDOM from "react-dom";
import "bootswatch/dist/cosmo/bootstrap.css";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import "whatwg-fetch"; // disable fetch for cypress support

import { getUser } from "./services/AuthService";

// Gets user login details before rendering
getUser().then((user) =>
  ReactDOM.render(
    <BrowserRouter>
      <App user={user} />
    </BrowserRouter>,
    document.getElementById("root")
  )
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
