// Base API URL configuration
// In development, this defaults to localhost:5000
// In production, set NEXT_PUBLIC_API_URL in your environment variables (e.g., on Vercel)
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const API_ROUTES = {
  PRODUCTS: `${API_BASE_URL}/api/products`,
  ORDERS: `${API_BASE_URL}/api/orders`,
  UPLOAD: `${API_BASE_URL}/api/upload`,
};
