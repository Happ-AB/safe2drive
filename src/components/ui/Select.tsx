import type { SelectHTMLAttributes } from "react";
import clsx from "clsx";

type Props = SelectHTMLAttributes<HTMLSelectElement> & { fullWidth?: boolean };

export default function Select({ className, fullWidth, ...props }: Props) {
  return (
    <select
      className={clsx("input bg-white/5", fullWidth && "w-full", className)}
      {...props}
    />
  );
}
