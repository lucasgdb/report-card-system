import 'cropperjs/dist/cropper.css';

import { forwardRef } from 'react';
import { Cropper, ReactCropperElement } from 'react-cropper';
import styled from 'styled-components';

const StyledCropper = styled(Cropper)`
  && {
    height: 400px;
    width: 100%;
  }
`;

type AvatarEditorProps = {
  avatarURL: string | null;
};

const AvatarEditor = forwardRef<HTMLImageElement | ReactCropperElement, AvatarEditorProps>(({ avatarURL }, ref) => {
  return <StyledCropper src={avatarURL} guides={false} ref={ref} />;
});

export default AvatarEditor;
