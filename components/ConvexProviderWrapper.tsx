import { ReactNode } from 'react';
import { ConvexProvider, ConvexReactClient } from 'convex/react';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

interface ConvexProviderWrapperProps {
  children: ReactNode;
}

export function ConvexProviderWrapper({ children }: ConvexProviderWrapperProps) {
  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
}

export default ConvexProviderWrapper;
