import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from "react";
import { navigate } from "../router";

/* Stand-in for `next/link` in the single-file build: a real anchor to the hash route. */
type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
};

const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ href, onClick, prefetch, replace, scroll, ...rest }, ref) {
  void prefetch;
  void scroll;
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(href, { replace });
  }
  return <a ref={ref} href={`#${href}`} onClick={handleClick} {...rest} />;
});

export default Link;
