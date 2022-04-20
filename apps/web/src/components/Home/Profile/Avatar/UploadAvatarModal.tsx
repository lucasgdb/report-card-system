import { graphql, useFragment } from 'relay-hooks';
import Dialog from '@mui/material/Dialog';
import styled from 'styled-components';
import { useRef, useState } from 'react';
import { ReactCropperElement } from 'react-cropper';
import Grow from '@mui/material/Grow';

import {
  UploadAvatarModal_student$data,
  UploadAvatarModal_student$key,
} from './__generated__/UploadAvatarModal_student.graphql';
import AvatarEditor from './AvatarEditor';
import InputFileButton from './InputFileButton';
import CloseButton from './CloseButton';
import RemoveAvatarButton from './RemoveAvatarButton';
import DefaultAvatar from './DefaultAvatar';
import UploadAvatarButton from './UploadAvatarButton';
import { CircularProgress } from '@mui/material';

const fragment = graphql`
  fragment UploadAvatarModal_student on Student {
    avatarURL

    ...AvatarEditor_student
    ...DefaultAvatar_student
    ...UploadAvatarButton_student
  }
`;

const StyledDialog = styled(Dialog)`
  && {
    padding: 0 16px;
  }

  & .MuiDialog-paper {
    width: 100%;
    max-width: 600px;
    margin: 0;
    box-sizing: border-box;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.125), 0px -1px 4px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }
`;

const Header = styled.div`
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.span`
  font: normal normal normal 24px/28px Lexend;
  color: #333;
`;

const DialogContent = styled.div`
  padding: 24px 32px;

  display: flex;
  justify-content: center;
  gap: 16px;
`;

const DialogActions = styled.div`
  background-color: #f5f5fb;
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
`;

const OuterDefaultBehavior = styled.div`
  width: 240px;
  height: 240px;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  justify-content: center;
  align-items: center;
`;

type DefaultBehaviorProps = {
  student: UploadAvatarModal_student$data;
  readyToEdit: boolean;
};

const DefaultBehavior = ({ student, readyToEdit }: DefaultBehaviorProps) => {
  if (readyToEdit) {
    return null;
  }

  if (!student.avatarURL) {
    return (
      <OuterDefaultBehavior>
        <DefaultAvatar student={student} />
      </OuterDefaultBehavior>
    );
  }

  return (
    <OuterDefaultBehavior>
      <CircularProgress />
    </OuterDefaultBehavior>
  );
};

type UploadAvatarModalProps = {
  student: UploadAvatarModal_student$key;
  open: boolean;
  onClose(): void;
};

export default function UploadAvatarModal({ open, onClose, student }: UploadAvatarModalProps) {
  const data = useFragment<UploadAvatarModal_student$key>(fragment, student);

  const cropperRef = useRef<ReactCropperElement>(null);

  const [readyToEdit, setReadyToEdit] = useState(false);

  const handleReadyToEdit = () => setReadyToEdit(true);

  const handleExit = () => setReadyToEdit(false);

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      keepMounted={false}
      transitionDuration={{ exit: 0 }}
      TransitionProps={{ onExit: handleExit }}
    >
      <Header>
        <Title>Carregar nova imagem</Title>
        <CloseButton onClose={onClose} />
      </Header>

      <DialogContent>
        <AvatarEditor student={data} onReady={handleReadyToEdit} ref={cropperRef} />
        <DefaultBehavior student={data} readyToEdit={readyToEdit} />
      </DialogContent>

      <DialogActions>
        <div>
          <InputFileButton cropperRef={cropperRef} />

          <Grow in={Boolean(data.avatarURL)} mountOnEnter unmountOnExit>
            <RemoveAvatarButton onClose={onClose} />
          </Grow>
        </div>

        <Grow in={readyToEdit} mountOnEnter unmountOnExit>
          <UploadAvatarButton student={data} cropperRef={cropperRef} onClose={onClose} />
        </Grow>
      </DialogActions>
    </StyledDialog>
  );
}
