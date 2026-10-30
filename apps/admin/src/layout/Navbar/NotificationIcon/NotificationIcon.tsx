import { Button } from '@usefaz/ui/components/ui/button';
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from '@usefaz/ui/components/ui/popover';
import { BellIcon } from 'lucide-react';
import { useState } from 'react';
import { graphql, useMutation, usePaginationFragment } from 'react-relay';

import type { NotificationIconPaginationQuery } from './__generated__/NotificationIconPaginationQuery.graphql';
import type { NotificationIcon_admin$key } from './__generated__/NotificationIcon_admin.graphql';
import NotificationList from './NotificationList';
import SetNotificationsAsViewedMutation from '~/modules/notification/SetNotificationsAsViewedMutation';

type NotificationIconProps = {
  admin: NotificationIcon_admin$key;
};

const NotificationIcon = ({ admin }: NotificationIconProps) => {
  const { data, hasNext, isLoadingNext, loadNext } = usePaginationFragment<
    NotificationIconPaginationQuery,
    NotificationIcon_admin$key
  >(
    graphql`
      fragment NotificationIcon_admin on Admin
      @argumentDefinitions(count: { type: "Int", defaultValue: 5 }, after: { type: "String" })
      @refetchable(queryName: "NotificationIconPaginationQuery") {
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
    admin
  );

  const [setNotificationsAsViewed] = useMutation(SetNotificationsAsViewedMutation);

  const notifications = (data.notifications?.edges ?? []).map(({ node: notification }) => notification);

  const [isNotificationPopoverOpen, setIsNotificationPopoverOpen] = useState(false);
  // Unviewed notifications the admin already saw in the open panel (they're saved as viewed on close).
  const [acknowledgedIds, setAcknowledgedIds] = useState<ReadonlySet<string>>(() => new Set());

  const unviewedIds = notifications.filter((notification) => !notification.viewed).map(({ id }) => id);
  // Derived from the current data, so notifications that arrive later show the badge again.
  const isBadgeVisible = unviewedIds.some((id) => !acknowledgedIds.has(id));

  const handleSetNotificationsAsViewed = () => {
    if (unviewedIds.length > 0) {
      setNotificationsAsViewed({
        variables: { input: { notificationIds: unviewedIds } },
      });
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setAcknowledgedIds(new Set(unviewedIds));
    } else {
      handleSetNotificationsAsViewed();
    }
    setIsNotificationPopoverOpen(open);
  };

  return (
    <Popover open={isNotificationPopoverOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={isBadgeVisible ? 'Notificações (há novas)' : 'Notificações'}
            className="text-white hover:text-secondary min-[1200px]:text-secondary"
          />
        }
      >
        <span className="relative inline-flex">
          <BellIcon className="size-6" />
          {isBadgeVisible && (
            <span
              aria-hidden
              className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-destructive ring-2 ring-white"
            />
          )}
        </span>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-[300px] gap-3 py-4 pr-2 pl-4">
        <PopoverHeader>
          <PopoverTitle className="text-base font-semibold">Notificações</PopoverTitle>
        </PopoverHeader>
        <NotificationList admin={data} hasNext={hasNext} isLoadingNext={isLoadingNext} loadNext={loadNext} />
      </PopoverContent>
    </Popover>
  );
};

export default NotificationIcon;
