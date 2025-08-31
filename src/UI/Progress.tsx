import React from "react";
import "./ui.css";

type ProgressProps = {
  value: number;            // 0..100
  leftLabel?: string;       // ex.: "Progresso"
  rightLabel?: string;      // ex.: "Etapa 1 de 2"
};

export const Progress: React.FC<ProgressProps> = ({ value, leftLabel, rightLabel }) => {
  const v = Math.max(0, Math.min(100, value || 0));
  return (
    <div className="ui-progress">
      <div className="ui-progress__header">
        <span>{leftLabel ?? ""}</span>
        <span className="ui-progress__muted">{rightLabel ?? ""}</span>
      </div>
      <div className="ui-progress__track">
        <div className="ui-progress__bar" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
};
