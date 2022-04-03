import { QueryResponseCache } from 'relay-runtime';
import type { FetchFunction } from 'relay-runtime';

import fetchQuery from './fetchQuery';
import { forceFetch, isMutation, isQuery } from './helpers';

const oneMinute = 60 * 1000;
export const relayResponseCache = new QueryResponseCache({
  size: 250,
  ttl: oneMinute,
});

export const cacheHandler: FetchFunction = async (request, variables, cacheConfig) => {
  const queryID = request.text ?? '';

  // clear cache if request is a mutation
  if (isMutation(request)) {
    relayResponseCache.clear();
    return fetchQuery(request, variables);
  }

  // request is a query and it have content on cache so return the cache
  const fromCache = relayResponseCache.get(queryID, variables);
  if (isQuery(request) && fromCache !== null && !forceFetch(cacheConfig)) {
    return fromCache;
  }

  // return response from the server and set it on cache
  const fromServer = await fetchQuery(request, variables);
  if (fromServer) {
    relayResponseCache.set(queryID, variables, fromServer);
  }

  return fromServer;
};
