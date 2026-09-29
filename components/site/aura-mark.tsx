import { asset, cn } from "@/lib/utils";

/** Milk drop with a dusty rose blush - no cyan halo. */
export function AuraMark({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export + basePath via asset()
    <img
      src={asset("/favicon.png")}
      alt="The AURA logo."
      width={32}
      height={32}
      className={cn(className)}
    />
  );
}
