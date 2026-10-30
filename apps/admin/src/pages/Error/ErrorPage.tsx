import { ErrorPage as DefaultErrorPage } from '@usefaz/ui/components/error-page';

export default function ErrorPage() {
  return (
    <>
      <title>404 | Usefaz Admin</title>
      <DefaultErrorPage
        title="Ooops!"
        description="Página não encontrada."
        information="A página que você está acessando não existe ou está temporariamente indisponível. Volte para a página inicial para continuar."
        actionText="Ir para a página inicial"
        actionHref="#/"
        disableOptionalButton
      />
    </>
  );
}
