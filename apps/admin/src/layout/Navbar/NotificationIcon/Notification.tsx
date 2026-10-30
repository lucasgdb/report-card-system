import { cn } from '@usefaz/ui/lib/utils';

const absoluteDate = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' });
import { useFragment, useMutation, graphql } from 'react-relay';

import SetNotificationsAsViewedMutation from '~/modules/notification/SetNotificationsAsViewedMutation';
import type { SetNotificationsAsViewedMutation as SetNotificationsAsViewedMutationType } from '~/modules/notification/__generated__/SetNotificationsAsViewedMutation.graphql';

const breakWordsClassName = 'break-words [word-break:break-word] hyphens-auto';

const relativeTime = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 60 * 60],
  ['month', 30 * 24 * 60 * 60],
  ['week', 7 * 24 * 60 * 60],
  ['day', 24 * 60 * 60],
  ['hour', 60 * 60],
  ['minute', 60],
];

/** "há 5 minutos", "ontem"… */
const fromNow = (date: Date) => {
  const seconds = (date.getTime() - Date.now()) / 1000;
  const [unit, size] = RELATIVE_UNITS.find(([, unitSeconds]) => Math.abs(seconds) >= unitSeconds) ?? ['second', 1];
  return unit === 'second' ? 'agora' : relativeTime.format(Math.round(seconds / size), unit);
};

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

  const markAsViewed = handleSetNotificationAsViewed(data);
  const sentAt = new Date(data.sentAt);

  return (
    // Feed pattern: each notification is focusable, and reading it (hover or focus) marks it as viewed.
    <article
      // biome-ignore lint/a11y/noNoninteractiveTabindex: articles of a role="feed" are focusable by design
      tabIndex={0}
      className="flex flex-col gap-2 rounded-md py-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      onMouseEnter={markAsViewed}
      onFocus={markAsViewed}
    >
      <h3
        className={cn(
          'text-base leading-[19px] font-bold text-foreground',
          breakWordsClassName,
          !data.viewed &&
            'relative indent-4 before:absolute before:top-2 before:left-1 before:inline-block before:size-1 before:rounded-full before:bg-[#fe2a59] before:content-[""]'
        )}
      >
        {data.title}
      </h3>
      <p className={cn('text-sm leading-[17px] text-muted-foreground', breakWordsClassName)}>{data.message}</p>
      <time
        dateTime={sentAt.toISOString()}
        title={absoluteDate.format(sentAt)}
        className="text-xs leading-[15px] text-muted-foreground/80"
      >
        {fromNow(sentAt)}
      </time>
    </article>
  );
}
