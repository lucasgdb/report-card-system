import styled from 'styled-components';
import Welcome from '~/components/Welcome';

const OuterHomePage = styled.div``;

export default function HomePage() {
  return (
    <OuterHomePage>
      <Welcome />
    </OuterHomePage>
  );
}
