const defaultDevConvexUrl = 'http://127.0.0.1:3210';
const envConvexUrl = import.meta.env.VITE_CONVEX_URL?.trim() ?? '';
const isProd = import.meta.env.PROD;

// In production, only use the URL provided in VITE_CONVEX_URL.
// In development, fall back to localhost for convenience.
export const convexUrl = envConvexUrl || (!isProd ? defaultDevConvexUrl : undefined);
export const isConvexEnabled = Boolean(convexUrl);
