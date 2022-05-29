import axios from 'axios';

export const get = (url: string, params?) => {
  return axios.get(url, { params });
};
