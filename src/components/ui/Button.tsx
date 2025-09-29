import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import clsx from "clsx";

type Variant = "default" | "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

export default function Button({
  children,
  className,
  variant = "default",
  size = "md",
  fullWidth,
  ...props
}: PropsWithChildren<ButtonProps>) {
  const base =
    "btn select-none disabled:opacity-50 disabled:cursor-not-allowed";
  const variantClasses: Record<Variant, string> = {
    default: "bg-white/5 hover:bg-white/10 border-border",
    primary: "btn-primary",
    secondary: "bg-secondary text-secondary-foreground hover:brightness-110",
    ghost: "bg-transparent hover:bg-white/10 border-transparent",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };
  const sizeClasses: Record<Size, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-5 text-base",
  };
  return (
    <button
      className={clsx(
        base,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
