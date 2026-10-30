import ReportCardSection, { ReportCardEmpty } from '~/components/ReportCardSection';

import getSchoolReport, { getSavedStudent } from '../../../../utils/getSchoolReport';
import SchoolReportTable from './SchoolReportTable/SchoolReportTable';

const savedAtFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' });

export default function SchoolReport() {
  const schoolReport = getSchoolReport();
  const student = getSavedStudent();

  if (schoolReport.length === 0) {
    return (
      <ReportCardEmpty
        title="Nenhum boletim salvo neste dispositivo"
        description="Conecte-se à internet e abra o boletim para salvá-lo neste dispositivo."
      />
    );
  }

  const savedAt = student?.savedAt ? new Date(student.savedAt) : null;

  return (
    <ReportCardSection
      description={
        savedAt ? (
          <>
            Cópia salva em <time dateTime={student.savedAt}>{savedAtFormatter.format(savedAt)}</time>. Conecte-se para
            ver a versão mais recente.
          </>
        ) : (
          'Cópia salva neste dispositivo. Conecte-se para ver a versão mais recente.'
        )
      }
    >
      <SchoolReportTable year={student?.year} />
    </ReportCardSection>
  );
}
