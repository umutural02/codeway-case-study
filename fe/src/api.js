import axios from "axios";
import { getAuth } from "firebase/auth";
import { useToast } from "vue-toastification";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const toast = useToast();

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
  try {
    const response = await axios.get(`${API_BASE_URL}${path}`, {
      headers,
      params,
    });
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
    return error.response.data;
  }
}

export async function apiPost(path, data = {}, params = {}) {
  const headers = await getAuthHeaders();
  try {
    const response = await axios.post(`${API_BASE_URL}${path}`, data, {
      headers,
      params,
    });
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
    return error.response.data;
  }
}

export async function apiPut(path, data = {}, params = {}) {
  const headers = await getAuthHeaders();
  try {
    const response = await axios.put(`${API_BASE_URL}${path}`, data, {
      headers,
      params,
    });
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
    return error.response.data;
  }
}

export async function apiDelete(path, data = {}, params = {}) {
  const headers = await getAuthHeaders();
  try {
    const response = await axios.delete(`${API_BASE_URL}${path}`, {
      headers,
      params,
      data,
    });
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
    return error.response.data;
  }
}
