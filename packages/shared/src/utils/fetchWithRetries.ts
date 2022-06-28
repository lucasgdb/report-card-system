import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosRetry, { isNetworkOrIdempotentRequestError, isRetryableError } from 'axios-retry';

import jwtToken from '../hash/jwtToken';

export type fetchWithRetriesConfig = {
  fetchTimeout?: number;
  retries?: number;
};

const DEFAULT_RETRIES_CONFIG = {
  fetchTimeout: 180000,
  retries: 3,
};

class ApplicationError extends Error {
  response?: AxiosResponse;

  constructor(message?: string) {
    super(message);

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default async function fetchWithRetries(
  axiosConfig: AxiosRequestConfig,
  retriesConfig: fetchWithRetriesConfig = DEFAULT_RETRIES_CONFIG
) {
  const { fetchTimeout, retries } = retriesConfig;

  const _fetchTimeout = fetchTimeout ?? DEFAULT_RETRIES_CONFIG.fetchTimeout;
  const _retries = retries ?? DEFAULT_RETRIES_CONFIG.retries;

  try {
    const client = axios.create({ timeout: _fetchTimeout, headers: { Authorization: jwtToken.get() } });

    axiosRetry(client, {
      retries: _retries,
      retryDelay: (retryCount) => retryCount * 3000,
      retryCondition: (error) => isNetworkOrIdempotentRequestError(error) || isRetryableError(error),
    });

    const response = await client(axiosConfig);

    return response;
  } catch (err: any) {
    if (err.response?.status === 401) {
      window.location.reload();
    }

    if (err.response?.status >= 500) {
      const error = new ApplicationError();
      error.response = err.response;

      throw error;
    }
  }
}
