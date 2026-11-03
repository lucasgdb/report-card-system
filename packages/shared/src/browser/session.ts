// The session itself is an httpOnly cookie the page can't read. This flag only remembers that the
// app signed in, so it can show the login right away instead of asking the server first.
const key = () => `usefaz:${process.env.USEFAZ_APP}:signed-in`;

const session = {
  isSignedIn() {
    try {
      return localStorage.getItem(key()) === 'true';
    } catch {
      return false;
    }
  },

  markSignedIn() {
    try {
      localStorage.setItem(key(), 'true');
    } catch {
      // Storage can be blocked; the app then just asks the server on each visit.
    }
  },

  clear() {
    try {
      localStorage.removeItem(key());
    } catch {
      // See markSignedIn.
    }
  },
};

export default session;
