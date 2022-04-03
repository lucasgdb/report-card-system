import styled from 'styled-components';

const OuterMenu = styled.div`
  background-color: #222;

  width: 100%;
  height: 56px;

  position: sticky;
  top: 0;
  left: 0;

  z-index: 2;

  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.125), 0px -1px 2px rgba(0, 0, 0, 0.1);
  padding: 16px 32px;
  box-sizing: border-box;

  @media (min-width: 768px) {
    padding: 16px 112px;
  }

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoText = styled.p`
  margin: 0;
  font: normal normal normal 16px/19px Roboto;
  color: #fff;
`;

const SocialMediaWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Hyperlink = styled.a`
  text-decoration: none;
  line-height: 0;
`;

const SocialMediaIcon = styled.img`
  width: 20px;
  height: 20px;
`;

const socialMedias = [
  {
    id: '0',
    url: '#',
    Icon: <SocialMediaIcon src="/assets/icons/facebook.svg" />,
  },
  {
    id: '1',
    url: '#',
    Icon: <SocialMediaIcon src="/assets/icons/instagram.svg" />,
  },
  {
    id: '2',
    url: '#',
    Icon: <SocialMediaIcon src="/assets/icons/whatsapp.svg" />,
  },
  {
    id: '3',
    url: '#',
    Icon: <SocialMediaIcon src="/assets/icons/linkedin.svg" />,
  },
];

export default function Menu() {
  return (
    <OuterMenu>
      <Hyperlink href="/">
        <LogoText>Example</LogoText>
      </Hyperlink>

      <SocialMediaWrapper>
        {socialMedias.map((socialMedia) => (
          <Hyperlink key={socialMedia.id} href={socialMedia.url} target="_blank">
            {socialMedia.Icon}
          </Hyperlink>
        ))}
      </SocialMediaWrapper>
    </OuterMenu>
  );
}
