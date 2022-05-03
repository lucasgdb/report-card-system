import { CacheConfig, RequestParameters } from 'relay-runtime';

export const isMutation = (request: RequestParameters) => request.operationKind === 'mutation';

export const isQuery = (request: RequestParameters) => request.operationKind === 'query';

export const forceFetch = (cacheConfig: CacheConfig) => Boolean(cacheConfig?.force);

export const offsetToCursor = (str: string) => Buffer.from(str).toString('base64');
