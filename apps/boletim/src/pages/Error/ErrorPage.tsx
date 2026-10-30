import { ErrorPage as DefaultErrorPage } from '@usefaz/ui/components/error-page';

export default function ErrorPage() {
  return (
    <>
      <title>404 | Usefaz</title>
      <DefaultErrorPage
        title="Ooops!"
        description="Página não encontrada."
        information="A página que você tentou acessar não existe ou está temporariamente indisponível. Confira o endereço ou volte para o início."
        actionText="Ir para a página inicial"
        actionHref="#/"
        disableOptionalButton
      />
    </>
  );
}
