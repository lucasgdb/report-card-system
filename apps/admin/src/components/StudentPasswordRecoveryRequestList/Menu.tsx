import styled from 'styled-components';

import MenuItem from './MenuItem';
import RefuseStudentPasswordRecoveryRequestButton from './RefuseStudentPasswordRecoveryRequestButton';

const OuterMenu = styled.div`
  width: 220px;
  background-color: #fff;
  padding: 8px 0;
  border-radius: 8px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.125), 0px -1px 4px rgba(0, 0, 0, 0.1);
`;

type MenuProps = {
  studentPasswordRecoveryRequestId: string;
  onClose(): void;
  onPasswordDialogOpen(): void;
};

export default function Menu({ studentPasswordRecoveryRequestId, onClose, onPasswordDialogOpen }: MenuProps) {
  const handleOpenPasswordDialog = () => {
    onPasswordDialogOpen();
    onClose();
  };

  return (
    <OuterMenu>
      <MenuItem text="Editar" onClick={handleOpenPasswordDialog} />
      <RefuseStudentPasswordRecoveryRequestButton
        onClose={onClose}
        studentPasswordRecoveryRequestId={studentPasswordRecoveryRequestId}
      />
    </OuterMenu>
  );
}
