import { DefaultErrorPage } from '@usefaz/components';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ErrorPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = '404 | Usefaz';
  }, []);

  return (
    <DefaultErrorPage
      title="Ooops!"
      description="Página não encontrada."
      information="A página que você está acessando não existe ou está indisponível temporariamente. Enquanto isso, que tal acessar umas das opções abaixo?"
      actionText="Página Inicial"
      onActionClick={() => navigate('/')}
      disableOptionalButton
    />
  );
}
