/**
 * REFERENCE: WorkOS AuthKit Configuration for Convex
 * 
 * This file demonstrates how to configure Convex to authenticate
 * with WorkOS AuthKit.
 * 
 * ==============================================================================
 * 
 * TO USE IN PRODUCTION:
 * 
 * 1. Install @workos-inc/authkit-react:
 *    npm install @workos-inc/authkit-react
 * 
 * 2. Copy this file to convex/auth.config.ts
 * 
 * 3. Set environment variables:
 *    - WORKOS_CLIENT_ID: Your WorkOS client ID
 *    - Add to Convex dashboard environment variables
 * 
 * 4. Update your main.tsx (see components/ConvexProviderWithAuthKit.reference.tsx):
 *    - Import ConvexProviderWithAuthKit
 *    - Import AuthKitProvider and useAuth from @workos-inc/authkit-react
 *    - Wrap your app with AuthKitProvider and ConvexProviderWithAuthKit
 * 
 * 5. Replace current ConvexProviderWrapper.tsx with the WorkOS version
 * 
 * ==============================================================================
 */

import { AuthConfig } from 'convex/server';

const clientId = process.env.WORKOS_CLIENT_ID;

export default {
  providers: [
    {
      type: 'customJwt',
      issuer: 'https://api.workos.com/',
      algorithm: 'RS256',
      jwks: `https://api.workos.com/sso/jwks/${clientId}`,
      applicationID: clientId,
    },
    {
      type: 'customJwt',
      issuer: `https://api.workos.com/user_management/${clientId}`,
      algorithm: 'RS256',
      jwks: `https://api.workos.com/sso/jwks/${clientId}`,
    },
  ],
} satisfies AuthConfig;
