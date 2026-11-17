import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.jsx';
import './styles/base.css';
import './styles/royal.css';
import './styles/minimal.css';
import './styles/floral.css';
import './styles/masterpiece.css';
import './styles/couture-elevations.css';

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
