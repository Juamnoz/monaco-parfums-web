import NextImage, { type ImageProps } from "next/image";
import { assetPath } from "@/lib/base-path";

export default function SiteImage({ src, ...props }: ImageProps) {
  const resolvedSrc = typeof src === "string" ? assetPath(src) : src;
  return <NextImage src={resolvedSrc} {...props} />;
}
