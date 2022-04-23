import { graphql, useFragment } from 'relay-hooks';
import Dialog from '@mui/material/Dialog';
import styled from 'styled-components';
import { useRef, useState } from 'react';
import { ReactCropperElement } from 'react-cropper';
import Button from '@mui/material/Button';

import { UploadAvatarModal_student$key } from './__generated__/UploadAvatarModal_student.graphql';
import AvatarEditor from './AvatarEditor';
import SelectAvatarButton from './SelectAvatarButton';
import CloseButton from './CloseButton';
import UploadAvatarButton from './UploadAvatarButton';
import AvatarImage from './AvatarImage';
import OpenRemoveAvatarModalButton from './OpenRemoveAvatarModalButton';

const fragment = graphql`
  fragment UploadAvatarModal_student on Student {
    avatarURL

    ...AvatarImage_student
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

const LeftDialogActions = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
`;

const RightDialogActions = styled.div`
  display: flex;
  flex: 2;
  justify-content: flex-end;
  gap: 8px;
`;

const AvatarImageWrapper = styled.div`
  width: 224px;
  height: 224px;
`;

const CancelButton = styled(Button)`
  && {
    border-radius: 8px;
    padding: 8px 16px;
    font: normal normal normal 16px/16px Lexend;
  }
`;

type UploadAvatarModalProps = {
  student: UploadAvatarModal_student$key;
  open: boolean;
  onClose(): void;
};

export default function UploadAvatarModal({ open, onClose, student }: UploadAvatarModalProps) {
  const data = useFragment<UploadAvatarModal_student$key>(fragment, student);

  const cropperRef = useRef<ReactCropperElement>(null);

  const [readyToEdit, setReadyToEdit] = useState(false);
  const [avatarToEdit, setAvatarToEdit] = useState<string>(null);

  const handleReadyToEdit = () => setReadyToEdit(true);

  const handleReset = () => {
    setReadyToEdit(false);
    setAvatarToEdit(null);
  };

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      keepMounted={false}
      transitionDuration={{ exit: 0, enter: 225 }}
      TransitionProps={{ onExit: handleReset }}
    >
      <Header>
        <Title>Carregar nova imagem</Title>
        <CloseButton onClose={onClose} />
      </Header>

      <DialogContent>
        {avatarToEdit ? (
          <AvatarEditor onReady={handleReadyToEdit} src={avatarToEdit} ref={cropperRef} />
        ) : (
          <AvatarImageWrapper>
            <AvatarImage student={data} />
          </AvatarImageWrapper>
        )}
      </DialogContent>

      <DialogActions>
        <LeftDialogActions>
          <SelectAvatarButton setAvatarToEdit={setAvatarToEdit} />

          {!readyToEdit && data.avatarURL && <OpenRemoveAvatarModalButton />}
        </LeftDialogActions>

        {readyToEdit && (
          <RightDialogActions>
            <CancelButton color="error" onClick={handleReset}>
              Cancelar
            </CancelButton>

            <UploadAvatarButton student={data} cropperRef={cropperRef} onClose={onClose} />
          </RightDialogActions>
        )}
      </DialogActions>
    </StyledDialog>
  );
}
