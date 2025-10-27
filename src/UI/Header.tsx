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

/**
 * HEADER CORPORATIVO ESTÁVEL (sem flicks, logo fixa em cache)
 */
export function Header({
  logoSrc,
  logoSize = 48,
  sectionTitle,
  user,
  onLogout,
  backgroundColor = "#ffffff",
}: HeaderProps) {
  const isAdmin = user?.role?.toLowerCase() === "administrador";

  // 🔒 Estilo fixo (sem recriação, sem flick)
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
      {/* --------------------- LOGO E TÍTULO --------------------- */}
      <div className="header-left">
        <img
          src={logoSrc || logoDefault} // usa import fixo
          alt="Logo SOS UNIFIO"
          width={logoSize}
          height={logoSize}
          className="header-logo"
          draggable={false} // evita repintura por eventos
          decoding="async" // melhora desempenho
        />
        <div className="header-text">
          <h1>SOS UNIFIO</h1>
          <p>{sectionTitle || "Painel Administrativo"}</p>
        </div>
      </div>

      {/* --------------------- USUÁRIO E AÇÕES --------------------- */}
      <div className="header-right">
        {user && (
          <div className="user-info">
            <strong>{user.name || "Usuário"}</strong>
            <span>{user.role}</span>
          </div>
        )}

        {/* botão de configurações do admin */}
        {isAdmin && (
          <button
            className="admin-btn"
            onClick={handleAdminOptions}
            title="Opções do Administrador"
          >
            <Settings size={20} />
          </button>
        )}

        {/* botão de logout funcional */}
        {onLogout && (
          <button className="logout-btn" onClick={onLogout} title="Sair">
            <LogOut size={20} />
          </button>
        )}
      </div>
    </header>
  );
}
