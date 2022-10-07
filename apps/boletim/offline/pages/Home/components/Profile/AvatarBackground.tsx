import styled from 'styled-components';

import Avatar from './Avatar/Avatar';

const OuterAvatarBackground = styled.div`
  display: flex;
  justify-content: center;

  @media (min-width: 864px) {
    width: 320px;
    height: 100%;

    position: relative;

    display: block;
  }
`;

const HomeIconsImage = styled.img`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);

  @media (max-width: 863px) {
    display: none;
  }
`;

export default function AvatarBackground() {
  return (
    <OuterAvatarBackground>
      <HomeIconsImage src="/assets/images/home_icons.svg" />
      <Avatar />
    </OuterAvatarBackground>
  );
}
