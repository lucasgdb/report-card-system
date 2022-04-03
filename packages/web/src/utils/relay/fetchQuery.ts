import type { RequestParameters, Variables } from 'relay-runtime';

import fetchWithRetries from './fetchWithRetries';
import { isMutation } from './helpers';
import jwtToken from '~/utils/jwtToken';

const handleData = (response: Response) => {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.indexOf('application/json') !== -1) {
    return response.json();
  }

  return response.text();
};

export const GRAPHQL_URL = `${process.env.SERVER_BASE_URL}/graphql`;

const fetchQuery = async (request: RequestParameters, variables: Variables) => {
  try {
    const body = JSON.stringify({
      name: request.name,
      query: request.text,
      variables,
    });

    const headers = {
      Accept: 'application/json',
      Authorization: jwtToken.get(),
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    };

    const response = await fetchWithRetries(GRAPHQL_URL, {
      method: 'POST',
      headers,
      body,
      fetchTimeout: 20000,
      retryDelays: [1000, 3000, 5000],
    });

    const data = await handleData(response);

    if (response.status === 401) {
      throw data.errors;
    }

    if (isMutation(request) && data.errors) {
      throw data.errors;
    }

    if (!data.data) {
      throw data.errors;
    }

    if (data.errors) {
      throw data.errors;
    }

    return data;
  } catch (err) {
    console.error('err: ', err);

    const timeoutRegexp = /Still no successful response after/;
    const serverUnavailableRegexp = /Failed to fetch/;

    if (timeoutRegexp.test(err.message) || serverUnavailableRegexp.test(err.message)) {
      throw new Error('Serviço indisponível. Tente novamente mais tarde.');
    }

    throw err;
  }
};

export default fetchQuery;
