import React from "react";
import "./ui.css";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  leftIcon?: React.ReactNode;
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", leftIcon, ...rest }, ref) => {
    return (
      <div className={`ui-textarea ${className}`}>
        {leftIcon ? <span className="ui-textarea__icon">{leftIcon}</span> : null}
        <textarea ref={ref} {...rest} />
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
