const defaultDevConvexUrl = 'http://127.0.0.1:3210';
const envConvexUrl = import.meta.env.VITE_CONVEX_URL?.trim() ?? '';

// Always provide a usable Convex URL so loyalty/referral features stay on in all environments.
export const convexUrl = envConvexUrl || defaultDevConvexUrl;
export const isConvexEnabled = true;
