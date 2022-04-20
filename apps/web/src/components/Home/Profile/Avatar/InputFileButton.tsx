import Button from '@mui/material/Button';
import type { ReactCropperElement } from 'react-cropper';
import styled from 'styled-components';

import getBase64FromFile from '~/utils/getBase64FromFile';

const UploadButton = styled((props) => <Button {...props} component="span" />)`
  && {
    border-radius: 8px;
    padding: 8px 16px;
    font: normal normal normal 16px/16px Lexend;
  }
`;

type InputFileButtonProps = {
  cropperRef: React.MutableRefObject<ReactCropperElement>;
};

export default function InputFileButton({ cropperRef }: InputFileButtonProps) {
  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { 0: avatar } = event.target.files;

    if (avatar) {
      const avatarBase64 = await getBase64FromFile(avatar);

      const imageElement = cropperRef.current;
      const cropper = imageElement.cropper;

      cropper.replace(avatarBase64);
    }
  };

  return (
    <label htmlFor="avatar">
      <input type="file" id="avatar" accept="image/*" onChange={handleChange} hidden />

      <UploadButton variant="text" color="secondary">
        Upload
      </UploadButton>
    </label>
  );
}
