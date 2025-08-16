import axios from 'axios';

// Create a dedicated Axios instance with a base URL
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

// The interceptor is useful for when the app first loads
apiClient.interceptors.request.use(
  (config) => {
    // --- START DIAGNOSTIC LOGGING ---
    console.log(`Starting Request to: ${config.url}`);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
      console.log('Request has token:', config.headers['Authorization']);
    } else {
      console.log('Request does not have a token.');
    }
    // --- END DIAGNOSTIC LOGGING ---
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const login = async (username, password) => {
  const response = await apiClient.post('/login/', { username, password });
  
  if (response.data.token) {
    const token = response.data.token;
    localStorage.setItem("token", token);
    
    // Set the header directly on the instance for all future requests
    apiClient.defaults.headers.common['Authorization'] = `Token ${token}`;
    
    const userResponse = await getCurrentUser();
    return { token: token, user: userResponse };
  }
  return response.data;
};

const signup = async (username, email, password) => {
  const response = await apiClient.post('/signup/', {
    username,
    email,
    password,
  });

  // FIX: Add the same logic as login to automatically sign in the new user
  if (response.data.token) {
    const token = response.data.token;
    localStorage.setItem("token", token);
    // Set the header so the user is logged in immediately after signup
    apiClient.defaults.headers.common['Authorization'] = `Token ${token}`;
  }
  return response.data;
};

const logout = async () => {
  await apiClient.post('/logout/');
  localStorage.removeItem("token");
  delete apiClient.defaults.headers.common['Authorization'];
};

const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/protected/');
    return response.data.user_details;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    localStorage.removeItem("token");
    return null;
  }
};

const authService = {
  login,
  signup,
  logout,
  getCurrentUser,
};

export default authService;