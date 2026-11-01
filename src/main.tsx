/*
 * נקודת הכניסה מחברת את האפליקציה לאזור המיועד לה במסמך וטוענת את העיצוב הכללי.
 * היא אינה מקבלת נתונים מרכיב אחר; היא עוטפת את האפליקציה בניהול הכתובות
 * ובבדיקות פיתוח שעוזרות לזהות בעיות במחזור החיים של הרכיבים.
 */
import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element was not found')

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)


