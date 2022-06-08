import { GraphQLEnumType } from 'graphql/type';

const StudentPasswordRecoveryRequestStatusEnum = new GraphQLEnumType({
  name: 'StudentPasswordRecoveryRequestStatusEnum',
  values: {
    PENDING: {
      value: 'PENDING',
    },
    REFUSED: {
      value: 'REFUSED',
    },
    CHANGED: {
      value: 'CHANGED',
    },
  },
});

export default StudentPasswordRecoveryRequestStatusEnum;
