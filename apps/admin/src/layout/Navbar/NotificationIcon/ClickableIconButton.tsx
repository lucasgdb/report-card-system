import useMediaQuery from '@mui/material/useMediaQuery';
import { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';

type StyledIconButtonProps = {
  $desktopOpened: boolean;
};

const StyledIconButton = styled(
  // eslint-disable-next-line
  forwardRef(({ $desktopOpened, ...props }: StyledIconButtonProps & IconButtonProps, ref: React.ForwardedRef<any>) => (
    <IconButton {...props} ref={ref} />
  ))
)<StyledIconButtonProps>`
  && {
    padding: 6px;

    ${({ $desktopOpened }) =>
      $desktopOpened &&
      css`
        background: #f5f5fb 0% 0% no-repeat padding-box;
        box-shadow: 0px 3px 6px #00000029;
      `}
  }
`;

const StyledNotificationsIcon = styled(NotificationsIcon)`
  && {
    @media (max-width: 1199px) {
      color: #fff;
    }
  }
`;

const StyledBadge = styled(Badge)`
  & .MuiBadge-badge {
    top: 7px;
    right: 5px;
    background-color: #ff0000;
  }

  & .MuiBadge-dot {
    padding: 5.5px;
    border-radius: 50%;
  }
`;

type ClickableIconButtonProps = {
  isBadgeVisible: boolean;
  isNotificationPopoverOpen: boolean;
  onClick(): void;
};

function ClickableIconButton(
  { isBadgeVisible, isNotificationPopoverOpen, onClick }: ClickableIconButtonProps,
  ref: React.ForwardedRef<any>
) {
  const isDesktop = useMediaQuery('(min-width: 1200px)');

  return (
    <StyledIconButton onClick={onClick} $desktopOpened={isDesktop && isNotificationPopoverOpen} ref={ref}>
      <StyledBadge invisible={!isBadgeVisible} variant="dot">
        <StyledNotificationsIcon color="secondary" />
      </StyledBadge>
    </StyledIconButton>
  );
}

export default forwardRef(ClickableIconButton);
