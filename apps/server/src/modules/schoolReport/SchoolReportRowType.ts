import { GraphQLFloat, GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { connectionDefinitions, toGlobalId } from 'graphql-relay';
import type { SchoolReportRow } from '~/entities/SchoolReport/SchoolReportModel';

const SchoolReportRowType = new GraphQLObjectType<SchoolReportRow>({
  name: 'SchoolReportRowType',
  fields() {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLID),
        resolve(schoolReportRow) {
          return toGlobalId('discipline', schoolReportRow.discipline_id!);
        },
      },
      disciplineName: {
        type: new GraphQLNonNull(GraphQLString),
      },
      firstBimesterGrade: {
        type: new GraphQLNonNull(GraphQLFloat),
      },
      firstBimesterRecGrade: {
        type: GraphQLFloat,
      },
      firstBimesterAbsences: {
        type: new GraphQLNonNull(GraphQLInt),
      },
      secondBimesterGrade: {
        type: new GraphQLNonNull(GraphQLFloat),
      },
      secondBimesterRecGrade: {
        type: GraphQLFloat,
      },
      secondBimesterAbsences: {
        type: new GraphQLNonNull(GraphQLInt),
      },
      thirdBimesterGrade: {
        type: new GraphQLNonNull(GraphQLFloat),
      },
      thirdBimesterRecGrade: {
        type: GraphQLFloat,
      },
      thirdBimesterAbsences: {
        type: new GraphQLNonNull(GraphQLInt),
      },
      fourthBimesterGrade: {
        type: new GraphQLNonNull(GraphQLFloat),
      },
      fourthBimesterRecGrade: {
        type: GraphQLFloat,
      },
      fourthBimesterAbsences: {
        type: new GraphQLNonNull(GraphQLInt),
      },
    };
  },
});

export const SchoolReportRowTypeConnection = connectionDefinitions({
  name: 'SchoolReportRow',
  nodeType: SchoolReportRowType,
  connectionFields: {
    count: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
});

export default SchoolReportRowType;
