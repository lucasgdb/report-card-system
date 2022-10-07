import styled from 'styled-components';

const OuterOfflineBadge = styled.div`
  background-color: #f44336;
  padding: 6px 8px;
  border-radius: 8px;
`;

const OfflineText = styled.p`
  font: normal normal normal 16px/19px Lexend;
  color: #fff;
  margin: 0;
`;

export default function OfflineBadge() {
  return (
    <OuterOfflineBadge>
      <OfflineText>Offline</OfflineText>
    </OuterOfflineBadge>
  );
}
