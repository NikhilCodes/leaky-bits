import axios from 'axios';

export const get = (url: string, params?: any) => {
  return axios.get(url, { params });
}