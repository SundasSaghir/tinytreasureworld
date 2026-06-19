import { supabase } from './supabase';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  salePrice: number | null;
  stock: number;
  sku: string;
  images: string[];
  featured: boolean;
  bestSeller: boolean;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  order: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
  items: { productId: string; name: string; price: number; quantity: number }[];
  total: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  active: boolean;
  order: number;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  productId: string | null;
  active: boolean;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minAmount: number;
  active: boolean;
  expiresAt: string;
}

export interface Setting {
  key: string;
  value: string;
}

export interface DB {
  products: Product[];
  categories: Category[];
  orders: Order[];
  banners: Banner[];
  reviews: Review[];
  coupons: Coupon[];
  settings: Setting[];
  admin: { username: string; password: string };
}

export async function getDb(): Promise<DB> {
  const [
    productsRes, categoriesRes, ordersRes, bannersRes,
    reviewsRes, couponsRes, settingsRes, adminRes
  ] = await Promise.all([
    supabase.from('products').select('*'),
    supabase.from('categories').select('*').order('order'),
    supabase.from('orders').select('*').order('createdAt', { ascending: false }),
    supabase.from('banners').select('*').order('order'),
    supabase.from('reviews').select('*').order('createdAt', { ascending: false }),
    supabase.from('coupons').select('*'),
    supabase.from('settings').select('*'),
    supabase.from('admin').select('*').maybeSingle(),
  ]);

  return {
    products: (productsRes.data || []) as unknown as Product[],
    categories: (categoriesRes.data || []) as unknown as Category[],
    orders: (ordersRes.data || []) as unknown as Order[],
    banners: (bannersRes.data || []) as unknown as Banner[],
    reviews: (reviewsRes.data || []) as unknown as Review[],
    coupons: (couponsRes.data || []) as unknown as Coupon[],
    settings: (settingsRes.data || []) as unknown as Setting[],
    admin: adminRes.data as { username: string; password: string } || { username: 'admin', password: '' },
  };
}

export async function getDbFresh(): Promise<DB> {
  return getDb();
}

export function resetDbCache() {}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export { supabase };
