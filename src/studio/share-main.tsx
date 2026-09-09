import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { installGlobalErrorTraps } from './store/useDebugStore';
import './index.css';

installGlobalErrorTraps();

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <ErrorBoundary label="root">
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
}
