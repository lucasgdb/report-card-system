import { GraphQLNonNull } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';

import type { IStudentPasswordRecoveryRequest } from '~/interfaces';
import { registerGraphQLNodeObjectType } from '../node/NodeType';
import StudentPasswordRecoveryRequestStatusEnum from './enums/StudentPasswordRecoveryRequestStatusEnum';

const StudentPasswordRecoveryRequestType = registerGraphQLNodeObjectType<IStudentPasswordRecoveryRequest>(
  'student_password_recovery_request'
)({
  name: 'StudentPasswordRecoveryRequest',
  fields() {
    return {
      status: {
        type: new GraphQLNonNull(StudentPasswordRecoveryRequestStatusEnum),
      },
    };
  },
});

export const StudentPasswordRecoveryRequestConnection = connectionDefinitions({
  name: 'StudentPasswordRecoveryRequest',
  nodeType: StudentPasswordRecoveryRequestType,
});

export default StudentPasswordRecoveryRequestType;
