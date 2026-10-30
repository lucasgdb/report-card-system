import { BrandTitle } from '@usefaz/ui/components/brand-title';
import Form from './Form';

export default function Login() {
  return (
    <div className="w-full">
      <h1 className="text-display font-bold text-white">
        <BrandTitle className="mb-1">Professor,</BrandTitle>
        você é o piloto
        <br />
        deste foguete!
      </h1>

      <p className="text-[15px] leading-[25px] text-[#fafafa]">
        Faça seu login para
        <br />
        acessar a plataforma.
      </p>

      <Form />
    </div>
  );
}
