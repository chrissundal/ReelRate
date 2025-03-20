import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {FirebaseProvider} from "./config/FbContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/custom.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <FirebaseProvider>
    <App />
      </FirebaseProvider>
  </React.StrictMode>
);

