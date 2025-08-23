import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Enable MSW for demo
async function enableMocking() {
  if (typeof window === 'undefined') {
    return;
  }

  const { worker } = await import('./mocks/browser');

  // Start the MSW worker
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

console.log('🚀 SparkSupport starting with MSW mock API...');

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found');
}

try {
  // Initialize MSW and then mount the React app
  enableMocking().then(() => {
    console.log('✅ MSW initialized successfully');
    
    createRoot(root).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    console.log('✅ React app mounted successfully');
  }).catch((error) => {
    console.error('❌ MSW initialization failed:', error);
    // Mount the app anyway, but API calls might fail
    createRoot(root).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  });
} catch (error) {
  console.error('❌ React mounting failed:', error);
  
  // Fallback HTML for critical errors
  root.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-family: system-ui;">
      <div style="text-align: center; padding: 2rem;">
        <h1 style="font-size: 2rem; margin-bottom: 1rem;">SparkSupport Loading Error</h1>
        <p style="margin-bottom: 2rem;">Something went wrong. Please refresh the page.</p>
        <button onclick="window.location.reload()" style="background: white; color: #667eea; padding: 0.75rem 1.5rem; border: none; border-radius: 0.5rem; font-weight: bold; cursor: pointer;">
          Refresh Page
        </button>
      </div>
    </div>
  `;
}