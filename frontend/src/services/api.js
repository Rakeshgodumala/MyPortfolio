import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
  timeout: 60000, // free hosting tiers can take a while to wake up
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
});

/** Turns any Axios error into { message, fieldErrors, status } for display. */
export function parseApiError(error, fallback = 'Something went wrong. Please try again.') {
  if (error?.response) {
    const { status, data } = error.response;
    return {
      status,
      message: data?.message || fallback,
      fieldErrors: data?.errors || {},
    };
  }
  if (error?.code === 'ECONNABORTED') {
    return { status: 0, message: 'The server took too long to respond. Please try again.', fieldErrors: {} };
  }
  return { status: 0, message: 'Cannot reach the server. Check your connection and try again.', fieldErrors: {} };
}

/** Resolves an image path from the API (e.g. /uploads/x.png in development) to a usable URL. */
export function resolveImageUrl(url) {
  if (
    !url ||
    /^https?:\/\//.test(url) ||
    url.startsWith(`${import.meta.env.BASE_URL}projects/`)
  ) {
    return url;
  }
  const base = import.meta.env.VITE_API_BASE_URL;
  return base ? new URL(url, base).href : url;
}
