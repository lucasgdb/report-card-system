import CircularProgress from '@mui/material/CircularProgress';
import styled from 'styled-components';
import { useFragment, graphql } from 'relay-hooks';
import { useState } from 'react';

import Notification from './Notification';
import LineBreak from './LineBreak';

const OuterNotificationList = styled.div`
  overflow-y: auto;
  max-height: 336px;

  padding-right: 8px;

  overscroll-behavior: contain;

  div:last-child div {
    padding-bottom: 0;
  }

  div:last-child ${LineBreak} {
    display: none;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #999;
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #777;
  }

  &::-webkit-scrollbar {
    width: 8px;
    border-radius: 8px;
    background-color: #e8e6f2;
  }
`;

const NotificationWrapper = styled.div`
  :first-child div {
    padding-top: 0;
  }
`;

const EmptyNotificationText = styled.p`
  font: normal normal normal 14px/17px Lexend;
  margin: 0;
  color: #666;
`;

const OuterLoader = styled.div`
  display: flex;
  justify-content: center;

  padding: 16px 0 0;
`;

const Loader = () => {
  return (
    <OuterLoader>
      <CircularProgress color="secondary" />
    </OuterLoader>
  );
};

const handleNotificationsScroll = (hasMore, loadMore, isLoading, setIsLoading) => (event) => {
  const target = event.currentTarget;
  const isAtBottom = target.scrollTop + target.clientHeight === target.scrollHeight;

  if (isAtBottom && hasMore() && !isLoading) {
    setIsLoading(true);
    loadMore(5, () => setIsLoading(false));
  }
};

type NotificationListProps = {
  admin: any;
  hasMore: any;
  loadMore: any;
};

export default function NotificationList({ admin, hasMore, loadMore }: NotificationListProps) {
  const data = useFragment(
    graphql`
      fragment NotificationList_admin on Admin
      @argumentDefinitions(count: { type: "Int", defaultValue: 5 }, after: { type: "String" }) {
        notifications(first: $count, after: $after) @connection(key: "NotificationIcon_notifications") {
          edges {
            node {
              id
              ...Notification_notification
            }
          }
        }
      }
    `,
    admin
  );

  const [isLoading, setIsLoading] = useState(false);

  const notificationsSent = (data.notifications?.edges ?? []).map(({ node: notification }) => notification);
  if (notificationsSent.length === 0) {
    return (
      <OuterNotificationList>
        <EmptyNotificationText>Nenhuma notificação ainda.</EmptyNotificationText>
      </OuterNotificationList>
    );
  }

  return (
    <OuterNotificationList onScroll={handleNotificationsScroll(hasMore, loadMore, isLoading, setIsLoading)}>
      {notificationsSent.map((notification) => (
        <NotificationWrapper key={notification.id}>
          <Notification notification={notification} />
          <LineBreak />
        </NotificationWrapper>
      ))}

      {isLoading && <Loader />}
    </OuterNotificationList>
  );
}
