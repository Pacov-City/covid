import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';


const orpName=window.location.hash?decodeURI(window.location.hash.substring(1)):null

let clientId = localStorage.getItem("client-id")
if (!clientId){
  clientId=`${Math.random()}-${Math.random()}` 
  localStorage.setItem("client-id",clientId)
}
window.clientId = clientId

ReactDOM.render(
  <React.StrictMode>
    <App initialOrpName={orpName}/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
