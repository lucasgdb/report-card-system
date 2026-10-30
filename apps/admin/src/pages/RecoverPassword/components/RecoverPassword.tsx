import { BrandTitle } from '@usefaz/ui/components/brand-title';
import Form from './Form';

export default function RecoverPassword() {
  return (
    <div className="w-full">
      <h1>
        <BrandTitle className="max-w-[310px]">Redefinir senha</BrandTitle>
      </h1>

      <p className="mt-2 text-base leading-6 text-[#fafafa]">
        Digite sua nova senha abaixo para finalizar a recuperação de senha.
      </p>

      <Form />
    </div>
  );
}
