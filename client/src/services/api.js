import axios from 'axios';

// API base URLs
const AUTH_API_URL = 'http://localhost:4001/api/auth';
const BOOK_API_URL = 'http://localhost:4002/api/books';
const ORDER_API_URL = 'http://localhost:4003/api/orders';

// Create axios instances for each service
const authApi = axios.create({
  baseURL: AUTH_API_URL,
});

const bookApi = axios.create({
  baseURL: BOOK_API_URL,
});

const orderApi = axios.create({
  baseURL: ORDER_API_URL,
});

// Add token to requests
const setAuthToken = (token) => {
  if (token) {
    authApi.defaults.headers.common['x-auth-token'] = token;
    bookApi.defaults.headers.common['x-auth-token'] = token;
    orderApi.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete authApi.defaults.headers.common['x-auth-token'];
    delete bookApi.defaults.headers.common['x-auth-token'];
    delete orderApi.defaults.headers.common['x-auth-token'];
  }
};

// Auth Service API calls
export const authService = {
  register: async (userData) => {
    const response = await authApi.post('/register', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await authApi.post('/login', credentials);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await authApi.get('/me');
    return response.data;
  },
};

// Book Service API calls
export const bookService = {
  getAllBooks: async () => {
    const response = await bookApi.get('/');
    return response.data;
  },
  getBookById: async (id) => {
    const response = await bookApi.get(`/${id}`);
    return response.data;
  },
  getBooksByCategory: async (category) => {
    const response = await bookApi.get(`/category/${category}`);
    return response.data;
  },
  addBook: async (bookData) => {
    const response = await bookApi.post('/', bookData);
    return response.data;
  },
  updateBook: async (id, bookData) => {
    const response = await bookApi.put(`/${id}`, bookData);
    return response.data;
  },
  deleteBook: async (id) => {
    const response = await bookApi.delete(`/${id}`);
    return response.data;
  },
};

// Order Service API calls
export const orderService = {
  createOrder: async (orderData) => {
    const response = await orderApi.post('/', orderData);
    return response.data;
  },
  getUserOrders: async () => {
    const response = await orderApi.get('/');
    return response.data;
  },
  getOrderById: async (id) => {
    const response = await orderApi.get(`/${id}`);
    return response.data;
  },
  updateOrderStatus: async (id, statusData) => {
    const response = await orderApi.put(`/${id}`, statusData);
    return response.data;
  },
  getAllOrders: async () => {
    const response = await orderApi.get('/admin/all');
    return response.data;
  },
};

export { setAuthToken };
