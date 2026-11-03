import { BrandTitle } from '@usefaz/ui/components/brand-title';

import Form from './Form';

export default function ResetPassword() {
  return (
    <div className="w-full">
      <h1>
        <BrandTitle className="max-w-[310px]">Crie sua nova senha</BrandTitle>
      </h1>

      <p className="mt-2 mb-0 text-base leading-6 font-normal text-[#fafafa]">
        Use pelo menos 8 caracteres. Depois, entre no boletim com o seu RM e a nova senha.
      </p>

      <Form />
    </div>
  );
}
