import { ReactNode } from 'react';
import { ConvexProvider, ConvexReactClient } from 'convex/react';

const defaultDevConvexUrl = 'http://127.0.0.1:3210';
const isDevFallback = !import.meta.env.VITE_CONVEX_URL && import.meta.env.DEV;
if (isDevFallback) {
  console.warn(
    'VITE_CONVEX_URL is not set; defaulting to http://127.0.0.1:3210 so Convex hooks still work locally.',
  );
}
const convexUrl =
  import.meta.env.VITE_CONVEX_URL ?? (import.meta.env.DEV ? defaultDevConvexUrl : undefined);
const convexClient = convexUrl ? new ConvexReactClient(convexUrl) : null;

interface ConvexProviderWrapperProps {
  children: ReactNode;
}

export function ConvexProviderWrapper({ children }: ConvexProviderWrapperProps) {
  if (!convexClient) {
    if (import.meta.env.DEV) {
      console.warn('Convex URL not configured. Set VITE_CONVEX_URL to enable Convex features.');
    }
    return <>{children}</>;
  }

  return <ConvexProvider client={convexClient}>{children}</ConvexProvider>;
}

export default ConvexProviderWrapper;
