import { BrandTitle } from '@usefaz/ui/components/brand-title';
import Form from './Form';

export default function ForgotPassword() {
  return (
    <div className="w-full">
      <h1>
        <BrandTitle className="max-w-[310px]">Esqueceu sua senha?</BrandTitle>
      </h1>

      <p className="mt-2 mb-0 text-base leading-6 font-normal text-[#fafafa]">
        Informe seu RM e e-mail. Um administrador da Usefaz vai entrar em contato para redefinir sua senha.
      </p>

      <Form />
    </div>
  );
}
