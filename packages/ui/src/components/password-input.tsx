import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@usefaz/ui/components/ui/input-group';
import { cn } from '@usefaz/ui/lib/utils';
import { EyeIcon, EyeOffIcon, LockIcon } from 'lucide-react';
import { useState } from 'react';

type PasswordInputProps = Omit<React.ComponentProps<'input'>, 'type'> & {
  /** Classes for the input group (the bordered box). */
  groupClassName?: string;
  /** Controlled visibility of the password. */
  visible?: boolean;
  /** Initial visibility when uncontrolled. */
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
};

/**
 * Password field with a lock icon and a show/hide toggle (controlled with `visible` or uncontrolled).
 * Named "Senha" for assistive technology unless `aria-label`/`aria-labelledby` is passed.
 */
export function PasswordInput({
  name = 'password',
  placeholder = 'Senha',
  autoComplete = 'current-password',
  groupClassName,
  visible: visibleProp,
  defaultVisible = false,
  onVisibleChange,
  ...props
}: PasswordInputProps) {
  const [uncontrolledVisible, setUncontrolledVisible] = useState(defaultVisible);
  const visible = visibleProp ?? uncontrolledVisible;
  const setVisible = (next: boolean) => {
    if (visibleProp === undefined) {
      setUncontrolledVisible(next);
    }
    onVisibleChange?.(next);
  };

  return (
    <InputGroup className={cn('bg-(--input-background)', groupClassName)}>
      <InputGroupAddon>
        <LockIcon className="text-primary" />
      </InputGroupAddon>
      <InputGroupInput
        name={name}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-label={props['aria-labelledby'] ? undefined : placeholder}
        spellCheck={false}
        autoCapitalize="none"
        type={visible ? 'text' : 'password'}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          size="icon-sm"
          className="rounded-full text-secondary"
          // A fixed name plus aria-pressed: "Mostrar senha, pressionado" means the password is visible.
          aria-label="Mostrar senha"
          aria-pressed={visible}
          onClick={() => setVisible(!visible)}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
