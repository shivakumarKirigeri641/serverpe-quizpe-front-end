import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import TagManager from 'react-gtm-module';
import App from './App.jsx';
import './index.css';

// Google Tag Manager — injects the GTM container once, on app load, so
// analytics/marketing tags (Google Ads conversions, GA4) can be managed from
// GTM without further code changes here.
TagManager.initialize({ gtmId: 'GTM-MV5QN3HH' });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
