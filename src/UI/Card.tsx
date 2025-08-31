import React from "react";
import "./ui.css";

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", ...rest }) => {
  return <div className={`ui-card ${className}`} {...rest} />;
};
