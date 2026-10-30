import { Checkbox } from '@usefaz/ui/components/ui/checkbox';
import { FieldLabel } from '@usefaz/ui/components/ui/field';

/** The label wraps the checkbox so the whole row is one click target. */
export default function RememberMeCheckbox() {
  return (
    <FieldLabel className="items-center gap-2 py-1 text-[13px] font-normal text-[#f7f5fa]">
      <Checkbox name="rememberMe" defaultChecked />
      Lembrar-me
    </FieldLabel>
  );
}
