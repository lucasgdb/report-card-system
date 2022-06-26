import styled from 'styled-components';

import Menu from '../../components/Menu/Menu';
import Profile from '../../components/Home/Profile/Profile';
import SchoolReport from '../../components/Home/SchoolReport/SchoolReport';

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
