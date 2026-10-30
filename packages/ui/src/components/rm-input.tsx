import { InputGroup, InputGroupAddon, InputGroupInput } from '@usefaz/ui/components/ui/input-group';
import { cn } from '@usefaz/ui/lib/utils';
import { UserIcon } from 'lucide-react';

type RMInputProps = React.ComponentProps<'input'> & {
  /** Classes for the input group (the bordered box). */
  groupClassName?: string;
};

/** Student registration number (RM) field with a person icon. Named after its placeholder by default. */
export function RMInput({
  name = 'RM',
  placeholder = 'Nº de matrícula',
  autoComplete = 'username',
  groupClassName,
  ...props
}: RMInputProps) {
  return (
    <InputGroup className={cn('bg-(--input-background)', groupClassName)}>
      <InputGroupAddon>
        <UserIcon className="text-primary" />
      </InputGroupAddon>
      <InputGroupInput
        name={name}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-label={props['aria-labelledby'] ? undefined : placeholder}
        spellCheck={false}
        autoCapitalize="none"
        {...props}
      />
    </InputGroup>
  );
}
