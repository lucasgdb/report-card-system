import styled from 'styled-components';

const OuterAvatarInitials = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #777;
  border-radius: 50%;
`;

const InitialName = styled.span`
  font: normal normal bold 1em/1em Lexend;
  text-transform: uppercase;
  color: #fafafa;
  user-select: none;
`;

const getNameInitials = (firstname: string, lastname?: string) => {
  const firstnameInitialChar = firstname.charAt(0);
  const lastnameInitialChar = lastname?.charAt(0);
  return firstnameInitialChar + lastnameInitialChar ?? '';
};

type AvatarInitialsProps = {
  firstname: string;
  lastname: string;
};

export default function AvatarInitials({ firstname, lastname }: AvatarInitialsProps) {
  return (
    <OuterAvatarInitials>
      <InitialName>{getNameInitials(firstname, lastname)}</InitialName>
    </OuterAvatarInitials>
  );
}
