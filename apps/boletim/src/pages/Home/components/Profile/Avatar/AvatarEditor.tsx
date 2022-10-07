import 'cropperjs/dist/cropper.css';

import { forwardRef } from 'react';
import { Cropper, ReactCropperElement } from 'react-cropper';
import styled from 'styled-components';

const StyledCropper = styled(Cropper)`
  && {
    width: 100%;
    min-height: 350px;
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
  src: string;
  onReady(): void;
};

const AvatarEditor = forwardRef<HTMLImageElement | ReactCropperElement, AvatarEditorProps>(({ src, onReady }, ref) => {
  return <StyledCropper src={src} ready={onReady} guides={false} ref={ref} />;
});

export default AvatarEditor;
