import clsx from "clsx";
import { ButtonHTMLAttributes, FC, forwardRef, MouseEventHandler, ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ children, className, onClick, disabled, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={clsx("classic-button", className)}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
});

Button.displayName = "CustomButton"

export default Button