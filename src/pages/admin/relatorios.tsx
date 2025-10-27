import React, { useMemo, useState } from "react";
import "./admin.css";

/**
 * RELATÓRIO DE OCORRÊNCIAS PROFISSIONAL
 * Com botão único "Voltar para Visão Geral"
 */
export default function Relatorios() {
  const auth = useMemo(() => {
    return JSON.parse(
      localStorage.getItem("auth") ||
        '{"name":"Admin. Ricardo Silva","ra":"1Administrador","role":"Administrador"}'
    );
  }, []);

  const [relatorios, setRelatorios] = useState([
    {
      id: 1,
      paciente: "João Silva Santos",
      local: "Laboratório de Anatomia",
      dataHora: "27/10/2025 10:20",
      causa: "Desmaio súbito durante aula prática",
      nivelGravidade: "Alta",
      socorristaResponsavel: "Lucas Pereira",
      procedimentos: "Avaliação inicial e transporte à enfermaria",
      observacoes: "Paciente recuperado sem sequelas.",
      autor: "Admin. Ricardo Silva",
    },
  ]);

  const [novo, setNovo] = useState({
    paciente: "",
    local: "",
    dataHora: "",
    causa: "",
    nivelGravidade: "",
    socorristaResponsavel: "",
    procedimentos: "",
    observacoes: "",
  });

  const podeEscrever = ["administrador", "socorrista", "colaborador"].includes(
    auth.role.toLowerCase()
  );
  const podeVerTodos = ["administrador", "socorrista"].includes(
    auth.role.toLowerCase()
  );

  const visiveis = podeVerTodos
    ? relatorios
    : relatorios.filter((r) => r.autor === auth.name);

  const handleEnviar = () => {
    if (!novo.paciente || !novo.local || !novo.dataHora || !novo.causa) return;

    const novoRelatorio = {
      id: relatorios.length + 1,
      ...novo,
      autor: auth.name,
    };
    setRelatorios([novoRelatorio, ...relatorios]);
    setNovo({
      paciente: "",
      local: "",
      dataHora: "",
      causa: "",
      nivelGravidade: "",
      socorristaResponsavel: "",
      procedimentos: "",
      observacoes: "",
    });
  };

  return (
    <div className="relatorios-page">

      <h2>Relatórios de Ocorrências</h2>
      <p className="subtext">
        Registro detalhado de incidentes médicos e administrativos.
      </p>

      {podeEscrever && (
        <div className="relatorio-form">
          <h3>Novo Relatório</h3>

          <div className="form-grid">
            <label>
              Nome do Paciente
              <input
                type="text"
                value={novo.paciente}
                onChange={(e) => setNovo({ ...novo, paciente: e.target.value })}
                placeholder="Ex: João Silva Santos"
              />
            </label>

            <label>
              Local do Incidente
              <input
                type="text"
                value={novo.local}
                onChange={(e) => setNovo({ ...novo, local: e.target.value })}
                placeholder="Ex: Laboratório de Anatomia"
              />
            </label>

            <label>
              Data e Hora
              <input
                type="datetime-local"
                value={novo.dataHora}
                onChange={(e) => setNovo({ ...novo, dataHora: e.target.value })}
              />
            </label>

            <label>
              Causa do Incidente
              <input
                type="text"
                value={novo.causa}
                onChange={(e) => setNovo({ ...novo, causa: e.target.value })}
                placeholder="Ex: Queda, desmaio, ferimento..."
              />
            </label>

            <label>
              Nível de Gravidade
              <select
                value={novo.nivelGravidade}
                onChange={(e) =>
                  setNovo({ ...novo, nivelGravidade: e.target.value })
                }
              >
                <option value="">Selecione...</option>
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
                <option value="Crítica">Crítica</option>
              </select>
            </label>

            <label>
              Socorrista Responsável
              <input
                type="text"
                value={novo.socorristaResponsavel}
                onChange={(e) =>
                  setNovo({ ...novo, socorristaResponsavel: e.target.value })
                }
                placeholder="Ex: Maria Souza"
              />
            </label>

            <label className="full">
              Procedimentos Realizados
              <textarea
                value={novo.procedimentos}
                onChange={(e) =>
                  setNovo({ ...novo, procedimentos: e.target.value })
                }
                placeholder="Descreva as ações realizadas durante o atendimento"
              />
            </label>

            <label className="full">
              Informações Adicionais / Observações
              <textarea
                value={novo.observacoes}
                onChange={(e) =>
                  setNovo({ ...novo, observacoes: e.target.value })
                }
                placeholder="Ex: Encaminhado ao hospital, reagiu bem ao atendimento..."
              />
            </label>
          </div>

          <button className="btn-enviar" onClick={handleEnviar}>
            Enviar Relatório
          </button>
        </div>
      )}

      <div className="relatorio-lista">
        <h3>Relatórios {podeVerTodos ? "Registrados" : "Enviados"}</h3>

        {visiveis.length === 0 ? (
          <p className="nenhum-relatorio">Nenhum relatório encontrado.</p>
        ) : (
          visiveis.map((r) => (
            <div key={r.id} className="relatorio-card">
              <div className="relatorio-header">
                <strong>{r.paciente}</strong>
                <span>{r.dataHora}</span>
              </div>
              <p><b>Local:</b> {r.local}</p>
              <p><b>Causa:</b> {r.causa}</p>
              <p><b>Gravidade:</b> {r.nivelGravidade}</p>
              <p><b>Socorrista Responsável:</b> {r.socorristaResponsavel}</p>
              <p><b>Procedimentos:</b> {r.procedimentos}</p>
              {r.observacoes && <p><b>Observações:</b> {r.observacoes}</p>}
              <small><i>Relatado por {r.autor}</i></small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
