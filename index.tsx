
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { LanguageProvider } from './i18n/LanguageContext';
import { ThemeProvider } from './theme/ThemeContext';
import { ConvexProviderWrapper } from './components/ConvexProviderWrapper';
import { BrowserRouter } from 'react-router-dom';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ConvexProviderWrapper>
        <ThemeProvider>
          <LanguageProvider>
            <App />
          </LanguageProvider>
        </ThemeProvider>
      </ConvexProviderWrapper>
    </BrowserRouter>
  </React.StrictMode>
);

