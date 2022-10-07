import styled from 'styled-components';

import Menu from './components/Menu/Menu';
import Profile from './components/Profile/Profile';
import SchoolReport from './components/SchoolReport/SchoolReport';

const OuterHomePage = styled.div``;

export default function HomePage() {
  return (
    <OuterHomePage>
      <Menu />
      <Profile />
      <SchoolReport />
    </OuterHomePage>
  );
}
