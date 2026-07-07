// src/lib/crudClient.js
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getData = async (endpoint) => {
  const res = await axios.get(`${API_BASE_URL}/${endpoint}`);
  return res.data;
};

export const postData = async (endpoint, data) => {
  const res = await axios.post(`${API_BASE_URL}/${endpoint}`, data);
  return res.data;
};
