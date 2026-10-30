import { Checkbox } from '@usefaz/ui/components/ui/checkbox';
import { Field, FieldLabel } from '@usefaz/ui/components/ui/field';

export default function RememberMeCheckbox() {
  return (
    <Field orientation="horizontal" className="w-auto">
      <Checkbox id="rememberMe" name="rememberMe" defaultChecked />
      <FieldLabel htmlFor="rememberMe" className="text-[13px] font-normal text-[#f7f5fa]">
        Lembrar-me
      </FieldLabel>
    </Field>
  );
}
