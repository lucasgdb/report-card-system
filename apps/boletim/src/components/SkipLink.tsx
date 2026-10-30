type SkipLinkProps = {
  /** id of the element to jump to (it needs tabIndex={-1}). */
  targetId: string;
  children: React.ReactNode;
};

/**
 * First focusable element of the page, visible only on keyboard focus. With HashRouter a plain
 * `#id` link would change the route, so it moves focus instead of navigating.
 */
export default function SkipLink({ targetId, children }: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      onClick={(event) => {
        event.preventDefault();
        const target = document.getElementById(targetId);
        target?.focus({ preventScroll: true });
        target?.scrollIntoView();
      }}
      className="sr-only z-50 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
    >
      {children}
    </a>
  );
}
