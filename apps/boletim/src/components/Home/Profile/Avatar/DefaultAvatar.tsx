import styled from 'styled-components';
import { graphql, useFragment } from 'relay-hooks';

import { DefaultAvatar_student$key } from './__generated__/DefaultAvatar_student.graphql';

const fragment = graphql`
  fragment DefaultAvatar_student on Student {
    firstname
    lastname
  }
`;

const OuterDefaultAvatar = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #777;
  border-radius: 50%;
`;

const InitialName = styled.span`
  font: normal normal bold 56px/64px Lexend;
  text-transform: uppercase;
  color: #fafafa;
  user-select: none;
`;

const getNameInitials = (firstname: string, lastname?: string) => {
  const firstnameInitialChar = firstname.charAt(0);
  const lastnameInitialChar = lastname?.charAt(0);
  return firstnameInitialChar + lastnameInitialChar;
};

type DefaultAvatarProps = {
  student: DefaultAvatar_student$key;
};

export default function DefaultAvatar({ student }: DefaultAvatarProps) {
  const data = useFragment<DefaultAvatar_student$key>(fragment, student);

  return (
    <OuterDefaultAvatar>
      <InitialName>{getNameInitials(data.firstname, data.lastname)}</InitialName>
    </OuterDefaultAvatar>
  );
}