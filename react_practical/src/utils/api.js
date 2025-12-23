import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

console.log('API Base URL:', BASE_URL); // Debug log

// API utility functions
export const api = {
  // Generic GET
  get: async (endpoint) => {
    try {
      console.log('GET Request:', `${BASE_URL}${endpoint}`);
      const response = await axios.get(`${BASE_URL}${endpoint}`);
      return { data: response.data, error: null };
    } catch (error) {
      console.error('GET Error:', error);
      return { data: null, error: error.message };
    }
  },

  // Generic POST
  post: async (endpoint, data) => {
    try {
      console.log('🚀 POST Request:', `${BASE_URL}${endpoint}`);
      console.log('📦 Payload:', JSON.stringify(data, null, 2));
      const response = await axios.post(`${BASE_URL}${endpoint}`, data);
      console.log('✅ POST Response:', response.data);
      return { data: response.data, error: null };
    } catch (error) {
      console.error('❌ POST Error:', error);
      console.error('Error details:', error.response?.data || error.message);
      return { data: null, error: error.response?.data?.error || error.message };
    }
  },

  // Generic PUT
  put: async (endpoint, data) => {
    try {
      console.log('🔄 PUT Request:', `${BASE_URL}${endpoint}`);
      const response = await axios.put(`${BASE_URL}${endpoint}`, data);
      console.log('✅ PUT Response:', response.data);
      return { data: response.data, error: null };
    } catch (error) {
      console.error('❌ PUT Error:', error);
      return { data: null, error: error.response?.data?.error || error.message };
    }
  },

  // Generic PATCH
  patch: async (endpoint, data) => {
    try {
      console.log('🔄 PATCH Request:', `${BASE_URL}${endpoint}`);
      const response = await axios.patch(`${BASE_URL}${endpoint}`, data);
      console.log('✅ PATCH Response:', response.data);
      return { data: response.data, error: null };
    } catch (error) {
      console.error('❌ PATCH Error:', error);
      return { data: null, error: error.response?.data?.error || error.message };
    }
  },

  // Generic DELETE
  delete: async (endpoint) => {
    try {
      console.log('🗑️ DELETE Request:', `${BASE_URL}${endpoint}`);
      const response = await axios.delete(`${BASE_URL}${endpoint}`);
      console.log('✅ DELETE Response:', response.data);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Specific endpoints
  login: (credentials) => api.post('/auth/login', credentials),
  
  fetchDoctors: () => api.get('/doctors'),
  fetchPatients: () => api.get('/patients'),
  fetchSlots: () => api.get('/slots'),
  fetchReviews: () => api.get('/reviews'),
  fetchAppointments: () => api.get('/appointments'),
  fetchPayments: () => api.get('/payments'),
  fetchContacts: () => api.get('/contacts'),
  
  // Dashboard
  fetchDashboardStats: () => api.get('/dashboard/stats'),
  fetchDoctorPayments: () => api.get('/dashboard/doctor-payments'),
  
  createPatient: (data) => api.post('/patients', data),
  createDoctor: (data) => api.post('/doctors', data),
  createAppointment: (data) => api.post('/appointments', data),
  createReview: (data) => api.post('/reviews', data),
  createContact: (data) => api.post('/contacts', data),
  createPayment: (data) => api.post('/payments', data),
  
  updatePatient: (id, data) => api.put(`/patients/${id}`, data),
  updateDoctor: (id, data) => api.put(`/doctors/${id}`, data),
  updateAppointment: (id, data) => api.put(`/appointments/${id}`, data),
  updatePayment: (id, data) => api.put(`/payments/${id}`, data),
  
  // Partial updates (PATCH)
  patchDoctor: (id, data) => api.patch(`/doctors/${id}`, data),
  patchAppointment: (id, data) => api.patch(`/appointments/${id}`, data),
  
  deleteAppointment: (id) => api.delete(`/appointments/${id}`),
  deleteDoctor: (id) => api.delete(`/doctors/${id}`),
  deletePatient: (id) => api.delete(`/patients/${id}`),
  deletePayment: (id) => api.delete(`/payments/${id}`),
};
