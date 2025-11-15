import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App.jsx';
import '@/index.css';
import './i18n';

console.log('[main.jsx] Starting app initialization...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('[main.jsx] Root element not found!');
  throw new Error('Root element not found');
}

console.log('[main.jsx] Root element found, creating React root...');

const root = ReactDOM.createRoot(rootElement);

console.log('[main.jsx] Rendering App component...');

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

console.log('[main.jsx] App rendered successfully');