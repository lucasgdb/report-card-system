import { useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';

const RIGHT_DEFAULT_POSITION = 726;
const TOP_DEFAULT_POSITION = 219;

const IconsImage = styled.img`
  position: absolute;
  right: ${RIGHT_DEFAULT_POSITION}px;
  top: ${TOP_DEFAULT_POSITION}px;

  @media (max-width: 1299px) {
    display: none;
  }
`;

export default function AnimatedIcons() {
  const iconsIconRef = useRef(null);

  useLayoutEffect(() => {
    function mouseMove(event: MouseEvent): void {
      const clientXDifference = event.clientX - RIGHT_DEFAULT_POSITION;
      const clientYDifference = event.clientY - TOP_DEFAULT_POSITION;

      iconsIconRef.current.style.right = `${RIGHT_DEFAULT_POSITION - clientXDifference * 0.005}px`;
      iconsIconRef.current.style.top = `${TOP_DEFAULT_POSITION + clientYDifference * 0.005}px`;
    }

    window.addEventListener('mousemove', mouseMove);

    return () => window.removeEventListener('mousemove', mouseMove);
  }, []);

  return <IconsImage ref={iconsIconRef} src="/assets/images/icons.svg" />;
}
