/** A response outside 2xx. `response` is kept so callers can read the status or the body. */
export class HttpError extends Error {
  readonly response: Response;

  constructor(response: Response) {
    super(`HTTP ${response.status}`);
    this.name = 'HttpError';
    this.response = response;
  }
}

type FetchWithRetriesOptions = RequestInit & {
  /** Per attempt, in ms. */
  timeout?: number;
  retries?: number;
};

const isRetryableStatus = (status: number) => status === 429 || status >= 500;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * `fetch` with a timeout and retries: network failures, timeouts, 429 and 5xx are retried 3s, 6s, 9s…
 * apart. Resolves only with 2xx responses; other statuses reject with `HttpError`.
 */
export default async function fetchWithRetries(
  url: string,
  { timeout = 180_000, retries = 3, ...init }: FetchWithRetriesOptions = {}
): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    try {
      const response = await fetch(url, { ...init, signal: AbortSignal.timeout(timeout) });
      if (response.ok) {
        return response;
      }
      if (!isRetryableStatus(response.status) || attempt >= retries) {
        throw new HttpError(response);
      }
    } catch (error) {
      if (error instanceof HttpError || attempt >= retries) {
        throw error;
      }
    }

    await wait((attempt + 1) * 3000);
  }
}
