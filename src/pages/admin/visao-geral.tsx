import React, { useState } from "react";
import { Activity, Heart, UserCheck, CheckCircle, ArrowLeft } from "lucide-react";
import ChamadosAtivos from "./chamados-ativos";
import Relatorios from "./relatorios";

/**
 * Página "Visão Geral"
 * Cards de status + Ações rápidas que alternam telas internas (como tabs antigas).
 */
export default function VisaoGeral() {
  // -------------------------------------------------------------------------
  // Controle do conteúdo ativo (tela atual)
  // -------------------------------------------------------------------------
  const [activeSection, setActiveSection] = useState<
    "geral" | "chamados" | "relatorios"
  >("geral");

  // -------------------------------------------------------------------------
  // Função genérica para alterar a seção atual
  // -------------------------------------------------------------------------
  const handleNavigate = (section: "geral" | "chamados" | "relatorios") => {
    setActiveSection(section);
  };

  // -------------------------------------------------------------------------
  // Renderização condicional das seções
  // -------------------------------------------------------------------------
  if (activeSection === "chamados") {
    return (
      <div className="subpage">
        {/* Botão para voltar */}
        <button
          className="btn-voltar"
          onClick={() => handleNavigate("geral")}
        >
          <ArrowLeft size={16} /> Voltar para Visão Geral
        </button>

        {/* Conteúdo da aba de Chamados Ativos */}
        <ChamadosAtivos />
      </div>
    );
  }

  if (activeSection === "relatorios") {
    return (
      <div className="subpage">
        {/* Botão para voltar */}
        <button
          className="btn-voltar"
          onClick={() => handleNavigate("geral")}
        >
          <ArrowLeft size={16} /> Voltar para Visão Geral
        </button>

        {/* Conteúdo da aba de Relatórios */}
        <Relatorios />
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Tela principal — Visão Geral
  // -------------------------------------------------------------------------
  return (
    <div className="visao-geral">
      <h2 className="section-title">Visão Geral</h2>

      {/* ===============================================================
         Cards principais (métricas e status)
         =============================================================== */}
      <div className="cards-grid">
        <div className="card">
          <div className="card-header">
            <Activity size={22} color="#0b55a6" />
            <span>Chamados Ativos</span>
          </div>
          <p className="card-value">2</p>
          <small>Aguardando atendimento</small>
        </div>

        <div className="card">
          <div className="card-header">
            <Heart size={22} color="#e11d48" />
            <span>Emergências</span>
          </div>
          <p className="card-value">1</p>
          <small>Alta prioridade</small>
        </div>

        <div className="card">
          <div className="card-header">
            <UserCheck size={22} color="#0b55a6" />
            <span>Em Atendimento</span>
          </div>
          <p className="card-value">1</p>
          <small>Socorristas ativos</small>
        </div>

        <div className="card">
          <div className="card-header">
            <CheckCircle size={22} color="#16a34a" />
            <span>Concluídos Hoje</span>
          </div>
          <p className="card-value">1</p>
          <small>Atendimentos finalizados</small>
        </div>
      </div>

      {/* ===============================================================
         Ações rápidas — alternância interna
         =============================================================== */}
      <div className="acoes-rapidas">
        <div className="acoes-container">
          <h3>Ações Rápidas</h3>
          <p>Operações frequentes do sistema</p>

          <div className="acoes-grid">
            {/* Solicitar Atendimento → página externa */}
            <button
              className="btn-acoes red"
              onClick={() => (window.location.href = "#/location")}
            >
              ❤️ Solicitar Atendimento
            </button>

            {/* Ver Chamados Ativos → tela interna */}
            <button
              className="btn-acoes blue"
              onClick={() => handleNavigate("chamados")}
            >
              ⚠️ Ver Chamados Ativos
            </button>

            {/* Relatórios → tela interna */}
            <button
              className="btn-acoes green"
              onClick={() => handleNavigate("relatorios")}
            >
              📈 Relatórios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
