import { ReactNode } from 'react';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { convexUrl } from '../lib/convexConfig';

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
