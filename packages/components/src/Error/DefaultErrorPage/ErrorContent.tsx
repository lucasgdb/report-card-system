import styled from 'styled-components';
import Background from './Background';
import WarningMessage from './WarningMessage';

const OuterErrorContent = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;
  align-items: center;

  background-color: #e8e6f2;
`;

const ManImage = styled.img`
  z-index: 1;

  margin-left: -24px;
  margin-top: -24px;

  flex: 1;
`;

type ErrorContentProps = {
  title: string;
  description: string;
  information: string;
  actionText: string;
  optionalButtonLink?: string;
  optionalButtonText?: string;
  disableOptionalButton?: boolean;
  onActionClick: () => void;
};

export default function ErrorContent({
  title,
  description,
  information,
  actionText,
  optionalButtonLink,
  optionalButtonText,
  disableOptionalButton,
  onActionClick,
}: ErrorContentProps) {
  return (
    <OuterErrorContent>
      <Background>
        <WarningMessage
          title={title}
          description={description}
          information={information}
          actionText={actionText}
          optionalButtonLink={optionalButtonLink}
          optionalButtonText={optionalButtonText}
          disableOptionalButton={disableOptionalButton}
          onActionClick={onActionClick}
        />
      </Background>

      <ManImage src="/assets/images/error_page_man.svg" />
    </OuterErrorContent>
  );
}
