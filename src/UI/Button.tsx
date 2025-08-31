import React from "react";
import "./ui.css";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", loading, leftIcon, rightIcon, children, disabled, ...rest }, ref) => {
    const isDisabled = disabled || loading;
    return (
      <button
        ref={ref}
        className={`ui-btn ui-btn--primary ${isDisabled ? "is-disabled" : ""} ${className}`}
        disabled={isDisabled}
        {...rest}
      >
        {leftIcon ? <span className="ui-btn__icon">{leftIcon}</span> : null}
        <span className="ui-btn__label">{loading ? "Entrando..." : children}</span>
        {rightIcon ? <span className="ui-btn__icon">{rightIcon}</span> : null}
      </button>
    );
  }
);
Button.displayName = "Button";
