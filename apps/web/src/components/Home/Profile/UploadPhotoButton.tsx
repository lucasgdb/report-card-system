import styled from 'styled-components';
import IconButton from '@mui/material/IconButton';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';

import fetchWithRetries from '~/utils/relay/fetchWithRetries';

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

type UploadPhotoButtonProps = {
  setNewAvatarURL: React.Dispatch<React.SetStateAction<string>>;
};

export default function UploadPhotoButton({ setNewAvatarURL }: UploadPhotoButtonProps) {
  const handleSubmit = async (event: React.FormEvent<HTMLInputElement>) => {
    const { 0: avatar } = event.currentTarget.files;

    if (avatar) {
      const formData = new FormData();

      formData.append('avatar', avatar);

      const response = await fetchWithRetries({
        method: 'POST',
        url: `${process.env.SERVER_BASE_URL}/avatar/upload`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data?.avatarURL) {
        setNewAvatarURL(response.data.avatarURL);
      }
    }
  };

  return (
    <label htmlFor="avatar">
      <input accept="image/*" id="avatar" name="avatar" type="file" onChange={handleSubmit} hidden />

      <UploadButton color="primary">
        <StyledCameraAltOutlinedIcon />
      </UploadButton>
    </label>
  );
}
