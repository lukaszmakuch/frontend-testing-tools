import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

window.API_ROOT = "http://localhost:3010/sess/";

const root = ReactDOM.createRoot(document.getElementById("root"));
const toRender = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

window._testSetHttpApiUrl = function (url) {
  window.API_ROOT = url;
};

window._testContinueRendering = function () {
  root.render(toRender);
};
if (!/frontend-testing-utils/.test(navigator.userAgent))
  window._testContinueRendering();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
