import styled from 'styled-components';
import IconButton from '@mui/material/IconButton';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import { useState } from 'react';

import UploadAvatarModal from './UploadAvatarModal';

const UploadButton = styled((props) => <IconButton {...props} component="span" type="submit" />)`
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
  avatarURL: string | null;
  setNewAvatarURL: React.Dispatch<React.SetStateAction<string>>;
};

export default function OpenUploadAvatarModalButton({ avatarURL, setNewAvatarURL }: OpenUploadAvatarModalButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);

  return (
    <>
      <UploadButton color="primary" onClick={handleOpenModal}>
        <StyledCameraAltOutlinedIcon />
      </UploadButton>

      <UploadAvatarModal
        open={isOpen}
        onClose={handleCloseModal}
        avatarURL={avatarURL}
        setNewAvatarURL={setNewAvatarURL}
      />
    </>
  );
}
