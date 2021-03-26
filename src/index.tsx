import React from 'react';
import ReactDOM from 'react-dom';

import './assets/SCSS/index.scss';
import './assets/SCSS/custom.scss';

import reportWebVitals from './reportWebVitals';

import keycloak from './keycloak';
import { ReactKeycloakProvider } from '@react-keycloak/web';

import LoginInterceptor from './login-interceptor.component';
import Routing from './routing.component';


ReactDOM.render(
  <React.StrictMode>
    <ReactKeycloakProvider
      authClient={keycloak}
    >
      <LoginInterceptor>
        <Routing />
      </LoginInterceptor>
    </ReactKeycloakProvider>
  </React.StrictMode>,

  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
