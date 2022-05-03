import { ConnectionHandler, DataID, RecordProxy, RecordSourceSelectorProxy } from 'relay-runtime';

type ConnectionUpdater = {
  store: RecordSourceSelectorProxy;
  parentId: DataID;
  connectionName: string;
  cursor?: DataID;
  edge: RecordProxy;
  before?: boolean;
  connectionArgs?: Record<any, unknown>;
};

type ConnectionUpdaterValue = Omit<ConnectionUpdater, 'cursor' | 'before' | 'edge'> & {
  fieldName: string;
  increment: number;
};

export function connectionUpdater({
  store,
  parentId,
  connectionName,
  edge,
  cursor = '',
  before = false,
  connectionArgs = {},
}: ConnectionUpdater) {
  if (edge) {
    if (!parentId) {
      console.warn('maybe you forgot to pass a parentId: ');
      return;
    }

    const parentProxy = store.get(parentId);

    const conn = ConnectionHandler.getConnection(parentProxy as RecordProxy, connectionName, connectionArgs);

    if (!conn) {
      console.warn('maybe this connection is not in relay store: ', connectionName);

      return;
    }

    if (before) {
      ConnectionHandler.insertEdgeBefore(conn, edge, cursor);
    } else {
      ConnectionHandler.insertEdgeAfter(conn, edge, cursor);
    }
  }
}

export function connectionUpdaterValue({
  store,
  parentId,
  connectionName,
  increment,
  fieldName,
  connectionArgs = {},
}: ConnectionUpdaterValue) {
  if (!parentId) {
    console.warn('maybe you forgot to pass a parentId: ');
    return;
  }

  const parentProxy = store.get(parentId);

  const conn = ConnectionHandler.getConnection(parentProxy as RecordProxy, connectionName, connectionArgs);

  if (!conn) {
    console.warn('maybe this connection is not in relay store: ', connectionName);
    return;
  }

  const fieldValue = conn.getValue(fieldName)! as number;
  conn.setValue(fieldValue + increment, fieldName);
}

type ConnectionDeleteEdgeUpdaterOptions = {
  parentId: string;
  connectionName: string;
  nodeId: string;
  store: RecordSourceSelectorProxy;
  connectionArgs?: Record<any, unknown>;
};

export function connectionDeleteEdgeUpdater({
  parentId,
  connectionName,
  nodeId,
  store,
  connectionArgs = {},
}: ConnectionDeleteEdgeUpdaterOptions) {
  const parentProxy = store.get(parentId);
  const conn = ConnectionHandler.getConnection(parentProxy as RecordProxy, connectionName, connectionArgs);

  if (!conn) {
    console.warn(`Connection ${connectionName} not found on ${parentId}`);
    return;
  }

  ConnectionHandler.deleteNode(conn, nodeId);
}
