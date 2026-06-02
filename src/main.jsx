import { StrictMode } from 'react'
import { Toaster } from 'sonner'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            classNames: {
              toast:
                'bg-slate-800 border border-slate-700 text-white',
              description:
                'text-slate-400',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)