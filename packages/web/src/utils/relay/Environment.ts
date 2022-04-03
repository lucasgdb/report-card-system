import { Environment, Network, RecordSource, Store } from 'relay-runtime';

import { cacheHandler } from './cacheHandler';

const network = Network.create(cacheHandler);
const source = new RecordSource();
const store = new Store(source);

const environment = new Environment({
  network,
  store,
});

export default environment;
