import ReportCardTable from '~/components/ReportCardTable';
import { toReportCardRows } from '~/utils/reportCard';
import getSchoolReport from '../../../../../utils/getSchoolReport';

export default function SchoolReportTable({ year }: { year?: number | null }) {
  return <ReportCardTable rows={toReportCardRows(getSchoolReport())} year={year} />;
}
