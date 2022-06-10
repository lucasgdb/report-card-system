import Popper, { PopperProps } from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import ClickAwayListener from '@mui/material/ClickAwayListener';

type ArrowPopperProps = PopperProps & {
  children: React.ReactElement;
  timeout?: number;
  onClose(): void;
};

export default function ArrowPopper({ children, timeout = 350, onClose, ...props }: ArrowPopperProps) {
  return (
    <Popper
      transition
      placement="bottom"
      modifiers={[
        {
          name: 'flip',
          enabled: true,
          options: {
            altBoundary: true,
            rootBoundary: 'document',
            padding: 8,
          },
        },
        {
          name: 'preventOverflow',
          enabled: true,
          options: {
            altAxis: false,
            altBoundary: false,
            tether: false,
            rootBoundary: 'document',
            padding: 8,
          },
        },
      ]}
      {...props}
    >
      {({ TransitionProps }) => (
        <ClickAwayListener onClickAway={onClose}>
          <Fade {...TransitionProps} timeout={timeout}>
            {children}
          </Fade>
        </ClickAwayListener>
      )}
    </Popper>
  );
}
