'use client';

import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
};

export const Button = ({
  variant = "primary",
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) => {
  const styles = {
    primary:
      "bg-accent text-white shadow-subtle hover:bg-accent/90 focus-ring disabled:bg-accent/60",
    secondary:
      "bg-white text-accent border border-accent hover:bg-accent-muted/40 focus-ring",
    ghost: "text-neutral-600 hover:text-accent focus-ring",
  } satisfies Record<Required<ButtonProps>["variant"], string>;

  return (
    <button
      {...props}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition",
        styles[variant],
        fullWidth && "w-full",
        props.disabled && "cursor-not-allowed opacity-75",
        className,
      )}
    >
      {children}
    </button>
  );
};

