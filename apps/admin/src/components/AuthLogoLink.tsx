import { Link } from 'react-router';

/** Usefaz logo linking to the login, on the authentication pages (desktop only). */
export default function AuthLogoLink() {
  return (
    <Link to="/" className="block rounded-md outline-none focus-visible:ring-3 focus-visible:ring-secondary/50">
      <img src="/assets/images/usefaz_logo.svg" alt="Usefaz — página de login" width={264} height={55} />
    </Link>
  );
}
