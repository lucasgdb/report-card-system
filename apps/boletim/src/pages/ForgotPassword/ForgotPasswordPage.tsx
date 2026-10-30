import { AuthLayout } from '@usefaz/ui/components/auth-layout';
import { SeasonIllustration } from '@usefaz/ui/components/seasonal/season-illustration';
import { Link } from 'react-router';

import ForgotPassword from './components/ForgotPassword';

const mobileBodyStyle =
  '@media (max-width: 1279px) { body { background: #0020a2 0 0 no-repeat padding-box !important; } }';

export default function ForgotPasswordPage() {
  return (
    <>
      <title>Recuperar senha | Usefaz</title>
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
        <ForgotPassword />
      </AuthLayout>
    </>
  );
}
