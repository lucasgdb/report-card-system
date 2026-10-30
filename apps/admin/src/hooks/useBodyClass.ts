import { useEffect } from 'react';

// Adds a class to <body> while the calling page is mounted.
export default function useBodyClass(className: string) {
  useEffect(() => {
    document.body.classList.add(className);
    return () => document.body.classList.remove(className);
  }, [className]);
}
