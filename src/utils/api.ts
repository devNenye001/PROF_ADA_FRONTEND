import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://prof-ada-backend.onrender.com/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: inject access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('prof-ada-access-token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (error: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor: automatically rotate tokens on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is 401 Unauthorized and request has not been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest._retry = true;
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        const refreshToken = localStorage.getItem('prof-ada-refresh-token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Attempt token rotation
        const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
        
        if (res.data && res.data.success) {
          const { accessToken, refreshToken: newRefreshToken } = res.data.data;
          
          // Store new keys
          localStorage.setItem('prof-ada-access-token', accessToken);
          localStorage.setItem('prof-ada-refresh-token', newRefreshToken);
          
          // Update headers and retry original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          
          processQueue(null, accessToken);
          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        console.error('Token refresh failed. Logging user out.', refreshError);
        
        // Clear auth state
        localStorage.removeItem('prof-ada-access-token');
        localStorage.removeItem('prof-ada-refresh-token');
        localStorage.removeItem('prof-ada-user-email');
        localStorage.removeItem('prof-ada-active-conversation-id');
        
        // Dispatch custom event to notify React app instead of hard reload
        window.dispatchEvent(new Event('prof-ada-logout'));
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
