// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppWrapper from './App.jsx'; // Changed from App to AppWrapper
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWrapper /> 
  </React.StrictMode>
);