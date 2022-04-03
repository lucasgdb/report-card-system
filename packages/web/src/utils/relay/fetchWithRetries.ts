export type InitWithRetries = {
  body?: unknown;
  cache?: string | null;
  credentials?: string | null;
  fetchTimeout?: number | null;
  headers?: unknown;
  method?: string | null;
  mode?: string | null;
  retryDelays?: Array<number> | null;
};

const DEFAULT_TIMEOUT = 15000;
const DEFAULT_RETRIES = [1000, 3000];

class RelayError extends Error {
  response: Response;

  constructor(message?: string) {
    super(message);

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

function fetchWithRetries(uri: string, initWithRetries: InitWithRetries = {}): Promise<Response> {
  const { fetchTimeout, retryDelays, ...init } = initWithRetries;

  const _fetchTimeout = fetchTimeout ?? DEFAULT_TIMEOUT;
  const _retryDelays = retryDelays ?? DEFAULT_RETRIES;

  let requestsAttempted = 0;
  let requestStartTime = 0;

  return new Promise((resolve, reject) => {
    /**
     * Checks if another attempt should be done to send a request to the server.
     */
    function shouldRetry(attempt: number): boolean {
      return attempt <= _retryDelays.length;
    }

    /**
     * Schedules another run of sendTimedRequest based on how much time has
     * passed between the time the last request was sent and now.
     */
    function retryRequest(): void {
      const retryDelay = _retryDelays[requestsAttempted - 1];
      const retryStartTime = requestStartTime + retryDelay;

      // Schedule retry for a configured duration after last request started.
      setTimeout(sendTimedRequest, retryStartTime - Date.now());
    }

    /**
     * Sends a request to the server that will timeout after `fetchTimeout`.
     * If the request fails or times out a new request might be scheduled.
     */
    async function sendTimedRequest() {
      requestsAttempted += 1;
      requestStartTime = Date.now();

      let isRequestAlive = true;

      const requestTimeout = setTimeout(() => {
        isRequestAlive = false;

        if (shouldRetry(requestsAttempted)) {
          console.warn('fetchWithRetries: HTTP timeout, retrying.');

          retryRequest();
          return;
        }

        reject(
          new Error(
            `fetchWithRetries(): Failed to get response from server, tried ${requestsAttempted} times. Try again later.`
          )
        );
      }, _fetchTimeout);

      const response = await fetch(uri, init as RequestInit);

      try {
        clearTimeout(requestTimeout);

        if (!isRequestAlive) {
          return;
        }

        // We got a response, we can clear the timeout.
        if (response.status >= 200 && response.status < 300) {
          // Got a response code that indicates success, resolve the promise.
          resolve(response);
          return;
        }

        if (response.status >= 500) {
          const error = new RelayError();
          error.response = response;

          reject(error);
          return;
        }

        if (shouldRetry(requestsAttempted)) {
          // Fetch was not successful, retrying.
          console.warn('fetchWithRetries: HTTP timeout, retrying.');

          retryRequest();
          return;
        }

        // Request was not successful, giving up.
        const error = new RelayError(
          `fetchWithRetries(): Still no successful response after ${requestsAttempted} retries, giving up.`
        );

        error.response = response;

        reject(error);
      } catch (error) {
        clearTimeout(requestTimeout);

        if (shouldRetry(requestsAttempted)) {
          retryRequest();
          return;
        }

        reject(error);
      }
    }

    sendTimedRequest();
  });
}

export default fetchWithRetries;
