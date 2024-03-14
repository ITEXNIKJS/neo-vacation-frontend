import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "~/lib/utils";

const inputVariants = cva(
  "flex rounded-lg file:border-0 file:bg-transparent file:text-sm file:font-semibold disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-dark-4 h-10 w-full text-gray-1 px-3 py-3 focus-visible:outline-none focus-visible:ring-0",
        unstyled:
          "block rounded-none bg-transparent border-none focus-visible:outline-none focus-visible:ring-none focus-visible:ring-none",
      },
      errored: {
        true: "border-red-4 border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  asChild?: boolean;
  loading?: boolean;
  errored?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, errored, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, className, errored }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
