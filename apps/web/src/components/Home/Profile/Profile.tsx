import styled from 'styled-components';
import { graphql, useFragment } from 'relay-hooks';

import { Profile_student$key } from './__generated__/Profile_student.graphql';
import UploadPhotoButton from './UploadPhotoButton';
import Information from './Information';

const fragment = graphql`
  fragment Profile_student on Student {
    ...Information_student
  }
`;

const OuterProfile = styled.div`
  width: 100%;
  height: 375px;

  background: linear-gradient(92.84deg, #011461 -8.18%, #0020a2 47.5%, #00d4ff 106.78%);

  display: flex;
  align-items: center;
  gap: 8px;

  padding-left: 48px;

  position: relative;
`;

const ZLogoImage = styled.img`
  position: absolute;
  top: 0;
  right: 0;

  width: 35%;
`;

const OuterStudentImage = styled.div`
  width: 320px;
  height: 100%;

  position: relative;
`;

const HomeIconsImage = styled.img`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
`;

const ImageCircle = styled.div`
  position: absolute;
  left: 133px;
  top: 113px;

  width: 150px;
  height: 150px;

  border-radius: 50%;
  border: 2px solid #ee7844;
`;

const StudentImage = () => {
  return (
    <OuterStudentImage>
      <HomeIconsImage src="/assets/images/home_icons.svg" />

      <ImageCircle>
        <UploadPhotoButton />
      </ImageCircle>
    </OuterStudentImage>
  );
};

type ProfileProps = {
  student: Profile_student$key;
};

export default function Profile({ student }: ProfileProps) {
  const data = useFragment<Profile_student$key>(fragment, student);

  return (
    <OuterProfile>
      <StudentImage />

      <Information student={data} />

      <ZLogoImage src="/assets/images/z_logo.svg" />
    </OuterProfile>
  );
}
