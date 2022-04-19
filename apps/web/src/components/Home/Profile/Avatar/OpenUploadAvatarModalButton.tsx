import { graphql, useFragment } from 'relay-hooks';
import styled from 'styled-components';
import IconButton from '@mui/material/IconButton';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import { useState } from 'react';

import { OpenUploadAvatarModalButton_student$key } from './__generated__/OpenUploadAvatarModalButton_student.graphql';
import UploadAvatarModal from './UploadAvatarModal';

const fragment = graphql`
  fragment OpenUploadAvatarModalButton_student on Student {
    ...UploadAvatarModal_student
  }
`;

const UploadButton = styled(IconButton)`
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

type OpenUploadAvatarModalButtonProps = {
  student: OpenUploadAvatarModalButton_student$key;
};

export default function OpenUploadAvatarModalButton({ student }: OpenUploadAvatarModalButtonProps) {
  const data = useFragment<OpenUploadAvatarModalButton_student$key>(fragment, student);

  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => setIsOpen(true);

  const handleCloseModal = () => setIsOpen(false);

  return (
    <>
      <UploadButton color="primary" onClick={handleOpenModal}>
        <StyledCameraAltOutlinedIcon />
      </UploadButton>

      <UploadAvatarModal open={isOpen} onClose={handleCloseModal} student={data} />
    </>
  );
}
