import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosRetry, { isNetworkOrIdempotentRequestError, isRetryableError } from 'axios-retry';

import jwtToken from '~/utils/jwtToken';

export type fetchWithRetriesConfig = {
  fetchTimeout?: number;
};

const DEFAULT_TIMEOUT = 15000;

class RelayError extends Error {
  response: AxiosResponse;

  constructor(message?: string) {
    super(message);

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default async function fetchWithRetries(
  axiosConfig: AxiosRequestConfig,
  retriesConfig: fetchWithRetriesConfig = {}
): Promise<AxiosResponse> {
  const { fetchTimeout } = retriesConfig;

  const _fetchTimeout = fetchTimeout ?? DEFAULT_TIMEOUT;

  const client = axios.create({ timeout: _fetchTimeout, headers: { Authorization: jwtToken.get() } });

  axiosRetry(client, {
    retries: 3,
    retryDelay: (retryCount) => retryCount * 3000,
    retryCondition: (error) => isNetworkOrIdempotentRequestError(error) || isRetryableError(error),
  });

  const response = await client(axiosConfig);

  if (response.status >= 200 && response.status < 300) {
    // Got a response code that indicates success, resolve the promise.
    return response;
  }

  if (response.status >= 500) {
    const error = new RelayError();
    error.response = response;

    throw error;
  }
}
