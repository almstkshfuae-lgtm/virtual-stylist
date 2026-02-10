
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { LanguageProvider } from './i18n/LanguageContext';
import { ThemeProvider } from './theme/ThemeContext';
import { ConvexProviderWrapper } from './components/ConvexProviderWrapper';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ClerkProvider } from '@clerk/clerk-react';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!publishableKey) {
  throw new Error('VITE_CLERK_PUBLISHABLE_KEY is required for authentication.');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={publishableKey}>
      <ErrorBoundary>
        <BrowserRouter>
          <ConvexProviderWrapper>
            <ThemeProvider>
              <LanguageProvider>
                <App />
              </LanguageProvider>
            </ThemeProvider>
          </ConvexProviderWrapper>
        </BrowserRouter>
      </ErrorBoundary>
    </ClerkProvider>
  </React.StrictMode>
);
