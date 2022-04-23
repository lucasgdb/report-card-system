import styled from 'styled-components';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const OuterCloseButton = styled(IconButton)`
  && {
    width: 24px;
    height: 24px;
    padding: 0;
  }
`;

const StyledCloseIcon = styled(CloseIcon)`
  && {
    color: #333;
  }
`;

type CloseButtonProps = {
  onClose(): void;
};

export default function CloseButton({ onClose }: CloseButtonProps) {
  return (
    <OuterCloseButton onClick={onClose}>
      <StyledCloseIcon />
    </OuterCloseButton>
  );
}
