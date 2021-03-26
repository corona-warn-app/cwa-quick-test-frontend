import axios from 'axios';

const API = axios.create({
  baseURL: 'https://quicktest-6155b8d7d3c6.coronawarn.app',
  // baseURL: 'http://localhost:3000',
});

export default API;
