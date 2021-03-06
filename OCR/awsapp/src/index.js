import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Upload from "./upload"
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Title from "./Title"


ReactDOM.render(
  <React.StrictMode>
    <Title />
    <Upload />
  </React.StrictMode >,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

