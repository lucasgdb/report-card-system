import Button from '@mui/material/Button';
import styled from 'styled-components';

const LeftButton = styled((props) => <Button {...props} component="span" />)`
  && {
    border-radius: 8px;
    padding: 8px 16px;
    font: normal normal normal 16px/16px Lexend;
  }
`;

type InputFileButtonProps = {
  onChange(event: React.ChangeEvent<HTMLInputElement>): void;
};

export default function InputFileButton({ onChange }: InputFileButtonProps) {
  return (
    <label htmlFor="avatar">
      <input type="file" id="avatar" onChange={onChange} accept="image/*" hidden />

      <LeftButton variant="text" color="secondary">
        Upload
      </LeftButton>
    </label>
  );
}
