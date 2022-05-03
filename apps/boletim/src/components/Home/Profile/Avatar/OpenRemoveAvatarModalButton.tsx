import styled from 'styled-components';
import Button from '@mui/material/Button';
import { useState } from 'react';

import RemoveAvatarModal from './RemoveAvatarModal';

const OpenButton = styled(Button)`
  && {
    border-radius: 8px;
    padding: 8px 16px;
    font: normal normal normal 16px/16px Lexend;
  }
`;

export default function OpenRemoveAvatarModalButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => setIsOpen(true);

  const handleCloseModal = () => setIsOpen(false);

  return (
    <>
      <OpenButton color="error" onClick={handleOpenModal}>
        Remover
      </OpenButton>

      <RemoveAvatarModal open={isOpen} onClose={handleCloseModal} />
    </>
  );
}
