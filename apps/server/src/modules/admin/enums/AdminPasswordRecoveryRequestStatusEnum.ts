import { GraphQLEnumType } from 'graphql/type';

const AdminPasswordRecoveryRequestStatusEnum = new GraphQLEnumType({
  name: 'AdminPasswordRecoveryRequestStatusEnum',
  values: {
    PENDING: {
      value: 'PENDING',
    },
    CHANGED: {
      value: 'CHANGED',
    },
  },
});

export default AdminPasswordRecoveryRequestStatusEnum;
