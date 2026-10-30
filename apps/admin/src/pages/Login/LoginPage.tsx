import { AuthLayout } from '@usefaz/ui/components/auth-layout';

import AuthLogoLink from '~/components/AuthLogoLink';
import useBodyClass from '~/hooks/useBodyClass';
import Login from './components/Login';

export default function LoginPage() {
  useBodyClass('blue-mobile-background');

  return (
    <>
      <title>Login | Usefaz Admin</title>
      <AuthLayout
        logo={<AuthLogoLink />}
        illustrationBox={{ x: 172, y: 230, width: 560 }}
        illustration={
          <img className="h-auto w-full" src="/assets/images/woman_reading_book.svg" alt="" width={560} height={508} />
        }
      >
        <Login />
      </AuthLayout>
    </>
  );
}
