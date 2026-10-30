import { BrandTitle } from '@usefaz/ui/components/brand-title';
import Form from './Form';

export default function ForgotPassword() {
  return (
    <div className="w-full">
      <h1>
        <BrandTitle className="max-w-[310px]">Esqueceu sua senha?</BrandTitle>
      </h1>

      <p className="mt-2 text-base leading-6 text-[#fafafa]">
        Digite seu e-mail abaixo para receber as instruções para redefinir sua senha.
      </p>

      <Form />
    </div>
  );
}
