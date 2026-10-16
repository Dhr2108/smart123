const API_BASE = '/api';

interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.error || `Request failed with status ${response.status}`,
      response.status,
      errorData
    );
  }

  return response.json();
}

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<{ user: { userId: string; email: string; role: string; name: string }; token: string }>(
      '/auth', { method: 'POST', body: { action: 'login', email, password } }
    ),
  register: (data: { name: string; email: string; password: string; role?: string; department?: string }) =>
    apiRequest<{ user: { userId: string; email: string; role: string; name: string }; token: string }>(
      '/auth', { method: 'POST', body: { action: 'register', ...data } }
    ),
  logout: () =>
    apiRequest<{ message: string }>('/auth', { method: 'POST', body: { action: 'logout' } }),
  me: () =>
    apiRequest<{ user: Record<string, unknown> }>('/auth/me'),
};

// Patients
export const patientsApi = {
  list: (params?: { search?: string; status?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    return apiRequest<{ patients: unknown[]; total: number; page: number; totalPages: number }>(
      `/patients?${query}`
    );
  },
  get: (id: string) => apiRequest<{ patient: unknown }>(`/patients/${id}`),
  create: (data: unknown) => apiRequest<{ patient: unknown }>('/patients', { method: 'POST', body: data }),
  update: (id: string, data: unknown) => apiRequest<{ patient: unknown }>(`/patients/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => apiRequest<{ message: string }>(`/patients/${id}`, { method: 'DELETE' }),
};

// Doctors
export const doctorsApi = {
  list: (params?: { search?: string; status?: string; department?: string; specialization?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    if (params?.department) query.set('department', params.department);
    if (params?.specialization) query.set('specialization', params.specialization);
    return apiRequest<{ doctors: unknown[] }>(`/doctors?${query}`);
  },
  get: (id: string) => apiRequest<{ doctor: unknown }>(`/doctors/${id}`),
  create: (data: unknown) => apiRequest<{ doctor: unknown }>('/doctors', { method: 'POST', body: data }),
  update: (id: string, data: unknown) => apiRequest<{ doctor: unknown }>(`/doctors/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => apiRequest<{ message: string }>(`/doctors/${id}`, { method: 'DELETE' }),
};

// Appointments
export const appointmentsApi = {
  list: (params?: { search?: string; status?: string; type?: string; doctorId?: string; patientId?: string; date?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    if (params?.type) query.set('type', params.type);
    if (params?.doctorId) query.set('doctorId', params.doctorId);
    if (params?.patientId) query.set('patientId', params.patientId);
    if (params?.date) query.set('date', params.date);
    return apiRequest<{ appointments: unknown[] }>(`/appointments?${query}`);
  },
  get: (id: string) => apiRequest<{ appointment: unknown }>(`/appointments/${id}`),
  create: (data: unknown) => apiRequest<{ appointment: unknown }>('/appointments', { method: 'POST', body: data }),
  update: (id: string, data: unknown) => apiRequest<{ appointment: unknown }>(`/appointments/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => apiRequest<{ message: string }>(`/appointments/${id}`, { method: 'DELETE' }),
};

// Billing
export const billingApi = {
  list: (params?: { search?: string; status?: string; patientId?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    if (params?.patientId) query.set('patientId', params.patientId);
    return apiRequest<{ bills: unknown[] }>(`/billing?${query}`);
  },
  get: (id: string) => apiRequest<{ bill: unknown }>(`/billing/${id}`),
  create: (data: unknown) => apiRequest<{ bill: unknown }>('/billing', { method: 'POST', body: data }),
  update: (id: string, data: unknown) => apiRequest<{ bill: unknown }>(`/billing/${id}`, { method: 'PUT', body: data }),
  makePayment: (id: string, amount: number, method: string) =>
    apiRequest<{ bill: unknown }>(`/billing/${id}`, { method: 'PUT', body: { paymentAmount: amount, paymentMethod: method } }),
};

// Pharmacy
export const pharmacyApi = {
  list: (params?: { search?: string; status?: string; category?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    if (params?.category) query.set('category', params.category);
    return apiRequest<{ medicines: unknown[] }>(`/pharmacy?${query}`);
  },
  create: (data: unknown) => apiRequest<{ medicine: unknown }>('/pharmacy', { method: 'POST', body: data }),
  update: (id: string, data: unknown) => apiRequest<{ medicine: unknown }>(`/pharmacy/${id}`, { method: 'PUT', body: data }),
  delete: (id: string) => apiRequest<{ message: string }>(`/pharmacy/${id}`, { method: 'DELETE' }),
};

// Lab
export const labApi = {
  listTests: (params?: { search?: string; status?: string; category?: string }) => {
    const query = new URLSearchParams({ resource: 'tests' });
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    if (params?.category) query.set('category', params.category);
    return apiRequest<{ tests: unknown[] }>(`/lab?${query}`);
  },
  listOrders: (params?: { search?: string; status?: string }) => {
    const query = new URLSearchParams({ resource: 'orders' });
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    return apiRequest<{ orders: unknown[] }>(`/lab?${query}`);
  },
  createOrder: (data: unknown) => apiRequest<{ order: unknown }>('/lab', { method: 'POST', body: data }),
  updateOrder: (id: string, data: unknown) => apiRequest<{ order: unknown }>(`/lab/${id}`, { method: 'PUT', body: data }),
};

// Notifications
export const notificationsApi = {
  list: (params?: { category?: string; isRead?: boolean; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.isRead !== undefined) query.set('isRead', String(params.isRead));
    if (params?.limit) query.set('limit', String(params.limit));
    return apiRequest<{ notifications: unknown[]; unreadCount: number }>(`/notifications?${query}`);
  },
  markRead: (id: string) =>
    apiRequest<{ message: string }>('/notifications', { method: 'PUT', body: { id } }),
  markAllRead: () =>
    apiRequest<{ message: string }>('/notifications', { method: 'PUT', body: { markAllRead: true } }),
};

// Dashboard
export const dashboardApi = {
  getStats: () => apiRequest<{ stats: Record<string, number> }>('/dashboard'),
};

// AI Triage
export const triageApi = {
  analyze: (data: { symptoms: string; age?: number; gender?: string; medicalHistory?: string }) =>
    apiRequest<{ triage: Record<string, unknown> }>('/triage', { method: 'POST', body: data }),
};

export { ApiError };
