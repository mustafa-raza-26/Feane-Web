import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// Styles. Order matters and mirrors the old HTML pages:
// site CSS first, Bootstrap after it, bill page CSS last.
import '@fortawesome/fontawesome-free/css/all.min.css'
import './styles/style.css'
import './styles/menu.css'
import './styles/auth.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/bill.css'

// Bootstrap JS (navbar collapse + carousel)
import 'bootstrap'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
