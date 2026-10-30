import { Button } from '@usefaz/ui/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import { Link } from 'react-router';

export default function PasswordChanged() {
  return (
    <div className="z-[1] flex flex-col items-center">
      <img src="/assets/images/recovery_success.svg" alt="" width={162} height={79} />
      <h1 className="sr-only">Senha redefinida</h1>

      <p className="mt-6 max-w-[350px] text-center text-base leading-6 text-pretty text-[#fafafa]">
        Sua senha foi redefinida com sucesso. Entre com a nova senha na página de login.
      </p>

      <Button size="lg" className="mt-8 w-full max-w-[358px]" nativeButton={false} render={<Link to="/" />}>
        <ArrowLeftIcon />
        Voltar ao login
      </Button>
    </div>
  );
}
