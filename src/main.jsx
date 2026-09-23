import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Chart as ChartJS, registerables } from 'chart.js'

// Registra todos os controladores, escalas, elementos e plugins do Chart.js
ChartJS.register(...registerables);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
