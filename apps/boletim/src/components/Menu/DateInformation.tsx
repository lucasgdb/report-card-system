import { capitalize } from '@mui/material';
import dayjs from 'dayjs';
import styled from 'styled-components';

const DateText = styled.p`
  font: normal normal 400 16px/19px Inter;
  color: ${(props) => props.theme.text.main};

  transition: color 0.2s;
  margin: 0;

  @media (max-width: 599px) {
    display: none;
  }
`;

const now = dayjs();

const weekShortName = capitalize(now.format('ddd'));
const monthDay = now.format('D');
const fullMonthName = capitalize(now.format('MMMM'));

export default function DateInformation() {
  return (
    <DateText>
      {weekShortName}, {monthDay} {fullMonthName}
    </DateText>
  );
}
