import styled from 'styled-components';

import ErrorContent from './ErrorContent';
import Menu from './Menu';

const OuterDefaultErrorPage = styled.div`
  min-height: 100vh;

  background-color: #e8e6f2;

  display: flex;
  flex-direction: column;
`;

type DefaultErrorPageProps = {
  title: string;
  description: string;
  information: string;
  actionText: string;
  optionalButtonLink?: string;
  optionalButtonText?: string;
  disableOptionalButton?: boolean;
  onActionClick: () => void;
};

export default function DefaultErrorPage({
  title,
  description,
  information,
  actionText,
  optionalButtonLink,
  optionalButtonText,
  disableOptionalButton,
  onActionClick,
}: DefaultErrorPageProps) {
  return (
    <OuterDefaultErrorPage>
      <Menu />

      <ErrorContent
        title={title}
        description={description}
        information={information}
        actionText={actionText}
        optionalButtonLink={optionalButtonLink}
        optionalButtonText={optionalButtonText}
        disableOptionalButton={disableOptionalButton}
        onActionClick={onActionClick}
      />
    </OuterDefaultErrorPage>
  );
}
