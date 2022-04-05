import styled from 'styled-components';
import { Outlet } from 'react-router-dom';

const OuterEnvironmentLayout = styled.div``;

export default function EnvironmentLayout() {
  return (
    <OuterEnvironmentLayout>
      <Outlet />
    </OuterEnvironmentLayout>
  );
}
