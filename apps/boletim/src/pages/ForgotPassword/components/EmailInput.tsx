import { InputGroup, InputGroupAddon, InputGroupInput } from '@usefaz/ui/components/ui/input-group';
import { MailIcon } from 'lucide-react';

export default function EmailInput(props: React.ComponentProps<typeof InputGroupInput>) {
  return (
    <InputGroup className="bg-(--input-background)">
      <InputGroupAddon>
        <MailIcon className="text-primary" />
      </InputGroupAddon>
      <InputGroupInput
        placeholder="nome@exemplo.com…"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        spellCheck={false}
        autoCapitalize="none"
        aria-label="E-mail"
        {...props}
      />
    </InputGroup>
  );
}
