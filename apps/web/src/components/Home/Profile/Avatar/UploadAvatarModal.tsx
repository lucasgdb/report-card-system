import { graphql, useFragment } from 'relay-hooks';
import { Notification } from '@usefaz/components';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import styled from 'styled-components';
import { useRef } from 'react';
import { ReactCropperElement } from 'react-cropper';
import { commitLocalUpdate } from 'react-relay';

import { UploadAvatarModal_student$key } from './__generated__/UploadAvatarModal_student.graphql';
import fetchWithRetries from '~/utils/relay/fetchWithRetries';
import AvatarEditor from './AvatarEditor';
import InputFileButton from './InputFileButton';
import CloseButton from './CloseButton';
import { environment } from '~/utils/relay';

const fragment = graphql`
  fragment UploadAvatarModal_student on Student {
    id
    ...AvatarEditor_student
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
  flex-direction: column;
  gap: 16px;
`;

const DialogActions = styled.div`
  background-color: #f5f5fb;
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
`;

const RightButton = styled(Button)`
  && {
    border-radius: 8px;
    padding: 8px 16px;
    font: normal normal normal 16px/16px Lexend;

    :disabled {
      background-color: #fe2a59;
      color: #fff;
      opacity: 30%;
    }
  }
`;

function getBase64FromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result?.toString());
    reader.onerror = (error) => reject(error);
  });
}

type UploadAvatarModalProps = {
  open: boolean;
  onClose(): void;
  student: UploadAvatarModal_student$key;
};

export default function UploadAvatarModal({ open, onClose, student }: UploadAvatarModalProps) {
  const data = useFragment<UploadAvatarModal_student$key>(fragment, student);

  const { enqueueSnackbar } = Notification.useSnackbar();

  const cropperRef = useRef<ReactCropperElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const imageElement = cropperRef.current as ReactCropperElement;
    const cropper = imageElement.cropper;

    cropper.getCroppedCanvas().toBlob(async (blob) => {
      formData.append('avatar', blob, 'test.jpg');

      try {
        const response = await fetchWithRetries({
          method: 'POST',
          url: `${process.env.SERVER_BASE_URL}/avatar/upload`,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        commitLocalUpdate(environment, (store) => {
          const student = store.get(data.id);
          student.setValue(response.data.avatarURL, 'avatarURL');
        });

        enqueueSnackbar('Imagem atualizada com sucesso!', { variant: 'info' });

        onClose();
      } catch {
        enqueueSnackbar('Não foi possível fazer upload da imagem.', { variant: 'error' });
      }
    });
  };

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
    <StyledDialog open={open} onClose={onClose}>
      <Header>
        <Title>Carregar nova imagem</Title>
        <CloseButton onClose={onClose} />
      </Header>

      <DialogContent>
        <AvatarEditor student={data} ref={cropperRef} />
      </DialogContent>

      <DialogActions>
        <InputFileButton onChange={handleChange} />

        <form onSubmit={handleSubmit}>
          <RightButton variant="contained" color="secondary" type="submit">
            Salvar
          </RightButton>
        </form>
      </DialogActions>
    </StyledDialog>
  );
}
