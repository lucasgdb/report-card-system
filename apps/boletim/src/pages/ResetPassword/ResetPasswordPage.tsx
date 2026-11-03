import { AuthLayout } from '@usefaz/ui/components/auth-layout';
import { PageLoader } from '@usefaz/ui/components/page-loader';
import { SeasonIllustration } from '@usefaz/ui/components/seasonal/season-illustration';
import { toast } from '@usefaz/ui/components/ui/sonner';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { Link, useNavigate, useParams } from 'react-router';
import { Suspense, useEffect } from 'react';

import type { ResetPasswordPageQuery } from './__generated__/ResetPasswordPageQuery.graphql';
import ResetPassword from './components/ResetPassword';

const mobileBodyStyle =
  '@media (max-width: 1279px) { body { background: #0020a2 0 0 no-repeat padding-box !important; } }';

/** Where the link of the "your request was approved" e-mail leads: the student picks a new password. */
export default function ResetPasswordPage() {
  return (
    <>
      <title>Nova senha | Usefaz</title>
      <Suspense fallback={<PageLoader />}>
        <ResetPasswordPageContent />
      </Suspense>
    </>
  );
}

function ResetPasswordPageContent() {
  const navigate = useNavigate();
  const { requestId = '', token = '' } = useParams<{ requestId: string; token: string }>();

  const { isStudentPasswordResetLinkValid: valid } = useLazyLoadQuery<ResetPasswordPageQuery>(
    graphql`
      query ResetPasswordPageQuery($requestId: ID!, $token: String!) {
        isStudentPasswordResetLinkValid(studentPasswordRecoveryRequestId: $requestId, passwordRecoveryToken: $token)
      }
    `,
    { requestId, token }
  );

  useEffect(() => {
    if (!valid) {
      toast.error('Este link é inválido ou expirou. Peça uma nova recuperação de senha.');
      navigate('/esqueci-minha-senha', { replace: true });
    }
  }, [valid, navigate]);

  if (!valid) {
    return null;
  }

  return (
    <>
      <style>{mobileBodyStyle}</style>
      <AuthLayout
        logo={
          <Link className="block rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-primary/50" to="/">
            <img src="/assets/images/usefaz_logo.svg" alt="Usefaz" width={264} height={55} />
          </Link>
        }
        illustrationBox={{ x: 158, y: 347, width: 628 }}
        illustration={
          <SeasonIllustration
            src="/assets/images/password_recovery_man.svg"
            width={628}
            height={464}
            head={{ x: 116, y: 14, size: 84, rotate: 4 }}
          />
        }
      >
        <ResetPassword />
      </AuthLayout>
    </>
  );
}
