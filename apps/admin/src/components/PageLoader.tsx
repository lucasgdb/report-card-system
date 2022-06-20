import CircularProgress from '@mui/material/CircularProgress';
import styled from 'styled-components';

const OuterPageLoader = styled.div`
  width: 100%;
  height: calc(100vh - 56px);

  display: flex;
  justify-content: center;
  align-items: center;

  @media (min-width: 1200px) {
    height: calc(100vh - 78px);
  }
`;

export default function PageLoader() {
  return (
    <OuterPageLoader>
      <CircularProgress />
    </OuterPageLoader>
  );
}
