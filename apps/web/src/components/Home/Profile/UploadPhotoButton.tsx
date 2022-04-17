import styled from 'styled-components';
import IconButton from '@mui/material/IconButton';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';

const UploadButton = styled((props) => <IconButton {...props} component="span" />)`
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

export default function UploadPhotoButton() {
  return (
    <label htmlFor="upload-button">
      <input accept="image/*" id="upload-button" type="file" hidden />

      <UploadButton color="primary">
        <StyledCameraAltOutlinedIcon />
      </UploadButton>
    </label>
  );
}
