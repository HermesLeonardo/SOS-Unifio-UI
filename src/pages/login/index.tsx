import React, { useEffect, useRef, useState } from "react";
import "./Login.css";
import logo from "../../images/logo.png";

/**
 * Papéis disponíveis no login.
 * Para adicionar novos perfis no futuro, basta incluir no array abaixo.
 */
const ROLES = ["Aluno", "Professor", "Socorrista"] as const;
type Role = (typeof ROLES)[number];

export default function Login() {
  // --- Estados controlados do formulário ---
  const [role, setRole] = useState<Role>("Aluno");
  const [open, setOpen] = useState(false); // abre/fecha o dropdown de papéis
  const [ra, setRa] = useState(""); // RA (apenas dígitos)
  const [loading, setLoading] = useState(false); // estado de envio
  const [error, setError] = useState<string | null>(null);

  // ref para fechar o dropdown ao clicar fora
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  // Sanitiza o RA para conter somente números (limite de 12 para segurança)
  function handleRaChange(value: string) {
    const onlyDigits = value.replace(/\D/g, "").slice(0, 12);
    setRa(onlyDigits);
  }

  /**
   * Submit do formulário.
   * Aqui já deixamos pronto para integrar com backend.
   * Substitua o "FAKE REQUEST" pelo fetch/axios real (exemplo comentado abaixo).
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // validação simples de exemplo (ajuste conforme regra de negócio)
    if (!ra) {
      setError("Informe seu RA para continuar.");
      return;
    }

    const payload = { role, ra };

    try {
      setLoading(true);

      // --- FAKE REQUEST (remova ao integrar) ---
      await new Promise((r) => setTimeout(r, 800));
      console.log("[LOGIN_FORM_SUBMIT]", payload);
      // ----------------------------------------

      // --- EXEMPLO DE INTEGRAÇÃO REAL ---
      // const resp = await fetch("/api/auth/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });
      // if (!resp.ok) throw new Error("Falha no login");
      // const data = await resp.json();
      // // TODO: armazenar token/usuário (ex.: localStorage) e navegar
      // -----------------------------------
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
      <section
        className="login-card"
        role="region"
        aria-label="Acesso ao sistema"
      >
        <h1 className="title">Bem-vindo</h1>
        <p className="subtitle">Entre para acessar o sistema</p>

        {/* Formulário semântico (pronto para backend) */}
        <form className="form" onSubmit={handleSubmit} noValidate>
          {/* Seletor de papel */}
          <div className="field" ref={dropdownRef}>
            <button
              type="button"
              className={`select ${open ? "open" : ""}`}
              aria-haspopup="listbox"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              data-testid="role-select"
            >
              <span className="left-icon" aria-hidden>
                {/* ícone de usuário (decorativo) */}
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path
                    d="M12 12c2.761 0 5-2.686 5-6s-2.239-6-5-6-5 2.686-5 6 2.239 6 5 6zm0 2c-4.337 0-8 2.239-8 5v3h16v-3c0-2.761-3.663-5-8-5z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <span className="select-label">{role}</span>
              <span className="chevron" aria-hidden>
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M7 10l5 5 5-5H7z" fill="currentColor" />
                </svg>
              </span>
            </button>

            {open && (
              <ul className="select-menu" role="listbox" tabIndex={-1}>
                {ROLES.map((r) => (
                  <li
                    key={r}
                    role="option"
                    aria-selected={r === role}
                    className={`select-item ${r === role ? "selected" : ""}`}
                    onClick={() => {
                      setRole(r);
                      setOpen(false);
                    }}
                  >
                    <span className="item-icon" aria-hidden>
                      <svg viewBox="0 0 24 24" width="18" height="18">
                        <path
                          d="M12 12c2.761 0 5-2.686 5-6s-2.239-6-5-6-5 2.686-5 6 2.239 6 5 6zm0 2c-4.337 0-8 2.239-8 5v3h16v-3c0-2.761-3.663-5-8-5z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                    <span className="item-label">{r}</span>
                    {r === role && (
                      <span className="item-check" aria-hidden>
                        <svg viewBox="0 0 24 24" width="18" height="18">
                          <path
                            d="M20.285 6.708l-11.03 11.03-5.54-5.54 1.415-1.415 4.125 4.125 9.616-9.616z"
                            fill="currentColor"
                          />
                        </svg>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Campo RA */}
          <div className="field">
            <div className="input">
              <span className="left-icon" aria-hidden>
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path
                    d="M3 4h18a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1zm1 2v12h16V6H4zm2 2h6v2H6V8zm0 4h10v2H6v-2z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Digite seu RA (ex: 123456)"
                value={ra}
                onChange={(e) => handleRaChange(e.target.value)}
                aria-label="RA"
                autoComplete="username"
                data-testid="ra-input"
              />
            </div>
          </div>

          {/* Mensagem de erro (quando houver) */}
          {error && (
            <div className="error-msg" role="alert" aria-live="polite">
              {error}
            </div>
          )}

          {/* Botão de enviar */}
          <button
            className="btn-primary"
            type="submit"
            disabled={loading || !ra}
            data-testid="submit-btn"
          >
            <span>{loading ? "Entrando..." : "Entrar"}</span>
            <span className="arrow" aria-hidden>
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path
                  d="M12 4l1.41 1.41L9.83 9H20v2H9.83l3.58 3.59L12 16l-6-6 6-6z"
                  fill="currentColor"
                />
              </svg>
            </span>
          </button>

          <hr className="card-divider" />

          <p className="card-divider-text">
            Ao entrar, você concorda com os <a href="#">Termos de Uso</a> e a{" "}
            <a href="#">Política de Privacidade</a>.
          </p>
        </form>
      </section>

      {/* Rodapé */}
      <footer className="emergency">
        <p>Este sistema está em desenvolvimento</p>
      </footer>
    </main>
  );
}
