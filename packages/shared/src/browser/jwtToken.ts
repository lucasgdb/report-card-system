// The session token lives in a cookie named after AUTHORIZATION_HEADER, as `Bearer <token>`.
const cookieName = () => process.env.AUTHORIZATION_HEADER!;

const jwtToken = {
  set(token: string) {
    // biome-ignore lint/suspicious/noDocumentCookie: reads must be synchronous (request headers), which the async Cookie Store API isn't
    document.cookie = `${cookieName()}=${encodeURIComponent(`Bearer ${token}`)}; path=/; SameSite=Lax`;
  },

  /** The `Authorization` header value (`Bearer <token>`), or an empty string without a session. */
  get() {
    if (typeof document === 'undefined') {
      return '';
    }
    const prefix = `${cookieName()}=`;
    const cookie = document.cookie.split('; ').find((entry) => entry.startsWith(prefix));
    return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : '';
  },

  destroy() {
    // biome-ignore lint/suspicious/noDocumentCookie: see `set`
    document.cookie = `${cookieName()}=; path=/; max-age=0`;
  },
};

export default jwtToken;
