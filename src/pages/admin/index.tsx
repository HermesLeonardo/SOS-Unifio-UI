import React, { useEffect, useState } from "react";
import "./index.css";
import logo from "../../images/logo.png";
import {
  Users,
  Activity,
  ClipboardList,
  FileText,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  LogOut,
} from "lucide-react";

interface AuthData {
  ra: string;
  role: "Administrador" | "Socorrista" | "Colaborador" | "Aluno";
  token?: string;
}

export default function AdminDashboard() {
  const [auth, setAuth] = useState<AuthData | null>(null);
  const [activeTab, setActiveTab] = useState("visao-geral");
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);

  useEffect(() => {
    const savedAuth = localStorage.getItem("auth");
    if (!savedAuth) {
      window.location.href = "#/";
      return;
    }

    const parsed: AuthData = JSON.parse(savedAuth);
    if (parsed.role === "Aluno") {
      window.location.href = "#/aluno";
      return;
    }

    setAuth(parsed);
  }, []);

  if (!auth) return null;

  const { role } = auth;

  function handleLogout() {
    localStorage.removeItem("auth");
    window.location.href = "#/";
  }

  return (
    <main className="admin-page">
      {/* Cabeçalho */}
      <header className="admin-header">
        <div className="header-left">
          <img src={logo} alt="SOS UNIFIO" className="logo" />
          <div className="header-text">
            <h1>SOS UNIFIO</h1>
            <p>Painel de Emergência Médica</p>
          </div>
        </div>

        <div className="header-right">
          <div className="user-info">
            <strong>{auth.ra}</strong>
            <span>{role}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Sair">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Navegação por abas */}
      <nav className="tabs">
        <button
          className={activeTab === "visao-geral" ? "active" : ""}
          onClick={() => setActiveTab("visao-geral")}
        >
          <Activity size={18} /> Visão Geral
        </button>

        <button
          className={activeTab === "ocorrencias" ? "active" : ""}
          onClick={() => setActiveTab("ocorrencias")}
        >
          <ClipboardList size={18} /> Ocorrências
        </button>

        <button
          className={activeTab === "relatorios" ? "active" : ""}
          onClick={() => setActiveTab("relatorios")}
        >
          <FileText size={18} /> Relatórios
        </button>

        {/* Botão especial de admin */}
        {role === "Administrador" && (
          <button
            className="admin-toggle"
            onClick={() => setAdminPanelOpen(!adminPanelOpen)}
          >
            <Users size={18} /> Admin {adminPanelOpen ? <ChevronUp /> : <ChevronDown />}
          </button>
        )}
      </nav>

      {/* Conteúdo */}
      <section className="tab-content">
        {/* VISÃO GERAL */}
        {activeTab === "visao-geral" && (
          <div className="tab-panel">
            <h2>Visão Geral</h2>
            <div className="cards">
              <div className="card">
                <Activity size={32} />
                <h3>Chamados Ativos</h3>
                <p>7</p>
              </div>
              <div className="card">
                <Users size={32} />
                <h3>Socorristas Disponíveis</h3>
                <p>12</p>
              </div>
              <div className="card">
                <ClipboardList size={32} />
                <h3>Total de Ocorrências</h3>
                <p>342</p>
              </div>
            </div>
          </div>
        )}

        {/* OCORRÊNCIAS */}
        {activeTab === "ocorrencias" && (
          <div className="tab-panel">
            <h2>Ocorrências</h2>
            <p>Visualização e acompanhamento de ocorrências em andamento.</p>

            <div className="occ-table-placeholder">
              <p>[Tabela de ocorrências será implementada aqui]</p>
            </div>
          </div>
        )}

        {/* RELATÓRIOS */}
        {activeTab === "relatorios" && (
          <div className="tab-panel">
            <h2>Relatórios de Atendimento</h2>
            <p>
              Todos podem preencher um relatório. Apenas <b>Socorristas</b> e{" "}
              <b>Administradores</b> podem visualizar os relatórios enviados.
            </p>

            <form className="report-form">
              <h3>Preencher Relatório</h3>

              <div className="form-group">
                <label>Nome do Paciente</label>
                <input type="text" placeholder="Digite o nome completo" />
              </div>

              <div className="form-group">
                <label>Data do Atendimento</label>
                <input type="date" />
              </div>

              <div className="form-group">
                <label>Tempo de Atendimento (minutos)</label>
                <input type="number" min="0" placeholder="Ex: 15" />
              </div>

              <div className="form-group">
                <label>Sintoma</label>
                <input type="text" placeholder="Ex: Desmaio, dor no peito..." />
              </div>

              <div className="form-group">
                <label>Local</label>
                <input type="text" placeholder="Ex: Bloco B - Sala 204" />
              </div>

              <div className="form-group">
                <label>Observação</label>
                <textarea placeholder="Descreva o ocorrido..." rows={4}></textarea>
              </div>

              <button type="submit" className="btn submit-btn">
                <PlusCircle size={18} /> Enviar Relatório
              </button>
            </form>

            {/* SOMENTE ADMIN + SOCORRISTA */}
            {(role === "Administrador" || role === "Socorrista") && (
              <div className="reports-view">
                <h3>Relatórios Registrados</h3>
                <div className="report-list">
                  <div className="report-card">
                    <FileText size={20} />
                    <div>
                      <strong>Maria Oliveira</strong>
                      <p>Desmaio - Bloco C</p>
                      <small>26/10/2025 - 12 min</small>
                    </div>
                  </div>

                  <div className="report-card">
                    <FileText size={20} />
                    <div>
                      <strong>João Pereira</strong>
                      <p>Dor no peito - Bloco A</p>
                      <small>25/10/2025 - 9 min</small>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* PAINEL ADMINISTRATIVO EXPANSÍVEL */}
      {role === "Administrador" && adminPanelOpen && (
        <section className="admin-panel">
          <h2>Painel Administrativo</h2>
          <p>Gerencie usuários, permissões e cadastro de colaboradores.</p>

          <div className="admin-actions">
            <button className="btn add-user">
              <PlusCircle size={16} /> Cadastrar Novo Colaborador
            </button>
            <button className="btn promote-user">
              <Users size={16} /> Alterar Cargo / Permissão
            </button>
          </div>

          <div className="admin-placeholder">
            <p>[Ferramentas administrativas aparecerão aqui]</p>
          </div>
        </section>
      )}
    </main>
  );
}
