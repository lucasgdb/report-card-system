import 'cropperjs/dist/cropper.css';

import { graphql, useFragment } from 'relay-hooks';
import { forwardRef } from 'react';
import { Cropper, ReactCropperElement } from 'react-cropper';
import styled from 'styled-components';

import { AvatarEditor_student$key } from './__generated__/AvatarEditor_student.graphql';

const fragment = graphql`
  fragment AvatarEditor_student on Student {
    avatarURL
  }
`;

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
  student: AvatarEditor_student$key;
};

const AvatarEditor = forwardRef<HTMLImageElement | ReactCropperElement, AvatarEditorProps>(({ student }, ref) => {
  const data = useFragment<AvatarEditor_student$key>(fragment, student);

  return <StyledCropper src={data.avatarURL} guides={false} ref={ref} />;
});

export default AvatarEditor;
