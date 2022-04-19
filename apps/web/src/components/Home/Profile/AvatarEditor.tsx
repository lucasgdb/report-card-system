import 'cropperjs/dist/cropper.css';

import { forwardRef } from 'react';
import { Cropper, ReactCropperElement } from 'react-cropper';
import styled from 'styled-components';

const StyledCropper = styled(Cropper)`
  && {
    height: 400px;
    width: 100%;
  }

  & .cropper-view-box {
    box-shadow: 0 0 0 1px #39f;
    border-radius: 50%;
    outline: 0;
  }

  & .cropper-face {
    background-color: inherit !important;
  }

  & .cropper-view-box {
    outline: inherit !important;
  }
`;

type AvatarEditorProps = {
  avatarURL: string | null;
};

const AvatarEditor = forwardRef<HTMLImageElement | ReactCropperElement, AvatarEditorProps>(({ avatarURL }, ref) => {
  return <StyledCropper src={avatarURL} guides={false} ref={ref} />;
});

export default AvatarEditor;
