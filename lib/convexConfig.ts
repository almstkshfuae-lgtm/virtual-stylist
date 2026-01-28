const defaultDevConvexUrl = 'http://127.0.0.1:3210';
const envConvexUrl = import.meta.env.VITE_CONVEX_URL?.trim() ?? '';
const isDevFallback = !envConvexUrl && import.meta.env.DEV;

if (isDevFallback) {
  console.warn(
    'VITE_CONVEX_URL is not set; defaulting to http://127.0.0.1:3210 so Convex hooks still work locally.',
  );
}

export const convexUrl = envConvexUrl || (import.meta.env.DEV ? defaultDevConvexUrl : undefined);
export const isConvexEnabled = Boolean(convexUrl);
