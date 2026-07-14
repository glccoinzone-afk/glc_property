import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

const instance = axios.create({ baseURL: API });

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('glc_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('glc_token');
      localStorage.removeItem('glc_user');
    }
    return Promise.reject(err);
  }
);

export const api = instance;

// ---------- Auth ----------
export const authAPI = {
  register: (data) => instance.post('/auth/register', data),
  login: (data) => instance.post('/auth/login', data),
  me: () => instance.get('/auth/me')
};

// ---------- Properties ----------
export const propertiesAPI = {
  list: (params) => instance.get('/properties', { params }),
  get: (id) => instance.get(`/properties/${id}`),
  create: (data) => instance.post('/properties', data),
  update: (id, data) => instance.put(`/properties/${id}`, data),
  remove: (id) => instance.delete(`/properties/${id}`),
  mine: () => instance.get('/properties/mine/list')
};

// ---------- Builders / Land ----------
export const buildersAPI = {
  list: (params) => instance.get('/builders', { params }),
  land: (params) => instance.get('/land-projects', { params })
};

// ---------- User Actions ----------
export const userActionsAPI = {
  enquire: (data) => instance.post('/enquiries', data),
  myEnquiries: () => instance.get('/enquiries/mine'),
  agentEnquiries: () => instance.get('/enquiries/for-agent'),
  shortlist: (property_id) => instance.post('/shortlist', { property_id }),
  removeShortlist: (id) => instance.delete(`/shortlist/${id}`),
  myShortlist: () => instance.get('/shortlist/mine'),
  saveSearch: (data) => instance.post('/saved-searches', data),
  mySavedSearches: () => instance.get('/saved-searches/mine'),
  deleteSavedSearch: (id) => instance.delete(`/saved-searches/${id}`)
};

// ---------- Admin ----------
export const adminAPI = {
  stats: () => instance.get('/admin/stats'),
  users: (params) => instance.get('/admin/users', { params }),
  updateUserStatus: (userId, status) => instance.patch(`/admin/users/${userId}/status`, null, { params: { status } }),
  pending: () => instance.get('/admin/properties/pending'),
  verify: (propId, approve = true) => instance.patch(`/admin/properties/${propId}/verify`, null, { params: { approve } }),
  flag: (propId, flag, value) => instance.patch(`/admin/properties/${propId}/flag`, null, { params: { flag, value } })
};

// Helper: convert backend property to card-safe format
export const normalizeProperty = (p) => ({
  ...p,
  areaUnit: p.area_unit || 'sq.ft',
  propertyType: p.property_type,
  ownerDirect: p.owner_direct,
  postedBy: p.posted_by,
  postedAt: p.posted_at ? new Date(p.posted_at).toLocaleDateString('en-IN') : 'recent'
});

export const formatINR = (amount) => {
  if (!amount && amount !== 0) return 'N/A';
  if (amount >= 10000000) return `₹ ${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹ ${(amount / 100000).toFixed(2)} L`;
  if (amount >= 1000) return `₹ ${(amount / 1000).toFixed(1)}K`;
  return `₹ ${amount}`;
};
