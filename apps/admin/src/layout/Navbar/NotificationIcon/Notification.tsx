import styled, { css } from 'styled-components';
import dayjs from 'dayjs';
import { useFragment, useMutation, graphql } from 'relay-hooks';

import SetNotificationsAsViewedMutation from '~/modules/notification/SetNotificationsAsViewedMutation';
import { SetNotificationsAsViewedMutation as SetNotificationsAsViewedMutationType } from '~/modules/notification/__generated__/SetNotificationsAsViewedMutation.graphql';

const OuterNotification = styled.div`
  background: #fff 0% 0% no-repeat padding-box;
  padding: 16px 0;

  display: flex;
  flex-direction: column;
  gap: 8px;
`;

type TitleProps = {
  $viewed: boolean;
};

const Title = styled.h1<TitleProps>`
  font: normal normal bold 16px/19px Lexend;
  color: #333;
  margin: 0;

  overflow-wrap: break-word;
  word-wrap: break-word;

  -ms-word-break: break-all;
  word-break: break-all;
  word-break: break-word;

  -ms-hyphens: auto;
  -moz-hyphens: auto;
  -webkit-hyphens: auto;
  hyphens: auto;

  ${({ $viewed }) =>
    !$viewed &&
    css`
      text-indent: 16px;
      position: relative;

      ::before {
        content: '';

        position: absolute;
        top: 8px;
        left: 4px;

        background: #fe2a59 0% 0% no-repeat padding-box;
        width: 4px;
        height: 4px;
        border-radius: 50%;

        display: inline-block;
        margin-right: 8px;
      }
    `}
`;

const Date = styled.span`
  font: normal normal normal 12px/15px Lexend;
  letter-spacing: 0;
  color: #999;
`;

const Message = styled.p`
  font: normal normal normal 14px/17px Lexend;
  margin: 0;
  color: #666;

  overflow-wrap: break-word;
  word-wrap: break-word;

  -ms-word-break: break-all;
  word-break: break-all;
  word-break: break-word;

  -ms-hyphens: auto;
  -moz-hyphens: auto;
  -webkit-hyphens: auto;
  hyphens: auto;
`;

export default function Notification({ notification }) {
  const data = useFragment(
    graphql`
      fragment Notification_notification on Notification {
        id
        title
        message
        sentAt
        viewed
      }
    `,
    notification
  );

  const [setNotificationsAsViewed] = useMutation<SetNotificationsAsViewedMutationType>(
    SetNotificationsAsViewedMutation
  );

  const handleSetNotificationAsViewed = (notification) => () => {
    if (notification.viewed) {
      return;
    }

    setNotificationsAsViewed({
      variables: { input: { notificationIds: [notification.id] } },
    });
  };

  return (
    <OuterNotification onMouseEnter={handleSetNotificationAsViewed(data)}>
      <Title $viewed={data.viewed}>{data.title}</Title>
      <Message>{data.message}</Message>
      <Date>{dayjs(data.sentAt).fromNow()}</Date>
    </OuterNotification>
  );
}
