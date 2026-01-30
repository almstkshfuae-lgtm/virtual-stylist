/**
 * Lightweight client to send developer-only fashion insights to Convex via the proxy.
 * Falls back silently if Convex is disabled or request fails.
 */
interface InsightPayload {
  styles: string[];
  keywords: string[];
  language: string;
  bodyShape?: string;
}

const apiBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
const proxyUrl = apiBaseUrl
  ? `${apiBaseUrl.replace(/\/+$/, '')}/api/convex/insights`
  : '/api/convex/insights';

export const logInsightClient = async (payload: InsightPayload) => {
  try {
    const res = await fetch(proxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error(`insight log failed ${res.status}`);
    }
  } catch (error) {
    // Dev-only telemetry; ignore failures in production UI.
    console.debug('insight log error', error);
  }
};
