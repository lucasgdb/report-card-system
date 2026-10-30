import { authorizedFetch } from '@usefaz/shared/browser';
import type { RequestParameters, Variables } from 'relay-runtime';

export const GRAPHQL_URL = `${process.env.SERVER_BASE_URL}/graphql`;

/**
 * Sends an operation to the server. GraphQL errors reject the request (Relay calls `onError`); expected
 * mutation failures are not errors but data, in the payload's `error` field.
 */
const fetchQuery = async (request: RequestParameters, variables: Variables) => {
  try {
    const response = await authorizedFetch(GRAPHQL_URL, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: request.name, query: request.text, variables }),
      timeout: 20_000,
    });

    const data = await response.json();
    if (data.errors) {
      throw data.errors;
    }

    return data;
  } catch (error) {
    // GraphQL errors (arrays) are expected to be handled by the caller; log anything else.
    if (!Array.isArray(error)) {
      console.error(error);
    }
    throw error;
  }
};

export default fetchQuery;
