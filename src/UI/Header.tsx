import React from "react";
import "./ui.css";

type UserInfo = { name: string; ra?: string; role?: string };

type HeaderProps = {
  logoSrc: string;
  logoSize?: number;              // <-- NOVO: largura da logo em px (default 32)
  appName?: string;
  sectionTitle?: string;          // ex.: "Informar Localização"
  user?: UserInfo;                // aparece à direita
  emergencyNumber?: string;       // padrão "192"
  onLogout?: () => void;
  onEmergencyClick?: () => void;
};

export const Header: React.FC<HeaderProps> = ({
  logoSrc,
  logoSize = 100,                  // <-- maior por padrão
  appName = "SOS UNIFIO",
  sectionTitle,
  user,
  emergencyNumber = "192",
  onLogout,
  onEmergencyClick,
}) => {
  return (
    <header className="app-header" role="banner">
      <div className="app-header__left">
        <img
          src={logoSrc}
          alt={appName}
          className="app-header__logo"
          style={{ width: logoSize, height: "auto" }}  // <-- controla o tamanho
        />
        <div className="app-header__brand">
          <strong className="app-header__title">{appName}</strong>
          {sectionTitle && <span className="app-header__subtitle">{sectionTitle}</span>}
        </div>
      </div>

      <div className="app-header__right">
        <button
          type="button"
          className="app-header__link app-header__link--danger"
          onClick={onEmergencyClick}
          title={`Emergência ${emergencyNumber}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
            <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V21a1 1 0 01-1 1C10.3 22 2 13.7 2 3a1 1 0 011-1h4.5a1 1 0 011 1c0 1.24.2 2.45.57 3.57a1 1 0 01-.24 1.02l-2.2 2.2z" fill="currentColor"/>
          </svg>
          <span>Emergência {emergencyNumber}</span>
        </button>

        {user && (
          <div className="app-header__user" title={user.role ? `${user.role}` : undefined}>
            <div className="app-header__user-name">{user.name}</div>
            {user.ra && <div className="app-header__user-meta">RA: {user.ra}</div>}
          </div>
        )}

        <button
          type="button"
          className="app-header__iconbtn"
          onClick={onLogout}
          aria-label="Sair"
          title="Sair"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
            <path d="M16 13v-2H7V8l-5 4 5 4v-3h9zM20 3h-8a2 2 0 00-2 2v3h2V5h8v14h-8v-3h-2v3a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </header>
  );
};
