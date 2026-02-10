const envConvexUrl = import.meta.env.VITE_CONVEX_URL?.trim() ?? '';
// Require an explicit VITE_CONVEX_URL; no localhost fallback to avoid accidental client auth calls.
export const convexUrl = envConvexUrl || undefined;
export const isConvexEnabled = Boolean(convexUrl);
