import styled from 'styled-components';

import Menu from '../../components/Menu/Menu';
import Profile from '../../components/Home/Profile/Profile';
import Boletim from '../../components/Home/Boletim/Boletim';

const OuterHomePage = styled.div``;

export default function HomePage() {
  return (
    <OuterHomePage>
      <Menu />
      <Profile />
      <Boletim />
    </OuterHomePage>
  );
}
