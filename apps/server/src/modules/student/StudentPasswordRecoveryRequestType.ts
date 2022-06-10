import { GraphQLNonNull, GraphQLString } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';

import usefazConnector from '~/database/usefazConnector';
import { StudentModel } from '~/entities';
import type { IStudentPasswordRecoveryRequest } from '~/interfaces';
import { registerGraphQLNodeObjectType } from '../node/NodeType';
import StudentPasswordRecoveryRequestStatusEnum from './enums/StudentPasswordRecoveryRequestStatusEnum';
import StudentType from './StudentType';

const StudentPasswordRecoveryRequestType = registerGraphQLNodeObjectType<IStudentPasswordRecoveryRequest>(
  'student_password_recovery_request'
)({
  name: 'StudentPasswordRecoveryRequest',
  fields() {
    return {
      RM: {
        type: new GraphQLNonNull(GraphQLString),
      },
      email: {
        type: new GraphQLNonNull(GraphQLString),
      },
      status: {
        type: new GraphQLNonNull(StudentPasswordRecoveryRequestStatusEnum),
      },
      student: {
        type: new GraphQLNonNull(StudentType),
        async resolve(studentPasswordRecoveryRequest) {
          const studentEntity = StudentModel(usefazConnector);
          const student = await studentEntity.getStudentByRM(studentPasswordRecoveryRequest.RM);
          return student;
        },
      },
    };
  },
});

export const StudentPasswordRecoveryRequestConnection = connectionDefinitions({
  name: 'StudentPasswordRecoveryRequest',
  nodeType: StudentPasswordRecoveryRequestType,
});

export default StudentPasswordRecoveryRequestType;
