import { useState, useRef } from 'react';
import { ArrowPopper } from '@usefaz/components';
import { createPaginationContainer } from 'react-relay';
import { graphql, useMutation } from 'relay-hooks';
import styled from 'styled-components';

import { NotificationIcon_admin$data } from './__generated__/NotificationIcon_admin.graphql';
import NotificationList from './NotificationList';
import ClickableIconButton from './ClickableIconButton';
import SetNotificationsAsViewedMutation from '~/modules/notification/SetNotificationsAsViewedMutation';

const NotificationListWrapper = styled.div`
  padding: 16px 8px 16px 16px;
  width: 280px;
  box-sizing: border-box;
  background: #fff 0% 0% no-repeat padding-box;
  box-shadow: 0 0 10px #00000029;
  border-radius: 8px;
`;

type NotificationIconProps = {
  admin: NotificationIcon_admin$data;
  relay: any;
};

const NotificationIcon = ({ admin, relay }: NotificationIconProps) => {
  const [setNotificationsAsViewed] = useMutation(SetNotificationsAsViewedMutation);

  const buttonRef = useRef(null);

  const notifications = (admin.notifications?.edges ?? []).map(({ node: notification }) => notification);

  const [isNotificationPopoverOpen, setIsNotificationPopoverOpen] = useState(false);
  const [isBadgeVisible, setIsBadgeVisible] = useState(() => {
    const hasNewNotifications = notifications.some((notificationSent) => !notificationSent.viewed);
    return hasNewNotifications;
  });

  const handleSetNotificationsAsViewed = () => {
    const nonViewedNotifications = notifications.filter((notification) => !notification.viewed);
    if (nonViewedNotifications.length > 0) {
      const notificationIds = notifications.map((notification) => notification.id);
      setNotificationsAsViewed({
        variables: { input: { notificationIds } },
      });
    }
  };

  const handleNotificationIconClick = () => {
    setIsBadgeVisible(false);
    setIsNotificationPopoverOpen((prevOpen) => !prevOpen);
  };

  const handleClose = () => {
    handleSetNotificationsAsViewed();
    setIsNotificationPopoverOpen(false);
  };

  return (
    <>
      <ClickableIconButton
        isBadgeVisible={isBadgeVisible}
        isNotificationPopoverOpen={isNotificationPopoverOpen}
        onClick={handleNotificationIconClick}
        ref={buttonRef}
      />

      <ArrowPopper open={isNotificationPopoverOpen} onClose={handleClose} anchorEl={buttonRef.current} disablePortal>
        <NotificationListWrapper>
          <NotificationList admin={admin} hasMore={relay.hasMore} loadMore={relay.loadMore} />
        </NotificationListWrapper>
      </ArrowPopper>
    </>
  );
};

export default createPaginationContainer(
  NotificationIcon,
  {
    admin: graphql`
      fragment NotificationIcon_admin on Admin
      @argumentDefinitions(count: { type: "Int", defaultValue: 5 }, after: { type: "String" }) {
        ...NotificationList_admin @arguments(count: $count, after: $after)

        notifications(first: $count, after: $after) @connection(key: "NotificationIcon_notifications") {
          edges {
            node {
              id
              viewed
            }
          }
        }
      }
    `,
  },
  {
    direction: 'forward',
    query: graphql`
      query NotificationIconQuery($count: Int!, $after: String) {
        admin {
          ...NotificationIcon_admin @arguments(count: $count, after: $after)
        }
      }
    `,
    getConnectionFromProps(props) {
      return props.admin?.notifications;
    },
    getFragmentVariables(previousVariables, totalCount) {
      return {
        ...previousVariables,
        count: totalCount,
      };
    },
    getVariables(_props, paginationInfo) {
      return {
        count: paginationInfo.count,
        after: paginationInfo.cursor,
      };
    },
  }
);
