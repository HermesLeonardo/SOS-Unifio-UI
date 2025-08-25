import React from "react";
import "./ui.css";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  leftIcon?: React.ReactNode;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", leftIcon, ...rest }, ref) => {
    return (
      <div className={`ui-input ${className}`}>
        {leftIcon ? <span className="ui-input__icon">{leftIcon}</span> : null}
        <input ref={ref} {...rest} />
      </div>
    );
  }
);
Input.displayName = "Input";
