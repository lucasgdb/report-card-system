import UniversalCookie from 'universal-cookie';

const authorizationPolicy = 'Usefaz-Authorization-Header';

const cookie = new UniversalCookie();

const jwtToken = {
  set(token: string) {
    return cookie.set(authorizationPolicy, `Bearer ${token}`, {
      path: '/',
      domain: process.env.DOMAIN,
    });
  },

  get() {
    return decodeURIComponent(cookie.get(authorizationPolicy) ?? '');
  },

  destroy() {
    return cookie.remove(authorizationPolicy, {
      path: '/',
      domain: process.env.DOMAIN,
    });
  },
};

export default jwtToken;
