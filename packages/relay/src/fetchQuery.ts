import { authorizedFetch } from '@usefaz/shared/browser';
import type { RequestParameters, Variables } from 'relay-runtime';

export const GRAPHQL_URL = `${process.env.SERVER_BASE_URL}/graphql`;

/**
 * Sends an operation to the server. Operations are persisted: relay-compiler gives each one an id
 * (SHA-256 of its text) and registers it with the server, so only the id travels.
 *
 * GraphQL errors reject the request (Relay calls `onError`); expected mutation failures are not errors
 * but data, in the payload's `error` field.
 */
const fetchQuery = async (request: RequestParameters, variables: Variables) => {
  const body = request.id
    ? { operationName: request.name, variables, extensions: { persistedQuery: { version: 1, sha256Hash: request.id } } }
    : { operationName: request.name, variables, query: request.text };

  try {
    const response = await authorizedFetch(GRAPHQL_URL, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
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
