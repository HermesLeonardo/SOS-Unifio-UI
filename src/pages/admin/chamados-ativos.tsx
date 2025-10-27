import React, { useState } from "react";
import { MapPin, Clock, User, AlertTriangle } from "lucide-react";

/**
 * Página "Chamados Ativos"
 * Baseada no print 4 — lista lateral + painel de detalhes clicável.
 * Usa mock local (simulação) para dados de chamados.
 */
export default function ChamadosAtivos() {
  // Mock local de chamados
  const chamados = [
    {
      id: 1,
      nome: "João Silva Santos",
      local: "Laboratório de Anatomia",
      sintomas: ["Desmaio", "Dificuldade para respirar"],
      prioridade: "Alta",
      status: "Designado",
      descricao: "Aluno desmaiou durante aula prática no laboratório.",
      tempo: "10min",
    },
    {
      id: 2,
      nome: "Pedro Henrique Lima",
      local: "Quadra Poliesportiva",
      sintomas: ["Lesão / Trauma"],
      prioridade: "Baixa",
      status: "Aguardando",
      descricao: "Aluno caiu durante o treino de basquete.",
      tempo: "20min",
    },
  ];

  const [selecionado, setSelecionado] = useState(chamados[0]);

  return (
    <div className="chamados-layout">
      {/* Lista lateral de chamados */}
      <aside className="chamados-lista">
        <h3>Chamados Ativos</h3>
        <p>Ocorrências aguardando atendimento</p>

        {chamados.map((c) => (
          <div
            key={c.id}
            className={`chamado-card ${selecionado.id === c.id ? "ativo" : ""}`}
            onClick={() => setSelecionado(c)}
          >
            <div className="chamado-info">
              <strong>{c.nome}</strong>
              <p>{c.local}</p>
              <small>{c.sintomas.join(", ")}</small>
            </div>
            <span className={`tag prioridade-${c.prioridade.toLowerCase()}`}>
              {c.prioridade}
            </span>
          </div>
        ))}
      </aside>

      {/* Painel de detalhes do chamado selecionado */}
      <section className="chamado-detalhe">
        <header>
          <h3>Detalhes do Chamado</h3>
          <div className="tags">
            <span className={`tag prioridade-${selecionado.prioridade.toLowerCase()}`}>
              {selecionado.prioridade}
            </span>
            <span className="tag status">{selecionado.status}</span>
          </div>
        </header>

        <div className="detalhe-grid">
          <p><User size={16}/> <strong>Solicitante:</strong> {selecionado.nome}</p>
          <p><MapPin size={16}/> <strong>Localização:</strong> {selecionado.local}</p>
          <p><Clock size={16}/> <strong>Tempo:</strong> {selecionado.tempo}</p>
          <p><AlertTriangle size={16}/> <strong>Sintomas:</strong> {selecionado.sintomas.join(", ")}</p>
        </div>

        <div className="descricao">
          <h4>Descrição</h4>
          <p>{selecionado.descricao}</p>
        </div>

        <div className="acoes-detalhe">
          <button className="btn blue">Aceitar Chamado</button>
          <button className="btn gray">Atribuir a Outro Socorrista</button>
          <button className="btn green">Ver no Mapa</button>
        </div>
      </section>
    </div>
  );
}
