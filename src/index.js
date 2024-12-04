import React from "react";
import ReactDOM from "react-dom";
import App from 'App'
/*import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/scss/light-bootstrap-dashboard-react.scss?v=2.0.0";
import "./assets/css/demo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import Login from 'layouts/Login1';
import ForgetPassword from 'layouts/ForgetPassword'
import CodePin from 'layouts/forgotpassword/CodePin'
import NewPassword from 'layouts/forgotpassword/NewPassword'
import AdminLayout from "layouts/Admin.js";

import { I18nPropvider, LOCALES } from '../src/i18nProvider';
import { Provider } from "react-redux";
import configureStore from "./store";


const getlangue = () =>{
  if (sessionStorage.getItem('lang')==="En"){
    return LOCALES.ENGLISH
  }else if (sessionStorage.getItem('lang')==="Fr"){
    return LOCALES.FRENCH
  }else if (sessionStorage.getItem('lang')==="Sp"){
    return LOCALES.spanish
  }else{
    return LOCALES.ENGLISH
  }
}*/

ReactDOM.render(
  <App />,
  document.getElementById("root")
);
