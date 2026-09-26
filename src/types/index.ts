// Shared types for Tata Boutique — mirrored by the Worker API (workers/src/types.ts)
// Keep these two files in sync manually since frontend and Worker are separate builds.

export type ProductStatus = 'publie' | 'brouillon' | 'masque' | 'rupture';

export interface Category {
  parentId?: string | null;
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  imageUrl?: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  oldPrice: number | null;
  categoryId: string;
  categoryName?: string;
  categorySlug?: string;
  images: string[];
  mainImage: string;
  stock: number;
  available: boolean;
  status: ProductStatus;
  badge: string | null;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  shopName: string;
  slogan: string;
  description: string;
  whatsappNumber: string; // digits only, e.g. "224622063419"
  contactEmail: string | null;
  facebookUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
  logoUrl: string | null;
  address: string | null;
}

export interface DashboardStats {
  totalProducts: number;
  published: number;
  hidden: number;
  outOfStock: number;
  drafts: number;
  totalCategories: number;
  recentProducts: Product[];
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiError {
  error: string;
  message: string;
}

export type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'name_asc';
