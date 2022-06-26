import { SchoolReportTable_schoolReport$data } from '~/components/Home/SchoolReport/SchoolReportTable/__generated__/SchoolReportTable_schoolReport.graphql';

export default function saveSchoolReport(schoolReportData: SchoolReportTable_schoolReport$data) {
  const schoolReport = schoolReportData.schoolReportRows.edges.map(({ node: schoolReportRow }) => {
    const {
      disciplineName,
      firstBimesterGrade,
      secondBimesterGrade,
      thirdBimesterGrade,
      fourthBimesterGrade,
      firstBimesterAbsences,
      secondBimesterAbsences,
      thirdBimesterAbsences,
      fourthBimesterAbsences,
    } = schoolReportRow;

    const finalAverage: number =
      (firstBimesterGrade + secondBimesterGrade + thirdBimesterGrade + fourthBimesterGrade) / 4;

    const totalAbsences: number =
      firstBimesterAbsences + secondBimesterAbsences + thirdBimesterAbsences + fourthBimesterAbsences;

    return {
      disciplineName,
      firstBimesterGrade,
      firstBimesterAbsences,
      secondBimesterGrade,
      secondBimesterAbsences,
      thirdBimesterGrade,
      thirdBimesterAbsences,
      fourthBimesterGrade,
      fourthBimesterAbsences,
      finalAverage,
      totalAbsences,
    };
  });

  localStorage.setItem('school_report', JSON.stringify(schoolReport));
}
