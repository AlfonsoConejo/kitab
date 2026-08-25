import { StrictMode } from 'react'
import { Toaster } from 'sonner'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App'
import { AuthProvider } from './context/AuthContext';
import { PeriodProvider } from './context/PeriodContext';
const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PeriodProvider>
          <App />
          <Toaster
            position="bottom-right"
          />
        </PeriodProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)