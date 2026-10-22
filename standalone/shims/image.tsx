import type { ImgHTMLAttributes } from "react";
import arnifiLogo from "../../public/brand/arnifi-logo.svg";

/* Stand-in for `next/image` in the single-file build. Public assets are embedded as data URIs. */
const PUBLIC_ASSETS: Record<string, string> = { "/brand/arnifi-logo.svg": arnifiLogo };

type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & { src: string; priority?: boolean };

export default function Image({ src, priority, alt, ...rest }: ImageProps) {
  void priority;
  // This is the next/image stand-in itself; there is no image optimiser in a file opened from disk.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={PUBLIC_ASSETS[src] ?? src} alt={alt} decoding="async" {...rest} />;
}
