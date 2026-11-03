import { Button } from '@usefaz/ui/components/ui/button';
import { Spinner } from '@usefaz/ui/components/ui/spinner';
import { useFragment, graphql } from 'react-relay';

import type { NotificationList_admin$key } from './__generated__/NotificationList_admin.graphql';
import Notification from './Notification';

const notificationListClassName = 'max-h-[360px] overflow-y-auto overscroll-contain p-1.5';

const Loader = () => {
  return (
    <div className="flex justify-center pt-4">
      <Spinner className="size-6 text-secondary" />
    </div>
  );
};

type NotificationListProps = {
  admin: NotificationList_admin$key;
  hasNext: boolean;
  isLoadingNext: boolean;
  loadNext(count: number): void;
};

export default function NotificationList({ admin, hasNext, isLoadingNext, loadNext }: NotificationListProps) {
  const data = useFragment<NotificationList_admin$key>(
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

  const loadMore = () => {
    if (hasNext && !isLoadingNext) {
      loadNext(5);
    }
  };

  const handleNotificationsScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    // A small threshold: with zoom or HiDPI screens the scroll position can be fractional.
    const isAtBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 8;

    if (isAtBottom) {
      loadMore();
    }
  };

  const notificationsSent = (data.notifications?.edges ?? []).map(({ node: notification }) => notification);
  if (notificationsSent.length === 0) {
    return (
      <div className={notificationListClassName}>
        <p className="px-2.5 py-6 text-center text-sm text-muted-foreground">Nenhuma notificação ainda.</p>
      </div>
    );
  }

  return (
    <div
      role="feed"
      aria-label="Notificações"
      aria-busy={isLoadingNext}
      className={notificationListClassName}
      onScroll={handleNotificationsScroll}
    >
      {notificationsSent.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}

      {isLoadingNext && <Loader />}

      {hasNext && !isLoadingNext && (
        <Button variant="ghost" size="sm" className="mt-1 w-full" onClick={loadMore}>
          Carregar mais
        </Button>
      )}
    </div>
  );
}
