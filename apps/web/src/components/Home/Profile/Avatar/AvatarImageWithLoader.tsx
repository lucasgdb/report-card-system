import styled from 'styled-components';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    WebKitMutationObserver?: { new (callback: MutationCallback): MutationObserver; prototype: MutationObserver };
    MozMutationObserver?: { new (callback: MutationCallback): MutationObserver; prototype: MutationObserver };
  }
}

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

type AvatarImageWithLoaderProps = {
  src: string;
};

export default function AvatarImageWithLoader({ src }: AvatarImageWithLoaderProps) {
  const [hidden, setHidden] = useState(true);

  const avatarImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const MutationObserver = window.MutationObserver;

    new MutationObserver(handleChangeAvatar).observe(avatarImageRef.current, {
      attributes: true,
      attributeFilter: ['src'],
    });

    return () => new MutationObserver(handleChangeAvatar).disconnect();
  }, []);

  const handleLoad = () => setHidden(false);

  const handleChangeAvatar = () => setHidden(true);

  return (
    <>
      {hidden && <CircularProgress />}
      <AvatarImage onLoad={handleLoad} src={src} hidden={hidden} ref={avatarImageRef} />
    </>
  );
}
