import SkipLink from '~/components/SkipLink';

import { getSavedStudent } from '../../utils/getSchoolReport';
import Menu from './components/Menu/Menu';
import Profile from './components/Profile/Profile';
import SchoolReport from './components/SchoolReport/SchoolReport';

export default function HomePage() {
  const student = getSavedStudent();

  return (
    <>
      <SkipLink targetId="conteudo">Pular para o boletim</SkipLink>
      <Menu />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <h1 className="sr-only">{student ? `Boletim de ${student.fullname} (offline)` : 'Boletim (offline)'}</h1>
        <Profile />
        <SchoolReport />
      </main>
    </>
  );
}
