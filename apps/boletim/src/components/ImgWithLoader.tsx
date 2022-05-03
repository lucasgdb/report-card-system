import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    WebKitMutationObserver?: { new (callback: MutationCallback): MutationObserver; prototype: MutationObserver };
    MozMutationObserver?: { new (callback: MutationCallback): MutationObserver; prototype: MutationObserver };
  }
}

export default function ImgWithLoader(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [hidden, setHidden] = useState(true);

  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

    const handleChangeAvatar = () => setHidden(true);

    const observer = new MutationObserver(handleChangeAvatar);

    observer.observe(imgRef.current, {
      attributes: true,
      attributeFilter: ['src'],
    });

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => setHidden(false);

  return (
    <>
      {hidden && <CircularProgress />}
      <img onLoad={handleLoad} hidden={hidden} ref={imgRef} {...props} />
    </>
  );
}
