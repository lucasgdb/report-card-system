import styled from 'styled-components';

import MenuItem from './MenuItem';

const OuterContextMenu = styled.div`
  width: 220px;
  background-color: #fff;
  padding: 8px 0;
  border-radius: 8px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.125), 0px -1px 4px rgba(0, 0, 0, 0.1);
`;

export type ContextMenuOption = {
  id: number;
  text: string;
  disabled?: boolean;
  onClick(): void;
};

type ContextMenuProps = {
  options: ContextMenuOption[];
};

export default function ContextMenu({ options }: ContextMenuProps) {
  return (
    <OuterContextMenu>
      {options.map((option) => (
        <MenuItem key={option.id} text={option.text} onClick={option.onClick} disabled={option.disabled ?? false} />
      ))}
    </OuterContextMenu>
  );
}
