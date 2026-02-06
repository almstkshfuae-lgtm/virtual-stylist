export type RetryOptions = {
  maxAttempts?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const isNetworkError = (error: unknown) => {
  if (!error) return false;
  if (error instanceof TypeError) return true;
  const name = (error as any)?.name;
  if (name === 'TypeError') return true;
  const message = typeof (error as any)?.message === 'string' ? (error as any).message : '';
  return /Failed to fetch|NetworkError|ERR_NETWORK_CHANGED/i.test(message);
};

export async function fetchWithRetry(
  input: RequestInfo | URL,
  init?: RequestInit,
  options?: RetryOptions
): Promise<Response> {
  const maxAttempts = options?.maxAttempts ?? 3;
  const baseDelayMs = options?.baseDelayMs ?? 500;
  const maxDelayMs = options?.maxDelayMs ?? 2000;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await fetch(input, init);
    } catch (error) {
      if (init?.signal?.aborted || (error as any)?.name === 'AbortError') {
        throw error;
      }

      if (!isNetworkError(error)) {
        throw error;
      }

      if (attempt >= maxAttempts) {
        throw error;
      }

      const delay = Math.min(maxDelayMs, baseDelayMs * 2 ** (attempt - 1));
      await sleep(delay);
    }
  }

  throw new Error('fetchWithRetry exceeded max attempts');
}
