import UniversalCookie from 'universal-cookie';

const cookie = new UniversalCookie();

const jwtToken = {
  set(token: string) {
    return cookie.set(process.env.AUTHORIZATION_HEADER!, `Bearer ${token}`, {
      path: '/',
    });
  },

  get() {
    return decodeURIComponent(cookie.get(process.env.AUTHORIZATION_HEADER!) ?? '');
  },

  destroy() {
    return cookie.remove(process.env.AUTHORIZATION_HEADER!, {
      path: '/',
    });
  },
};

export default jwtToken;
