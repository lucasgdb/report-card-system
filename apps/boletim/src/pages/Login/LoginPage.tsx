import { AuthLayout } from '@usefaz/ui/components/auth-layout';
import { SeasonIllustration } from '@usefaz/ui/components/seasonal/season-illustration';
import { Link } from 'react-router';

import Login from './components/Login';

const mobileBodyStyle =
  '@media (max-width: 1279px) { body { background: #0020a2 0 0 no-repeat padding-box !important; } }';

export default function LoginPage() {
  return (
    <>
      <title>Login | Usefaz</title>
      <style>{mobileBodyStyle}</style>

      <AuthLayout
        logo={
          <Link className="block rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-primary/50" to="/">
            <img src="/assets/images/usefaz_logo.svg" alt="Usefaz" width={264} height={55} />
          </Link>
        }
        illustrationBox={{ x: 103, y: 144, width: 650 }}
        illustration={
          <SeasonIllustration
            src="/assets/images/reading_book.svg"
            width={650}
            height={695}
            head={{ x: 174, y: 332, size: 96, rotate: -6 }}
          />
        }
      >
        <Login />
      </AuthLayout>
    </>
  );
}
