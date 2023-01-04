import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context-store/auth-context';
import ReduxStore from './redux-store/store';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <BrowserRouter>
        <Provider store={ReduxStore}>
          <GoogleOAuthProvider clientId="104279093815-npg46ifu43hcogj2o1iovu4qbu1lph1t.apps.googleusercontent.com">
            <App />
          </GoogleOAuthProvider>
        </Provider>
      </BrowserRouter>
    </AuthContextProvider>
  </React.StrictMode>
);
