import axios from "axios";
import { getAuth } from "firebase/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

async function getAuthHeaders() {
  const user = getAuth().currentUser;
  const idToken = user ? await user.getIdToken() : null;

  return {
    "x-api-key": API_TOKEN,
    ...(idToken && { Authorization: `Bearer ${idToken}` }),
  };
}

export async function apiGet(path, params = {}) {
  const headers = await getAuthHeaders();
  return axios.get(`${API_BASE_URL}${path}`, { headers, params });
}

export async function apiPost(path, data = {}, params = {}) {
  const headers = await getAuthHeaders();
  return axios.post(`${API_BASE_URL}${path}`, data, { headers, params });
}

export async function apiPut(path, data = {}, params = {}) {
  const headers = await getAuthHeaders();
  return axios.put(`${API_BASE_URL}${path}`, data, { headers, params });
}

export async function apiDelete(path, data = {}, params = {}) {
  const headers = await getAuthHeaders();
  return axios.delete(`${API_BASE_URL}${path}`, { headers, params, data });
}
