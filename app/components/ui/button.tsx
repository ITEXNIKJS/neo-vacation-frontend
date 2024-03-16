import { type VariantProps, cva } from "class-variance-authority";
import { Loader } from "lucide-react";
import * as React from "react";
import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center select-none rounded-lg justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70 duration-300",
  {
    variants: {
      variant: {
        primary: "bg-blue-5 text-gray-2 hover:bg-blue-4",
        secondary: "bg-white text-dark-6",
        dark: "bg-dark-5 text-gray-7 hover:text-gray-1 hover:bg-dark-6 disabled:hover:bg-dark-5 disabled:hover:text-gray-7",
        success: "bg-green-5 text-white hover:bg-green-4",
        error: "bg-red-4 text-white hover:bg-red-3",
        ghost:
          "bg-transparent text-dark-8 hover:text-gray-2 hover:bg-dark-5 disabled:bg-dark-4",
      },
      size: {
        sm: "py-2 px-4 text-sm font-semibold leading-4",
        md: "py-[10px] px-3 font-semibold text-base leading-[19px]",
        lg: "py-3 px-6 text-lg font-semibold leading-[21px]",
        icon: "h-9 w-9 p-2",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  left_icon?: React.ReactElement;
  icon?: React.ReactElement;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      isLoading,
      variant,
      size,
      children,
      left_icon,
      icon,

      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {left_icon}
        {isLoading ? (
          <Loader className="mr-2 animate-spin text-white" size={18} />
        ) : null}
        {children}
        {icon}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
