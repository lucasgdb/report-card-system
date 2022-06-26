import { GraphQLInt, GraphQLNonNull } from 'graphql';
import { connectionArgs, connectionFromArray } from 'graphql-relay';

import usefazConnector from '~/database/usefazConnector';
import type { ISchoolReport } from '~/interfaces';
import { registerGraphQLNodeObjectType } from '../node/NodeType';
import { SchoolReportRowTypeConnection } from './SchoolReportRowType';
import { SchoolReportModel } from '~/entities';

const SchoolReportType = registerGraphQLNodeObjectType<ISchoolReport>('school_report')({
  name: 'SchoolReport',
  fields() {
    return {
      year: {
        type: new GraphQLNonNull(GraphQLInt),
      },
      schoolReportRows: {
        type: SchoolReportRowTypeConnection.connectionType,
        args: { ...connectionArgs },
        async resolve(boletim, args) {
          const schoolReportEntity = SchoolReportModel(usefazConnector);
          const schoolReports = await schoolReportEntity.getSchoolReportsById(boletim.id);
          const schoolReportsConnection = connectionFromArray(schoolReports, args);
          return { ...schoolReportsConnection, count: schoolReportsConnection.edges.length };
        },
      },
    };
  },
});

export default SchoolReportType;
