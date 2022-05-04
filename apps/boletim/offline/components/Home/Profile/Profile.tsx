import styled from 'styled-components';

import Information from './Information';
import AvatarBackground from './AvatarBackground';

const OuterProfile = styled.div`
  width: 100%;

  background: linear-gradient(92.84deg, #011461 -8.18%, #0020a2 47.5%, #00d4ff 106.78%);

  display: flex;
  flex-direction: column;
  gap: 8px;

  position: relative;

  padding: 24px 0;

  @media (min-width: 864px) {
    height: 375px;

    padding: 0 0 0 48px;

    flex-direction: row;
    align-items: center;
  }
`;

const ZLogoImage = styled.img`
  position: absolute;
  top: 0;
  right: 0;

  width: 35%;

  @media (max-width: 863px) {
    display: none;
  }
`;

export default function Profile() {
  return (
    <OuterProfile>
      <AvatarBackground />
      <Information />
      <ZLogoImage src="/assets/images/z_logo.svg" />
    </OuterProfile>
  );
}
