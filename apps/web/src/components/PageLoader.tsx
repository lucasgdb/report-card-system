import CircularProgress from '@mui/material/CircularProgress';
import styled from 'styled-components';

const OuterPageLoader = styled.div`
  width: 100%;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function PageLoader() {
  return (
    <OuterPageLoader>
      <CircularProgress />
    </OuterPageLoader>
  );
}
