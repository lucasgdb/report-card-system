import styled, { css } from 'styled-components';

type OuterMenuItemProps = {
  $disabled: boolean;
};

const OuterMenuItem = styled.div<OuterMenuItemProps>`
  padding: 12px 24px;
  cursor: pointer;
  transition: background-color 0.2s;

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 30%;
    `}

  :hover {
    background-color: #e6e6e6;
  }
`;

const MenuItemText = styled.p`
  font: normal normal normal 16px/19px Lexend;
  color: #333;
  margin: 0;
`;

type MenuItemProps = {
  text: string;
  disabled?: boolean;
  onClick(): void;
};

export default function MenuItem({ text, disabled = false, onClick }: MenuItemProps) {
  return (
    <OuterMenuItem onClick={onClick} $disabled={disabled}>
      <MenuItemText>{text}</MenuItemText>
    </OuterMenuItem>
  );
}
