import type { ApiRequest, ApiResponse } from './vercelTypes.js';

// Simple health/cron endpoint that can be scheduled via Vercel Cron Jobs.
export default async function handler(req: ApiRequest, res: ApiResponse) {
  const secret = process.env.CRON_SECRET;

  // Authorization check using CRON_SECRET passed by Vercel as Bearer token.
  if (!secret || req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).end('Unauthorized');
  }

  // Place your scheduled work here.
  res.status(200).json({ ok: true, ts: Date.now() });
}
