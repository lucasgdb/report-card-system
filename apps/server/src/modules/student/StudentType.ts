import { GraphQLNonNull, GraphQLString } from 'graphql';
import { connectionDefinitions } from 'graphql-relay';
import usefazConnector from '~/database/usefazConnector';
import { SchoolReportModel } from '~/entities';

import type { IContext, IStudent } from '~/interfaces';
import { registerGraphQLNodeObjectType } from '../node/NodeType';
import SchoolReportType from '../schoolReport/SchoolReportType';

const StudentType = registerGraphQLNodeObjectType<IStudent>('student')({
  name: 'Student',
  fields() {
    return {
      RM: {
        type: new GraphQLNonNull(GraphQLString),
      },
      firstname: {
        type: new GraphQLNonNull(GraphQLString),
        resolve: (student) => student.fullname.split(' ')[0],
      },
      lastname: {
        type: GraphQLString,
        description: "student's lastname (must not be equals firstname)",
        resolve: (student) => {
          const splittedStudentName = student.fullname.split(' ');
          if (splittedStudentName.length === 1) {
            return null;
          }

          return splittedStudentName[splittedStudentName.length - 1];
        },
      },
      fullname: {
        type: new GraphQLNonNull(GraphQLString),
      },
      avatarURL: {
        type: GraphQLString,
        resolve: (student) => student.avatar_url,
      },
      schoolReport: {
        type: SchoolReportType,
        resolve(student) {
          const schoolReportEntity = SchoolReportModel(usefazConnector);
          return schoolReportEntity.getOneByStudentId(student.id);
        },
      },
    };
  },
});

export const StudentConnection = connectionDefinitions({
  name: 'Student',
  nodeType: StudentType,
});

export const studentField = {
  type: StudentType,
  resolve(_root: IStudent | undefined, _args: unknown, context: IContext) {
    return context.student;
  },
};

export default StudentType;
