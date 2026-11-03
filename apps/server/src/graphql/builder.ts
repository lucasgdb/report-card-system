import SchemaBuilder from '@pothos/core';
import DataloaderPlugin from '@pothos/plugin-dataloader';
import RelayPlugin from '@pothos/plugin-relay';

import type { GraphQLContext } from '#/graphql/context.ts';
import { unauthenticated } from '#/graphql/errors.ts';

const builder = new SchemaBuilder<{
  Context: GraphQLContext;
  DefaultFieldNullability: false;
  DefaultInputFieldRequiredness: true;
}>({
  plugins: [RelayPlugin, DataloaderPlugin],
  defaultFieldNullability: false,
  defaultInputFieldRequiredness: true,
  relay: {
    clientMutationId: 'optional',
    cursorType: 'String',
    nodeQueryOptions: { nullable: true },
    nodesQueryOptions: { nullable: { list: false, items: true } },
  },
});

builder.queryType({});
builder.mutationType({});

/** The signed-in admin, or an UNAUTHENTICATED error. */
export const requireAdmin = (ctx: GraphQLContext) => {
  if (!ctx.viewer?.admin) {
    throw unauthenticated();
  }
  return ctx.viewer.admin;
};

/** The signed-in student, or an UNAUTHENTICATED error. */
export const requireStudent = (ctx: GraphQLContext) => {
  if (!ctx.viewer?.student) {
    throw unauthenticated();
  }
  return ctx.viewer.student;
};

/** Returns rows in the order of `ids`, with null for missing ones (what Relay node lookups expect). */
export const orderByIds = <Row extends { id: number }>(ids: readonly (string | number)[], rows: Row[]) => {
  const byId = new Map(rows.map((row) => [String(row.id), row]));
  return ids.map((id) => byId.get(String(id)) ?? null);
};

/** Node IDs come from clients: anything that isn't a positive integer can't match a row. */
export const toRowIds = (ids: readonly string[]) => ids.map(Number).filter((id) => Number.isInteger(id) && id > 0);

export default builder;
