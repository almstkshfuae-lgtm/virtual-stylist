import { ReactNode } from 'react';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { useAuth } from '@clerk/clerk-react';
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

  return (
    <ConvexProviderWithClerk client={convexClient} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}

export default ConvexProviderWrapper;
