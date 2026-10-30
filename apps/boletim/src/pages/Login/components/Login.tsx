import { BrandTitle } from '@usefaz/ui/components/brand-title';
import Form from './Form';

export default function Login() {
  return (
    <div className="w-full">
      <h1 className="m-0 text-display font-bold text-white">
        <BrandTitle className="mb-1">Aluno,</BrandTitle>
        você é nosso
        <br />
        maior valor!
      </h1>

      <p className="m-0 text-[15px] leading-[25px] font-normal text-[#fafafa]">
        Faça seu login para
        <br />
        acessar a plataforma.
      </p>

      <Form />
    </div>
  );
}
