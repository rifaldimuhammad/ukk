import Axios from 'axios';

export const urlApi = 'http://127.0.0.1:8000/';
export const apiClient = Axios.create({
  baseURL: `${urlApi}api`,
});

export const axios = Axios.create({
  urlApi,
  apiClient,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-type': 'application/json',
    'Cache-control': 'no-cache',
  },
});
