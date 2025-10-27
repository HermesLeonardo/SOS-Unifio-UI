import React, { useState } from "react";
import { Header } from "../../UI/Header";
import {
  Users,
  Shield,
  FileText,
  Settings,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import "./admin.css";

export default function AdminOptions() {
  const [activeTab, setActiveTab] = useState<
    "usuarios" | "permissoes" | "cadastros" | "configuracoes"
  >("usuarios");

  const [usuarios, setUsuarios] = useState([
    {
      nome: "Dr. João Silva",
      email: "123456@unifio.edu.br",
      ra: "123456",
      papel: "Socorrista",
      departamento: "Ambulatório",
      ultimoLogin: "27/01/2024",
      status: "Ativo",
    },
    {
      nome: "Enf. Maria Santos",
      email: "234567@unifio.edu.br",
      ra: "234567",
      papel: "Socorrista",
      departamento: "Enfermagem",
      ultimoLogin: "27/01/2024",
      status: "Ativo",
    },
    {
      nome: "Prof. Ana Costa",
      email: "345678@unifio.edu.br",
      ra: "345678",
      papel: "Colaborador",
      departamento: "Medicina",
      ultimoLogin: "26/01/2024",
      status: "Ativo",
    },
  ]);

  const [search, setSearch] = useState("");
  const [papelFiltro, setPapelFiltro] = useState("Todos");

  const [modalAberto, setModalAberto] = useState(false);
  const [modoEdicao, setModoEdicao] = useState<"novo" | "editar" | "ver">("novo");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [confirmarExclusao, setConfirmarExclusao] = useState<any>(null);

  const auth = JSON.parse(
    localStorage.getItem("auth") ||
      '{"name":"Admin. Ricardo Silva","ra":"1Administrador","role":"Administrador"}'
  );

  const handleLogout = () => {
    localStorage.removeItem("auth");
    window.location.href = "#/login";
  };

  const handleVoltar = () => {
    window.location.href = "#/admin";
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const abrirModal = (modo: "novo" | "editar" | "ver", usuario?: any) => {
    setModoEdicao(modo);
    setUsuarioSelecionado(usuario || null);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setUsuarioSelecionado(null);
  };

  const salvarUsuario = () => {
    if (modoEdicao === "novo") {
      setUsuarios([...usuarios, usuarioSelecionado]);
    } else if (modoEdicao === "editar") {
      setUsuarios((prev) =>
        prev.map((u) =>
          u.email === usuarioSelecionado.email ? usuarioSelecionado : u
        )
      );
    }
    fecharModal();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const confirmarExcluir = (usuario: any) => {
    setConfirmarExclusao(usuario);
  };

  const excluirUsuario = () => {
    if (confirmarExclusao) {
      setUsuarios(usuarios.filter((u) => u.email !== confirmarExclusao.email));
      setConfirmarExclusao(null);
    }
  };

  const filtrados = usuarios.filter((u) => {
    const texto = `${u.nome} ${u.email} ${u.ra} ${u.departamento}`.toLowerCase();
    const condicaoTexto = texto.includes(search.toLowerCase());
    const condicaoPapel = papelFiltro === "Todos" || u.papel === papelFiltro;
    return condicaoTexto && condicaoPapel;
  });

  return (
    <main className="admin-layout">
      <Header
        logoSrc="/images/logo.png"
        logoSize={42}
        sectionTitle="Opções do Administrador"
        user={{
          name: auth.name,
          ra: auth.ra,
          role: auth.role,
        }}
        backgroundColor="#ffffff"
        onLogout={handleLogout}
      />

      <div className="admin-options-header">
        <h2>Painel Administrativo</h2>
        <button className="btn-voltar" onClick={handleVoltar}>
          ⬅ Voltar ao Painel
        </button>
      </div>

      <nav className="admin-tabs">
        <button
          className={activeTab === "usuarios" ? "active" : ""}
          onClick={() => setActiveTab("usuarios")}
        >
          <Users size={18} /> Usuários
        </button>
        <button
          className={activeTab === "permissoes" ? "active" : ""}
          onClick={() => setActiveTab("permissoes")}
        >
          <Shield size={18} /> Permissões
        </button>
        <button
          className={activeTab === "cadastros" ? "active" : ""}
          onClick={() => setActiveTab("cadastros")}
        >
          <FileText size={18} /> Cadastros
        </button>
        <button
          className={activeTab === "configuracoes" ? "active" : ""}
          onClick={() => setActiveTab("configuracoes")}
        >
          <Settings size={18} /> Configurações
        </button>
      </nav>

      <section className="admin-content">
        {activeTab === "usuarios" && (
          <div className="admin-users">
            <div className="header-section">
              <h3>Gestão de Usuários</h3>
              <p>Gerencie socorristas, colaboradores e acessos do sistema</p>
              <button
                className="btn-add-user"
                onClick={() => abrirModal("novo")}
              >
                <Plus size={16} /> Novo Usuário
              </button>
            </div>

            <div className="search-bar">
              <div className="input-group">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Buscar por nome, RA, email ou departamento..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="select-filter"
                value={papelFiltro}
                onChange={(e) => setPapelFiltro(e.target.value)}
              >
                <option value="Todos">Todos os Papéis</option>
                <option value="Socorrista">Socorrista</option>
                <option value="Colaborador">Colaborador</option>
              </select>
            </div>

            <div className="user-table">
              <table>
                <thead>
                  <tr>
                    <th>Usuário</th>
                    <th>Papel</th>
                    <th>Departamento</th>
                    <th>Último Login</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((u, i) => (
                    <tr key={i}>
                      <td>
                        <div className="user-info">
                          <div className="user-avatar">
                            <span>{u.nome[0]}</span>
                          </div>
                          <div className="user-text">
                            <strong>{u.nome}</strong>
                            <p>{u.email}</p>
                            <small>RA: {u.ra}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            u.papel === "Socorrista"
                              ? "badge-red"
                              : "badge-green"
                          }`}
                        >
                          {u.papel}
                        </span>
                      </td>
                      <td>{u.departamento}</td>
                      <td>{u.ultimoLogin}</td>
                      <td>
                        <span className="status-badge active">{u.status}</span>
                      </td>
                      <td className="actions">
                        <button
                          className="icon-btn"
                          onClick={() => abrirModal("ver", u)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="icon-btn"
                          onClick={() => abrirModal("editar", u)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="icon-btn delete"
                          onClick={() => confirmarExcluir(u)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* ===== Modal de Adicionar / Editar / Visualizar ===== */}
      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h4>
                {modoEdicao === "novo"
                  ? "Adicionar Usuário"
                  : modoEdicao === "editar"
                  ? "Editar Usuário"
                  : "Visualizar Usuário"}
              </h4>
              <button className="close-btn" onClick={fecharModal}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {["novo", "editar"].includes(modoEdicao) ? (
                <>
                  <input
                    type="text"
                    placeholder="Nome completo"
                    value={usuarioSelecionado?.nome || ""}
                    onChange={(e) =>
                      setUsuarioSelecionado({
                        ...usuarioSelecionado,
                        nome: e.target.value,
                      })
                    }
                  />
                  <input
                    type="email"
                    placeholder="E-mail"
                    value={usuarioSelecionado?.email || ""}
                    onChange={(e) =>
                      setUsuarioSelecionado({
                        ...usuarioSelecionado,
                        email: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="RA"
                    value={usuarioSelecionado?.ra || ""}
                    onChange={(e) =>
                      setUsuarioSelecionado({
                        ...usuarioSelecionado,
                        ra: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Departamento"
                    value={usuarioSelecionado?.departamento || ""}
                    onChange={(e) =>
                      setUsuarioSelecionado({
                        ...usuarioSelecionado,
                        departamento: e.target.value,
                      })
                    }
                  />
                  <select
                    value={usuarioSelecionado?.papel || ""}
                    onChange={(e) =>
                      setUsuarioSelecionado({
                        ...usuarioSelecionado,
                        papel: e.target.value,
                      })
                    }
                  >
                    <option value="">Selecione o Papel</option>
                    <option value="Socorrista">Socorrista</option>
                    <option value="Colaborador">Colaborador</option>
                  </select>
                  <select
                    value={usuarioSelecionado?.status || ""}
                    onChange={(e) =>
                      setUsuarioSelecionado({
                        ...usuarioSelecionado,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </>
              ) : (
                <div className="view-details">
                  <p><strong>Nome:</strong> {usuarioSelecionado.nome}</p>
                  <p><strong>E-mail:</strong> {usuarioSelecionado.email}</p>
                  <p><strong>RA:</strong> {usuarioSelecionado.ra}</p>
                  <p><strong>Papel:</strong> {usuarioSelecionado.papel}</p>
                  <p><strong>Departamento:</strong> {usuarioSelecionado.departamento}</p>
                  <p><strong>Status:</strong> {usuarioSelecionado.status}</p>
                </div>
              )}
            </div>

            {["novo", "editar"].includes(modoEdicao) && (
              <div className="modal-footer">
                <button className="btn-primary" onClick={salvarUsuario}>
                  Salvar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== Confirmação de Exclusão ===== */}
      {confirmarExclusao && (
        <div className="modal-overlay">
          <div className="modal small">
            <h4>Excluir Usuário</h4>
            <p>
              Tem certeza que deseja excluir{" "}
              <strong>{confirmarExclusao.nome}</strong>? <br />
              Esta ação é irreversível.
            </p>
            <div className="modal-footer">
              <button
                className="btn-danger"
                onClick={excluirUsuario}
              >
                Excluir
              </button>
              <button className="btn-secondary" onClick={() => setConfirmarExclusao(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
