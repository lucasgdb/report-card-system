import Cookies from 'universal-cookie';

const AuthorizationHeader = 'Web-Usefaz-Authorization';

const jwtToken = {
  set(token: string) {
    return new Cookies().set(AuthorizationHeader, `Bearer ${token}`, {
      path: '/',
      domain: process.env.DOMAIN,
    });
  },

  get() {
    return decodeURIComponent(new Cookies().get(AuthorizationHeader) ?? '');
  },

  destroy() {
    return new Cookies().remove(AuthorizationHeader, {
      path: '/',
      domain: process.env.DOMAIN,
    });
  },
};

export default jwtToken;
