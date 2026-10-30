import { BrandTitle } from '@usefaz/ui/components/brand-title';
import { Button } from '@usefaz/ui/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import { Link } from 'react-router';

export default function RequestSent() {
  return (
    <div className="z-[1] flex flex-col items-center">
      <img src="/assets/images/recovery_success.svg" alt="" width={162} height={79} />
      <h1 className="mt-8 text-center">
        <BrandTitle>Solicitação enviada!</BrandTitle>
      </h1>

      <p className="mt-6 max-w-[350px] text-center text-base leading-6 text-pretty text-[#fafafa]">
        Agora é só checar o e-mail que foi enviado para você redefinir sua senha.
      </p>

      <Button size="lg" className="mt-8 w-full max-w-[358px]" nativeButton={false} render={<Link to="/" />}>
        <ArrowLeftIcon />
        Voltar ao login
      </Button>
    </div>
  );
}
