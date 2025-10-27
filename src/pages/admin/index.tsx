import React, { useMemo } from "react";
import { Header } from "../../UI/Header";
import VisaoGeral from "./visao-geral";
import "./admin.css";

/**
 * Página principal do Painel Administrativo (AdminDashboard)
 * Versão simplificada — sem abas de navegação.
 * Exibe apenas o header corporativo e o conteúdo principal.
 */
export default function AdminDashboard() {
  // -------------------------------------------------------------------------
  // Autenticação simulada — leitura fixa do localStorage
  // useMemo garante leitura única, evitando flick
  // -------------------------------------------------------------------------
  const auth = useMemo(() => {
    return JSON.parse(
      localStorage.getItem("auth") ||
        '{"name":"Admin. Ricardo Silva","ra":"1Administrador","role":"Administrador"}'
    );
  }, []);

  // -------------------------------------------------------------------------
  // Logout funcional — limpa o localStorage e redireciona ao login
  // -------------------------------------------------------------------------
  const handleLogout = () => {
    localStorage.removeItem("auth");
    window.location.href = "#/login";
  };

  // -------------------------------------------------------------------------
  // Renderização principal do layout administrativo (sem abas)
  // -------------------------------------------------------------------------
  return (
    <main className="admin-layout">
      {/* ===============================================================
         Cabeçalho corporativo branco (componente reutilizável)
         =============================================================== */}
      <Header
        logoSrc="/images/logo.png"
        logoSize={42}
        sectionTitle="Painel Administrativo"
        user={{
          name: auth.name,
          ra: auth.ra,
          role: auth.role,
        }}
        backgroundColor="#ffffff"
        onLogout={handleLogout}
      />

      {/* ===============================================================
         Conteúdo principal — apenas Visão Geral
         =============================================================== */}
      <section className="admin-content">
        <VisaoGeral />
      </section>
    </main>
  );
}
