import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App/App';
import reportWebVitals from './reportWebVitals';
import './custom.scss';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
// Put any other imports below so that CSS from your
// components takes precedence over default styles.

// axios.interceptors.request.use(config => {
//   config.headers = {
//   ‘Content-Type’: ‘application/json’,
//   Accept: ‘application/json’,
//   Authorization: ‘Bearer ‘ + kc.token
//   };
//   return config;
//   });

axios.interceptors.request.use((config: AxiosRequestConfig) => {
  console.log('Interceptor');
  console.log( config );
  alert(config);
  return config;
})

axios.interceptors.response.use((config: AxiosResponse) => {
  console.log('Interceptor');
  console.log( config );
  alert(config);
  return config;
})

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
