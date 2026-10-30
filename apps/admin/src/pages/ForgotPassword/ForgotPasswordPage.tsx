import { AuthLayout } from '@usefaz/ui/components/auth-layout';

import AuthLogoLink from '~/components/AuthLogoLink';
import useBodyClass from '~/hooks/useBodyClass';
import ForgotPassword from './components/ForgotPassword';

export default function ForgotPasswordPage() {
  useBodyClass('blue-mobile-background');

  return (
    <>
      <title>Recuperar senha | Usefaz Admin</title>
      <AuthLayout
        logo={<AuthLogoLink />}
        illustrationBox={{ x: 158, y: 347, width: 628 }}
        illustration={
          <img
            className="h-auto w-full"
            src="/assets/images/password_recovery_man.svg"
            alt=""
            width={628}
            height={464}
          />
        }
      >
        <ForgotPassword />
      </AuthLayout>
    </>
  );
}
