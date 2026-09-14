import Image from "next/image";

type SiteLogoProps = {
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export default function SiteLogo({
  className = "h-12 w-12",
  priority = false,
  sizes = "48px",
}: SiteLogoProps) {
  return (
    <Image
      src="/images/logo.png"
      alt="Store"
      width={256}
      height={256}
      priority={priority}
      sizes={sizes}
      className={className}
    />
  );
}
