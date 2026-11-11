import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import {AuthProvider} from './src/context/AuthContext'
import {Toaster} from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <App/>
                <Toaster position="top-right"/>
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>,
)
