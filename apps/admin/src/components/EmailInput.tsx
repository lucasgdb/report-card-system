import { InputGroup, InputGroupAddon, InputGroupInput } from '@usefaz/ui/components/ui/input-group';
import { MailIcon } from 'lucide-react';

/** E-mail field with a mail icon, styled like the shared RMInput/PasswordInput. Named "E-mail" by default. */
export default function EmailInput({ placeholder = 'nome@escola.com…', ...props }: React.ComponentProps<'input'>) {
  return (
    <InputGroup className="bg-(--input-background)">
      <InputGroupAddon>
        <MailIcon className="text-primary" />
      </InputGroupAddon>
      <InputGroupInput
        name="email"
        type="email"
        aria-label="E-mail"
        placeholder={placeholder}
        autoComplete="email"
        spellCheck={false}
        autoCapitalize="none"
        {...props}
      />
    </InputGroup>
  );
}
