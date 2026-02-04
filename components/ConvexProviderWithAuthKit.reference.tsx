import { ReactNode, useCallback, useMemo } from 'react';
import { ConvexProviderWithAuth, ConvexReactClient } from 'convex/react';

/**
 * REFERENCE IMPLEMENTATION: WorkOS AuthKit Integration
 * 
 * This component demonstrates how to integrate WorkOS AuthKit with Convex.
 * 
 * Usage:
 * ```typescript
 * import { ConvexProviderWithAuthKit } from './components/ConvexProviderWithAuthKit.reference';
 * import { useAuth } from '@workos-inc/authkit-react';
 * 
 * <AuthKitProvider clientId={...}>
 *   <ConvexProviderWithAuthKit client={convex} useAuth={useAuth}>
 *     <App />
 *   </ConvexProviderWithAuthKit>
 * </AuthKitProvider>
 * ```
 * 
 * Current implementation: Custom authentication (see ConvexProviderWrapper.tsx)
 * 
 * To migrate to WorkOS:
 * 1. Install @workos-inc/authkit-react
 * 2. Replace ConvexProviderWrapper.tsx with this implementation
 * 3. Add auth.config.ts to convex/ directory
 * 4. See docs/WORKOS_AUTH_REFERENCE.ts for Convex configuration
 */

type UseAuth = () => {
  isLoading: boolean;
  user: unknown;
  getAccessToken: () => Promise<string | null>;
};

/**
 * A wrapper React component which provides a {@link ConvexReactClient}
 * authenticated with WorkOS AuthKit.
 *
 * It must be wrapped by a configured `AuthKitProvider`, from
 * `@workos-inc/authkit-react`.
 *
 * @public
 */
export function ConvexProviderWithAuthKit({
  children,
  client,
  useAuth,
}: {
  children: ReactNode;
  client: ConvexReactClient;
  useAuth: UseAuth;
}) {
  const useAuthFromWorkOS = useUseAuthFromAuthKit(useAuth);
  return (
    <ConvexProviderWithAuth client={client} useAuth={useAuthFromWorkOS}>
      {children}
    </ConvexProviderWithAuth>
  );
}

function useUseAuthFromAuthKit(useAuth: UseAuth) {
  return useMemo(
    () =>
      function useAuthFromWorkOS() {
        const { isLoading, user, getAccessToken } = useAuth();

        const fetchAccessToken = useCallback(async () => {
          try {
            const token = await getAccessToken();
            return token;
          } catch (error) {
            console.error('Error fetching WorkOS access token:', error);
            return null;
          }
        }, [getAccessToken]);

        return useMemo(
          () => ({
            isLoading,
            isAuthenticated: !!user,
            fetchAccessToken,
          }),
          [isLoading, user, fetchAccessToken],
        );
      },
    [useAuth],
  );
}
