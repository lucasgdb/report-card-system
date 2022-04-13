import styled from 'styled-components';
import { graphql, useFragment } from 'relay-hooks';
import IconButton from '@mui/material/IconButton';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';

import { Profile_student$key } from './__generated__/Profile_student.graphql';

const fragment = graphql`
  fragment Profile_student on Student {
    RM
    fullname
  }
`;

const OuterProfile = styled.div`
  width: 100%;
  height: 375px;

  background: linear-gradient(92.84deg, #011461 -8.18%, #0020a2 47.5%, #00d4ff 106.78%);
  border-radius: 0 0 36px 36px;

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

const CameraCircle = styled(IconButton)`
  && {
    position: absolute;
    bottom: 0;
    right: 0;

    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: #ee7844;

    :hover {
      background-color: #ee7844;
    }
  }
`;

const StyledCameraAltOutlinedIcon = styled(CameraAltOutlinedIcon)`
  && {
    color: #fff;
  }
`;

const StudentImage = () => {
  return (
    <OuterStudentImage>
      <HomeIconsImage src="/assets/images/home_icons.svg" />

      <ImageCircle>
        <CameraCircle color="primary">
          <StyledCameraAltOutlinedIcon />
        </CameraCircle>
      </ImageCircle>
    </OuterStudentImage>
  );
};

const OuterProfileInformation = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
`;

const RMText = styled.p`
  font: normal normal 700 32px/40px Lexend;
  color: #fafafa;

  margin: 0;
`;

const FullnameText = styled.p`
  font: normal normal 700 32px/40px Lexend;
  color: #fafafa;

  text-transform: uppercase;
  margin: 0;
`;

const Status = styled.div`
  padding: 11px 0;
  width: 250px;

  background-color: #22e675;
  border-radius: 4px;
`;

const StatusText = styled.p`
  font: normal normal 700 24px/30px Lexend;
  color: #fafafa;
  margin: 0;
  text-align: center;

  text-transform: uppercase;
`;

const ProfileInformation = ({ student }: ProfileProps) => {
  const data = useFragment<Profile_student$key>(fragment, student);

  return (
    <OuterProfileInformation>
      <RMText>RM: {data.RM}</RMText>
      <FullnameText>NOME: {data.fullname}</FullnameText>
      <Status>
        <StatusText>APROVADO</StatusText>
      </Status>
    </OuterProfileInformation>
  );
};

type ProfileProps = {
  student: Profile_student$key;
};

export default function Profile({ student }: ProfileProps) {
  return (
    <OuterProfile>
      <StudentImage />

      <ProfileInformation student={student} />

      <ZLogoImage src="/assets/images/z_logo.svg" />
    </OuterProfile>
  );
}
