import axios from 'axios';
import { supabase } from './supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://prof-ada-backend.onrender.com/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// A promise that resolves when auth is fully initialized to prevent race conditions
let authReadyResolver: (value: boolean) => void;
export const authReadyPromise = new Promise<boolean>((resolve) => {
  authReadyResolver = resolve;
});

export const setAuthReady = (ready: boolean) => {
  authReadyResolver(ready);
};

// Request interceptor: securely inject Supabase access token
api.interceptors.request.use(
  async (config) => {
    // Prevent requests until auth state is initialized
    await authReadyPromise;

    // Let Supabase handle the refresh implicitly
    let { data: { session } } = await supabase.auth.getSession();
    
    // Fallback logic for clock skew
    if (!session) {
      // If getSession fails but we have a token in localStorage, use it as fallback
      const localToken = localStorage.getItem('prof-ada-access-token');
      if (localToken) {
        session = { access_token: localToken } as any;
      }
    }

    const token = session?.access_token;
    
    if (token) {
      console.log('TOKEN_RECEIVED'); // Temporary log
      if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log('API_ALLOWED:', config.url); // Temporary log
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
