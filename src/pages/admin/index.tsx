import React, { useMemo } from "react";
import { Header } from "../../UI/Header";
import VisaoGeral from "./visao-geral";
import "./admin.css";

export default function AdminDashboard() {
  const auth = useMemo(() => {
    return JSON.parse(
      localStorage.getItem("auth") ||
        '{"name":"Admin. Ricardo Silva","ra":"1Administrador","role":"Administrador"}'
    );
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    window.location.href = "#/login";
  };

  return (
    <main className="admin-layout">
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

      <section className="admin-content">
        <VisaoGeral />
      </section>
    </main>
  );
}
