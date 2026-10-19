import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-[background-color,color,filter,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap",
  {
    variants: {
      variant: {
        primary: "hand-pill bg-ink text-milk hover:bg-ink-2",
        signal: "hand-pill bg-signal text-ink hover:brightness-110 font-semibold",
        pink: "hand-pill bg-pink text-ink hover:brightness-110 font-semibold",
        outline: "hand-pill bg-milk/40 text-ink hover:bg-ink hover:text-milk",
        ghost: "radius-hand text-ink hover:bg-ink/5",
        onDark: "hand-pill border-milk/45 text-milk hover:bg-milk hover:text-ink",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        default: "h-11 px-6 text-sm",
        lg: "h-13 px-8 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

export { buttonVariants };
