import { environment } from '@usefaz/relay';
import { fetchWithRetries } from '@usefaz/shared';
import { Notification } from '@usefaz/components';
import { graphql, useFragment } from 'relay-hooks';
import Button from '@mui/material/Button';
import styled from 'styled-components';
import { commitLocalUpdate } from 'react-relay';
import { forwardRef, useState } from 'react';
import type { ReactCropperElement } from 'react-cropper';

import { UploadAvatarButton_student$key } from './__generated__/UploadAvatarButton_student.graphql';

const fragment = graphql`
  fragment UploadAvatarButton_student on Student {
    id
  }
`;

const SaveButton = styled(Button)`
  && {
    border-radius: 8px;
    padding: 8px 16px;
    font: normal normal normal 16px/16px Lexend;
  }
`;

type UploadAvatarButtonProps = {
  student: UploadAvatarButton_student$key;
  cropperRef: React.MutableRefObject<ReactCropperElement>;
  onClose(): void;
};

const UploadAvatarButton = forwardRef<HTMLButtonElement, UploadAvatarButtonProps>(
  ({ student, cropperRef, onClose }, ref) => {
    const data = useFragment<UploadAvatarButton_student$key>(fragment, student);

    const { enqueueSnackbar } = Notification.useSnackbar();

    const [loading, setLoading] = useState(false);

    const handleUploadAvatar = () => {
      const formData = new FormData();

      const imageElement = cropperRef.current;
      const cropper = imageElement.cropper;

      setLoading(true);

      cropper.getCroppedCanvas().toBlob(async (blob) => {
        try {
          formData.append('avatar', blob);

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

          enqueueSnackbar('Imagem atualizada com sucesso!', { variant: 'success' });
          onClose();
        } catch (err) {
          enqueueSnackbar('Não foi possível alterar a imagem.', { variant: 'error' });
        } finally {
          setLoading(false);
        }
      });
    };

    return (
      <SaveButton variant="contained" color="secondary" onClick={handleUploadAvatar} disabled={loading} ref={ref}>
        Salvar
      </SaveButton>
    );
  }
);

export default UploadAvatarButton;
