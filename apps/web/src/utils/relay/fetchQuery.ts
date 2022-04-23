import type { RequestParameters, Variables } from 'relay-runtime';

import fetchWithRetries from '~/utils/fetchWithRetries';
import { isMutation } from './helpers';

export const GRAPHQL_URL = `${process.env.SERVER_BASE_URL}/graphql`;

const fetchQuery = async (request: RequestParameters, variables: Variables) => {
  try {
    const response = await fetchWithRetries(
      {
        url: GRAPHQL_URL,
        data: JSON.stringify({
          name: request.name,
          query: request.text,
          variables,
        }),
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
      {
        fetchTimeout: 20000,
      }
    );

    const data = response?.data;

    if (response?.status === 401 || (isMutation(request) && data?.errors) || !data || data?.errors) {
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
