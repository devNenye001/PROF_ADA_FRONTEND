import axios from 'axios';
import { supabase } from './supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://prof-ada-backend.onrender.com/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: securely inject Supabase access token
api.interceptors.request.use(
  async (config) => {
    // Let Supabase handle the refresh implicitly
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// We no longer need a custom response interceptor for refresh tokens
// because Supabase auth handles session persistence and rotation automatically!

export default api;
