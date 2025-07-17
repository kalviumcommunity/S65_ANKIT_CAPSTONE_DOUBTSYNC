import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import "@fontsource/inter"; 
import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";



import App from './App.jsx'

createRoot(document.getElementById('root')).render(

    <App />

)
