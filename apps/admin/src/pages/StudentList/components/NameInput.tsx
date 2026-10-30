import { InputGroup, InputGroupAddon, InputGroupInput } from '@usefaz/ui/components/ui/input-group';
import { UserIcon } from 'lucide-react';

export default function NameInput(props: React.ComponentProps<'input'>) {
  return (
    <InputGroup className="bg-(--input-background)">
      <InputGroupAddon>
        <UserIcon className="text-primary" />
      </InputGroupAddon>
      <InputGroupInput
        name="fullname"
        autoComplete="off"
        placeholder="Nome completo…"
        aria-label="Nome completo"
        {...props}
      />
    </InputGroup>
  );
}
