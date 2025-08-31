import React, { useEffect, useRef, useState } from "react";
import "./ui.css";

export type Option<T extends string = string> = {
  value: T;
  label: string;
  icon?: React.ReactNode;
};

type SelectProps<T extends string = string> = {
  value: T;
  onChange: (val: T) => void;
  options: Option<T>[];
  ariaLabel?: string;
  className?: string;
};

export function Select<T extends string = string>({
  value,
  onChange,
  options,
  ariaLabel,
  className = "",
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const current = options.find(o => o.value === value);

  return (
    <div className={`ui-select ${open ? "is-open" : ""} ${className}`} ref={ref}>
      <button
        type="button"
        className="ui-select__button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen(v => !v)}
      >
        <span className="ui-select__left">
          {/* ícone genérico de usuário */}
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
            <path
              d="M12 12c2.761 0 5-2.686 5-6s-2.239-6-5-6-5 2.686-5 6 2.239 6 5 6zm0 2c-4.337 0-8 2.239-8 5v3h16v-3c0-2.761-3.663-5-8-5z"
              fill="currentColor"
            />
          </svg>
        </span>
        <span className="ui-select__label">{current?.label ?? ""}</span>
        <span className="ui-select__chevron" aria-hidden>
          <svg viewBox="0 0 24 24" width="20" height="20"><path d="M7 10l5 5 5-5H7z" fill="currentColor" /></svg>
        </span>
      </button>

      {open && (
        <ul className="ui-select__menu" role="listbox">
          {options.map(opt => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              className={`ui-select__item ${opt.value === value ? "is-selected" : ""}`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              <span className="ui-select__item-icon" aria-hidden>
                {opt.icon ?? (
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path
                      d="M12 12c2.761 0 5-2.686 5-6s-2.239-6-5-6-5 2.686-5 6 2.239 6 5 6zm0 2c-4.337 0-8 2.239-8 5v3h16v-3c0-2.761-3.663-5-8-5z"
                      fill="currentColor"
                    />
                  </svg>
                )}
              </span>
              <span className="ui-select__item-label">{opt.label}</span>
              {opt.value === value && (
                <span className="ui-select__check" aria-hidden>
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path d="M20.285 6.708l-11.03 11.03-5.54-5.54 1.415-1.415 4.125 4.125 9.616-9.616z" fill="currentColor" />
                  </svg>
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
