import react from 'react'
import { ReactDOM } from 'react-dom/client'
import App from './App.js'
import './index.js'
import LoginPage from './components/Login/LoginPage.js'

import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginPage from './components/Login/LoginPage.js';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId="910323986833-fnj0aj92c8l42bl0gdv0ogaejuc2fdfs.apps.googleusercontent.com">
            <LoginPage />
        </GoogleOAuthProvider>;
    </React.StrictMode>
)