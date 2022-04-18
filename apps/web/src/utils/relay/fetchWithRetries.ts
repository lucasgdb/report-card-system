import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosRetry, { isNetworkOrIdempotentRequestError, isRetryableError } from 'axios-retry';

import jwtToken from '~/utils/jwtToken';

export type fetchWithRetriesConfig = {
  fetchTimeout?: number;
  retries?: number;
};

const DEFAULT_RETRIES_CONFIG = {
  fetchTimeout: 15000,
  retries: 3,
};

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
  retriesConfig: fetchWithRetriesConfig = DEFAULT_RETRIES_CONFIG
): Promise<AxiosResponse> {
  const { fetchTimeout, retries } = retriesConfig;

  const _fetchTimeout = fetchTimeout ?? DEFAULT_RETRIES_CONFIG.fetchTimeout;
  const _retries = retries ?? DEFAULT_RETRIES_CONFIG.retries;

  const client = axios.create({ timeout: _fetchTimeout, headers: { Authorization: jwtToken.get() } });

  axiosRetry(client, {
    retries: _retries,
    retryDelay: (retryCount) => retryCount * 3000,
    retryCondition: (error) => isNetworkOrIdempotentRequestError(error) || isRetryableError(error),
  });

  const response = await client(axiosConfig);

  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  if (response.status >= 500) {
    const error = new RelayError();
    error.response = response;

    throw error;
  }
}
