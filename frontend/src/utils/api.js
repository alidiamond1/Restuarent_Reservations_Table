import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// Auth
export const register = (userData) => {
  console.log('Registering user:', userData);
  return api.post('/auth/register', userData);
}
export const login = (credentials) => api.post('/auth/login', credentials)
export const getMe = () => api.get('/auth/me')
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });

// User Reservations
export const createReservation = (reservationData) => {
  console.log('Creating reservation:', reservationData)
  return api.post('/reservations', reservationData)
    .then(response => {
      console.log('Reservation created successfully:', response.data)
      return response
    })
    .catch(error => {
      console.error('Error creating reservation:', error.response?.data || error.message)
      throw error
    })
}

export const getUserReservations = () => {
  console.log('Fetching user reservations');
  return api.get('/reservations')
    .then(response => {
      console.log('User reservations fetched successfully:', response.data);
      return response;
    })
    .catch(error => {
      console.error('Error fetching user reservations:', error.response?.data || error.message);
      throw error;
    });
};

export const updateReservation = (id, data) => api.put(`/reservations/${id}`, data);
export const cancelReservation = (id) => api.delete(`/reservations/${id}`);
export const deleteReservation = (id) => api.delete(`/reservations/${id}`);

// Admin
export const getDashboardData = () => api.get('/admin/dashboard')
export const getTables = (search = '', type = 'all') => {
  return api.get(`/admin/tables?search=${search}&type=${type}`);
};
export const addTable = (tableData) => api.post('/admin/tables', tableData)
export const deleteTable = (tableId) => api.delete(`/admin/tables/${tableId}`)

export const updateTable = async (tableId, tableData) => {
  return api.put(`/admin/tables/${tableId}`, tableData);
};

// Admin Reservations
export const getAdminReservations = () => api.get('/admin/reservations');
export const updateAdminReservation = (id, data) => api.put(`/admin/reservations/${id}`, data);
export const cancelAdminReservation = (id) => api.delete(`/admin/reservations/${id}`);
export const assignTable = (reservationId, tableId) => api.post(`/admin/reservations/${reservationId}/assign-table`, { tableId });

// Customer Management
export const getCustomers = () => api.get('/admin/customers');
export const sendPromotion = (customerId, message) => api.post(`/admin/customers/${customerId}/promotion`, { message });

// Profile Management
export const getProfile = () => api.get('/auth/me');
export const updateProfile = (profileData) => api.put('/auth/me', profileData);
export const uploadProfilePicture = (formData) => {
  return api.post('/auth/upload-profile-picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getProfilePictureUrl = (path) => {
  if (!path) return null;
  return path.startsWith('http') ? path : `${import.meta.env.VITE_API_URL}${path}`;
};

export const resetPassword = (token, password) => {
  console.log('Resetting password:', { token, password: password.length });
  return api.post(`/auth/reset-password/${token}`, { password })
    .catch(error => {
      console.error('Reset password API error:', error.response?.data || error.message);
      throw error;
    });
};

export default api