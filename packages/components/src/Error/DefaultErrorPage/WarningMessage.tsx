import Button from '@mui/material/Button';
import styled from 'styled-components';

const Title = styled.h1`
  font: normal normal bold 40px/47px Roboto;
  color: #222;
  margin: 0;
  text-align: center;

  @media (min-width: 768px) {
    font: normal normal normal 60px/71px Roboto;
  }
`;

const Description = styled.h2`
  font: normal normal normal 20px/24px Roboto;
  color: #333;
  margin: 8px 0 0;
  text-align: center;

  @media (min-width: 768px) {
    font: normal normal normal 24px/28px Roboto;
  }
`;

const Information = styled.h3`
  font: normal normal lighter 14px/17px Roboto;
  color: #333;
  margin: 8px 0 0;
  text-align: center;

  max-width: 600px;

  @media (min-width: 768px) {
    font: normal normal lighter 20px/24px Roboto;
  }
`;

const ActionsWrapper = styled.div`
  margin-top: 56px;

  display: flex;
  gap: 16px;
`;

const Hyperlink = styled.a`
  text-decoration: none;
`;

const StyledButton = styled(Button)`
  && {
    font: normal normal normal 16px/16px Roboto;
    border-radius: 8px;
    padding: 16px 24px;
  }
`;

type WarningMessageProps = {
  title: string;
  description: string;
  information: string;
  actionText: string;
  optionalButtonLink?: string;
  optionalButtonText?: string;
  disableOptionalButton?: boolean;
  onActionClick: () => void;
};

export default function WarningMessage({
  title,
  description,
  information,
  actionText,
  optionalButtonLink,
  optionalButtonText,
  disableOptionalButton = false,
  onActionClick,
}: WarningMessageProps) {
  return (
    <>
      <Title>{title}</Title>

      <Description>{description}</Description>

      <Information>{information}</Information>

      <ActionsWrapper>
        {!disableOptionalButton && (
          <Hyperlink href={optionalButtonLink} target="_blank">
            <StyledButton variant="contained" color="primary">
              {optionalButtonText}
            </StyledButton>
          </Hyperlink>
        )}

        <StyledButton variant="outlined" color="primary" onClick={onActionClick}>
          {actionText}
        </StyledButton>
      </ActionsWrapper>
    </>
  );
}
