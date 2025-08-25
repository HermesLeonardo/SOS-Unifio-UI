import React, { useState } from "react";
import "./login.css";
import logo from "../../images/logo.png";

// UI
import { Button, Card, Input, Select } from "../../UI";

/**
 * Perfis disponíveis (facilmente extensível no futuro)
 */
const ROLES = ["Aluno", "Professor", "Socorrista"] as const;
type Role = (typeof ROLES)[number];

export default function Login() {
  const [role, setRole] = useState<Role>("Aluno");
  const [ra, setRa] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Opções do Select
  const roleOptions = ROLES.map((r) => ({ value: r, label: r }));

  // Sanitiza o RA (apenas dígitos, máx 12)
  function handleRaChange(v: string) {
    setRa(v.replace(/\D/g, "").slice(0, 12));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!ra) {
      setError("Informe seu RA para continuar.");
      return;
    }

    try {
      setLoading(true);

      // FAKE REQUEST (troque pelo backend real)
      await new Promise((r) => setTimeout(r, 600));
      console.log("[LOGIN_FORM_SUBMIT]", { role, ra });

      // >>> Navegação sem backend (hash router) <<<
      // guarda info mínima para a próxima tela (opcional)
      localStorage.setItem("auth", JSON.stringify({ role, ra }));
      // vai para /#/location (App.tsx deve estar com o micro-router por hash)
      window.location.hash = "/location";

      // --- Exemplo real (quando integrar):
      // const resp = await fetch("/api/auth/login", { ... });
      // if (!resp.ok) throw new Error("Falha no login");
      // const data = await resp.json();
      // localStorage.setItem("auth", JSON.stringify(data));
      // window.location.hash = "/location";
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Não foi possível entrar. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      {/* Header / Marca */}
      <header className="brand" aria-label="Identidade do sistema">
        <img
          src={logo}
          alt="SOS UNIFIO - Emergência Médica"
          className="brand-img"
        />
        <div className="brand-text">
          <strong>SOS UNIFIO</strong>
          <span>Emergência Médica</span>
        </div>
      </header>

      {/* Card de Login */}
      <Card role="region" aria-label="Acesso ao sistema" className="login-card">
        <h1 className="title">Bem-vindo</h1>
        <p className="subtitle">Entre para acessar o sistema</p>

        <form className="form" onSubmit={handleSubmit} noValidate>
          {/* Select de perfil */}
          <div className="field">
            <Select<Role>
              value={role}
              onChange={setRole}
              options={roleOptions}
              ariaLabel="Selecionar perfil"
            />
          </div>

          {/* Campo RA */}
          <div className="field">
            <Input
              leftIcon={
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
                  <path
                    d="M3 4h18a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1zm1 2v12h16V6H4zm2 2h6v2H6V8zm0 4h10v2H6v-2z"
                    fill="currentColor"
                  />
                </svg>
              }
              type="text"
              inputMode="numeric"
              placeholder="Digite seu RA (ex: 123456)"
              value={ra}
              onChange={(e) => handleRaChange(e.target.value)}
              aria-label="RA"
              autoComplete="username"
            />
          </div>

          {/* Erro, se houver */}
          {error && (
            <div className="error-msg" role="alert" aria-live="polite">
              {error}
            </div>
          )}

          {/* Botão */}
          <Button
            type="submit"
            loading={loading}
            disabled={!ra || loading}
            rightIcon={
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
                <path
                  d="M12 4l1.41 1.41L9.83 9H20v2H9.83l3.58 3.59L12 16l-6-6 6-6z"
                  fill="currentColor"
                />
              </svg>
            }
          >
            Entrar
          </Button>

          <hr className="card-divider" />
          <p className="card-divider-text">
            Ao entrar, você concorda com os{" "}
            <a href="/terms.html" target="_blank" rel="noopener noreferrer">
              Termos de Uso
            </a>{" "}
            e a{" "}
            <a href="/privacy.html" target="_blank" rel="noopener noreferrer">
              Política de Privacidade
            </a>
            .
          </p>
        </form>
      </Card>

      {/* Rodapé */}
      <footer className="emergency">
        <p>Este sistema está em desenvolvimento</p>
      </footer>
    </main>
  );
}
