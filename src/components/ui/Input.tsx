import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";
import clsx from "clsx";

type Props = InputHTMLAttributes<HTMLInputElement> & { fullWidth?: boolean };

const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { className, fullWidth, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={clsx("input", fullWidth && "w-full", className)}
      {...props}
    />
  );
});

export default Input;
