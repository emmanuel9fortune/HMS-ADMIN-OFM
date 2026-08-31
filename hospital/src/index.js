import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './App/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

async function bootstrap() {
  let serverIP = null;

  try {
    // Wait for Bonjour-discovered IP before rendering
    
    if (window.electronAPI?.getLocalIP) {
      serverIP = await window.electronAPI.getLocalIP();
      console.log("✅ Bonjour Server IP:", serverIP);
    }
  } catch (err) {
    console.error("❌ Failed to get server IP:", err);
  }

  const cip = window.location.hostname

  const ip = serverIP || cip

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App serverIP={ip} />
      </Provider>
    </React.StrictMode>
  );
}

bootstrap();

reportWebVitals();
