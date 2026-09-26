import { API_BASE_URL } from '../config/env';
import type {
  Product,
  Category,
  Settings,
  DashboardStats,
  PaginatedResult,
  ProductStatus,
} from '../types';
import { getAdminToken, clearAdminToken } from './authStorage';

class ApiRequestError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    clearAdminToken();
  }

  if (!res.ok) {
    let message = `Erreur ${res.status}`;
    try {
      const body = await res.json();
      message = body.message || body.error || message;
    } catch {
      /* ignore parse failure */
    }
    throw new ApiRequestError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ---------- Public: Products ----------
export interface ProductListParams {
  category?: string;
  search?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
  featured?: boolean;
}

export function listPublicProducts(params: ProductListParams = {}): Promise<PaginatedResult<Product>> {
  const qs = new URLSearchParams();
  if (params.category && params.category !== 'tous') qs.set('category', params.category);
  if (params.search) qs.set('search', params.search);
  if (params.sort) qs.set('sort', params.sort);
  if (params.page) qs.set('page', String(params.page));
  if (params.pageSize) qs.set('pageSize', String(params.pageSize));
  if (params.featured) qs.set('featured', '1');
  return request(`/api/products?${qs.toString()}`);
}

export function getProductBySlug(slug: string): Promise<Product> {
  return request(`/api/products/${encodeURIComponent(slug)}`);
}

export function listCategories(): Promise<Category[]> {
  return request('/api/categories');
}

export function getSettings(): Promise<Settings> {
  return request('/api/settings');
}

export function submitContactForm(data: { name: string; phone: string; message: string }): Promise<{ ok: boolean }> {
  return request('/api/contact', { method: 'POST', body: JSON.stringify(data) });
}

// ---------- Admin: Auth ----------
export function adminLogin(email: string, password: string): Promise<{ token: string; expiresAt: string }> {
  return request('/api/admin/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export function adminLogout(): Promise<void> {
  return request('/api/admin/logout', { method: 'POST' });
}

// ---------- Admin: Dashboard ----------
export function getDashboardStats(): Promise<DashboardStats> {
  return request('/api/admin/dashboard');
}

// ---------- Admin: Products ----------
export interface AdminProductListParams {
  status?: ProductStatus | 'all';
  search?: string;
  page?: number;
  pageSize?: number;
}

export function listAdminProducts(params: AdminProductListParams = {}): Promise<PaginatedResult<Product>> {
  const qs = new URLSearchParams();
  if (params.status && params.status !== 'all') qs.set('status', params.status);
  if (params.search) qs.set('search', params.search);
  if (params.page) qs.set('page', String(params.page));
  if (params.pageSize) qs.set('pageSize', String(params.pageSize));
  return request(`/api/admin/products?${qs.toString()}`);
}

export function getAdminProduct(id: string): Promise<Product> {
  return request(`/api/admin/products/${id}`);
}

export type ProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'categoryName' | 'categorySlug'>;

export function createProduct(data: Partial<ProductInput>): Promise<Product> {
  return request('/api/admin/products', { method: 'POST', body: JSON.stringify(data) });
}

export function updateProduct(id: string, data: Partial<ProductInput>): Promise<Product> {
  return request(`/api/admin/products/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export function deleteProduct(id: string): Promise<void> {
  return request(`/api/admin/products/${id}`, { method: 'DELETE' });
}

export function setProductStatus(id: string, status: ProductStatus): Promise<Product> {
  return request(`/api/admin/products/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
}

// ---------- Admin: Categories ----------
export function listAdminCategories(): Promise<Category[]> {
  return request('/api/admin/categories');
}

export function createCategory(data: { name: string; slug: string; icon?: string; imageUrl?: string; sortOrder?: number }): Promise<Category> {
  return request('/api/admin/categories', { method: 'POST', body: JSON.stringify(data) });
}

export function updateCategory(id: string, data: Partial<{ name: string; slug: string; icon: string; imageUrl: string | null; sortOrder: number }>): Promise<Category> {
  return request(`/api/admin/categories/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export function deleteCategory(id: string): Promise<void> {
  return request(`/api/admin/categories/${id}`, { method: 'DELETE' });
}

// ---------- Admin: Settings ----------
export function updateSettings(data: Partial<Settings>): Promise<Settings> {
  return request('/api/admin/settings', { method: 'PATCH', body: JSON.stringify(data) });
}

// ---------- Admin: Images ----------
export function getUploadUrl(filename: string, contentType: string): Promise<{ uploadUrl: string; publicUrl: string; key: string }> {
  return request('/api/admin/uploads/sign', {
    method: 'POST',
    body: JSON.stringify({ filename, contentType }),
  });
}

export { ApiRequestError };
