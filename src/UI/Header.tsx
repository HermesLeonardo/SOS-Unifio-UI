import React, { useMemo } from "react";
import "./ui.css";
import { Settings, LogOut } from "lucide-react";
import logoDefault from "../images/logo.png";

interface HeaderProps {
  logoSrc?: string;
  logoSize?: number;
  sectionTitle?: string;
  user?: { name?: string; ra?: string; role?: string };
  onLogout?: () => void;
  backgroundColor?: string;
}

export function Header({
  logoSrc,
  logoSize = 48,
  sectionTitle,
  user,
  onLogout,
  backgroundColor = "#ffffff",
}: HeaderProps) {
  const isAdmin = user?.role?.toLowerCase() === "administrador";

  const headerStyle = useMemo<React.CSSProperties>(
    () => ({
      backgroundColor,
      boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
      transform: "translateZ(0)",
      backfaceVisibility: "hidden" as React.CSSProperties["backfaceVisibility"],
    }),
    [backgroundColor]
  );

  function handleAdminOptions() {
    window.location.href = "#/admin/opcoes-admin";
  }

  return (
    <header className="ui-header" style={headerStyle}>
      <div className="header-left">
        <img
          src={logoSrc || logoDefault}
          alt="Logo SOS UNIFIO"
          width={logoSize}
          height={logoSize}
          className="header-logo"
          draggable={false}
          decoding="async"
        />
        <div className="header-text">
          <h1>SOS UNIFIO</h1>
          <p>{sectionTitle || "Painel Administrativo"}</p>
        </div>
      </div>

      <div className="header-right">
        {user && (
          <div className="user-info">
            <strong>{user.name || "Usuário"}</strong>
            <span>{user.role}</span>
          </div>
        )}

        {isAdmin && (
          <button
            className="admin-btn"
            onClick={handleAdminOptions}
            title="Opções do Administrador"
          >
            <Settings size={20} />
          </button>
        )}

        {onLogout && (
          <button className="logout-btn" onClick={onLogout} title="Sair">
            <LogOut size={20} />
          </button>
        )}
      </div>
    </header>
  );
}
