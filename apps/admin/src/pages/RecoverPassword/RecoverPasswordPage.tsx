import { AuthLayout } from '@usefaz/ui/components/auth-layout';
import { toast } from '@usefaz/ui/components/ui/sonner';
import { PageLoader } from '@usefaz/ui/components/page-loader';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { useNavigate, useParams } from 'react-router';
import { Suspense, useEffect } from 'react';

import type { RecoverPasswordPageQuery } from './__generated__/RecoverPasswordPageQuery.graphql';
import RecoverPassword from './components/RecoverPassword';
import AuthLogoLink from '~/components/AuthLogoLink';
import useBodyClass from '~/hooks/useBodyClass';

export default function RecoverPasswordPage() {
  return (
    <>
      <title>Recuperar senha | Usefaz Admin</title>
      <Suspense fallback={<PageLoader />}>
        <RecoverPasswordPageContent />
      </Suspense>
    </>
  );
}

function RecoverPasswordPageContent() {
  const navigate = useNavigate();
  const { requestId } = useParams<{ requestId: string }>();

  const data = useLazyLoadQuery<RecoverPasswordPageQuery>(
    graphql`
      query RecoverPasswordPageQuery($requestId: ID!) {
        adminPasswordRecoveryRequest: node(id: $requestId) {
          ... on AdminPasswordRecoveryRequest {
            status
          }
        }
      }
    `,
    { requestId }
  );

  useBodyClass('blue-mobile-background');

  useEffect(() => {
    if (data.adminPasswordRecoveryRequest?.status !== 'PENDING') {
      toast.error('Este link é inválido ou expirou. Solicite um novo link de recuperação.');
      navigate('/esqueci-minha-senha', { replace: true });
    }
  }, [data, navigate]);

  if (data.adminPasswordRecoveryRequest?.status !== 'PENDING') {
    return null;
  }

  return (
    <AuthLayout
      logo={<AuthLogoLink />}
      illustrationBox={{ x: 158, y: 347, width: 628 }}
      illustration={
        <img className="h-auto w-full" src="/assets/images/password_recovery_man.svg" alt="" width={628} height={464} />
      }
    >
      <RecoverPassword />
    </AuthLayout>
  );
}
