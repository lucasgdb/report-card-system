import styled from 'styled-components';

import DefaultAvatar from './DefaultAvatar';

const OuterAvatar = styled.div`
  position: relative;

  width: 150px;
  height: 150px;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 50%;
  border: 4px solid #ee7844;

  @media (min-width: 864px) {
    position: absolute;
    left: 133px;
    top: 113px;
  }
`;

export default function Avatar() {
  return (
    <OuterAvatar>
      <DefaultAvatar />
    </OuterAvatar>
  );
}
