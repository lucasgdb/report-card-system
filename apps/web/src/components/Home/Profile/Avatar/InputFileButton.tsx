import Button from '@mui/material/Button';
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
  setAvatarToEdit: React.Dispatch<React.SetStateAction<string>>;
};

export default function InputFileButton({ setAvatarToEdit }: InputFileButtonProps) {
  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const avatar = event.target.files.item(0);
    if (avatar) {
      const avatarToEdit = await getBase64FromFile(avatar);
      setAvatarToEdit(avatarToEdit);
      event.target.value = null;
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
