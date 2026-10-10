import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import TagManager from 'react-gtm-module';
import App from './App.jsx';
import './index.css';
import { capture as installCapture } from './lib/install';

// Google Tag Manager — injects the GTM container once, on app load, so
// analytics/marketing tags (Google Ads conversions, GA4) can be managed from
// GTM without further code changes here.
TagManager.initialize({ gtmId: 'GTM-MV5QN3HH' });

/* INSTALLABLE AS AN APP, like GaadiPe (user, 2026-10-10: "I got a popup to install the
   GaadiPe app, do it for QuizPe too"). With the manifest and the icons in index.html,
   a registered service worker is what lets the phone offer "Install QuizPe". It is the
   app's own reminder worker (public/app-sw.js): it caches nothing, so no page goes stale. */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('/app-sw.js').catch(() => {}); });
}
// The browser's install offer, caught before it fires, for our own "Install the app" (lib/install.js).
installCapture();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
