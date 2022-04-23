import { SimpleDialog, DialogHeader, DialogTitle, CloseButton, DialogContent, DialogActions } from '@usefaz/components';
import { graphql, useFragment } from 'relay-hooks';
import styled from 'styled-components';
import { useRef, useState } from 'react';
import { ReactCropperElement } from 'react-cropper';
import Button from '@mui/material/Button';

import { UploadAvatarModal_student$key } from './__generated__/UploadAvatarModal_student.graphql';
import AvatarEditor from './AvatarEditor';
import SelectAvatarButton from './SelectAvatarButton';
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
    <SimpleDialog
      open={open}
      onClose={onClose}
      keepMounted={false}
      transitionDuration={{ exit: 0, enter: 225 }}
      TransitionProps={{ onExit: handleReset }}
    >
      <DialogHeader>
        <DialogTitle>Carregar nova imagem</DialogTitle>
        <CloseButton onClose={onClose} />
      </DialogHeader>

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
    </SimpleDialog>
  );
}
