import React, { useEffect, useRef, useState } from "react";
import "./Login.css";
import logo from "../../images/logo.png";

const ROLES = ["Aluno", "Colaborador", "Socorrista", "Administrador"] as const;
type Role = (typeof ROLES)[number];

export default function Login() {
  const [role, setRole] = useState<Role>("Aluno");
  const [ra, setRa] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        // fechar dropdown (mantido por compatibilidade, se precisar depois)
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!ra || !senha) {
      setError("Preencha todos os campos para continuar.");
      return;
    }

    setLoading(true);

    try {
      // Simula autenticação (mock local)
      // Aqui futuramente você pode chamar a API real:
      // const response = await api.post('/login', { ra, senha, role });
      const payload = { ra, role, token: "fake-token" };
      localStorage.setItem("auth", JSON.stringify(payload));

      // Redireciona com base na role
      switch (role) {
        case "Aluno":
          window.location.href = "#/location";
          break;
        case "Colaborador":
          window.location.href = "#/colaborador";
          break;
        case "Socorrista":
          window.location.href = "#/socorrista";
          break;
        case "Administrador":
          window.location.href = "#/admin";
          break;
        default:
          window.location.href = "#/";
      }
    } catch {
      setError("Falha ao autenticar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      {/* Cabeçalho */}
      <header className="brand">
        <img src={logo} alt="SOS UNIFIO" className="brand-img" />
        <div className="brand-text">
          <strong>SOS UNIFIO</strong>
          <span>Emergência Médica</span>
        </div>
      </header>

      {/* Card de Login */}
      <section className="login-card">
        <h1 className="title">Acessar o Sistema</h1>
        <p className="subtitle">Selecione seu perfil e faça login</p>

        <form className="form" onSubmit={handleSubmit} noValidate>
          {/* Lista de perfis */}
          <div className="role-list">
            {ROLES.map((r) => (
              <div
                key={r}
                onClick={() => setRole(r)}
                className={`role-item ${role === r ? "selected" : ""} ${r.toLowerCase()}`}
              >
                <div className="role-header">
                  <span className="role-icon">
                    {r === "Aluno" && "🎓"}
                    {r === "Colaborador" && "🧑‍🏫"}
                    {r === "Socorrista" && "🚑"}
                    {r === "Administrador" && "👑"}
                  </span>
                  <strong>{r}</strong>
                </div>
                <small>
                  {r === "Aluno" && "Estudantes da UNIFIO"}
                  {r === "Colaborador" && "Professores, brigadistas e funcionários"}
                  {r === "Socorrista" && "Equipe médica especializada"}
                  {r === "Administrador" && "Reitores, suporte e gestão do sistema"}
                </small>
              </div>
            ))}
          </div>

          {/* Campo RA */}
          <div className="field">
            <label>RA (Registro Acadêmico)</label>
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
                placeholder="Digite seu RA (6 dígitos)"
                value={ra}
                onChange={(e) => setRa(e.target.value.replace(/\D/g, ""))}
              />
            </div>
            <small className="example">Exemplo: 123456</small>
          </div>

          {/* Campo Senha */}
          <div className="field">
            <label>Senha</label>
            <div className="input">
              <span className="left-icon" aria-hidden>
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path
                    d="M12 17a2 2 0 100-4 2 2 0 000 4zm6-8h-1V7a5 5 0 00-10 0v2H6a1 1 0 00-1 1v11a1 1 0 001 1h12a1 1 0 001-1V10a1 1 0 00-1-1zm-3 0H9V7a3 3 0 016 0v2z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <input
                type="password"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button
            className="btn-primary"
            type="submit"
            disabled={!ra || !senha || loading}
          >
            {loading ? "Entrando..." : "Entrar no Sistema"}
          </button>

          <p className="card-divider-text">
            Esqueceu sua senha? Entre em contato com a TI
            <br />
            <span className="system-note">O Sistema é seguro e criptografado</span>
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
