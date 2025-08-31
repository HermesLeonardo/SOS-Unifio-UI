import React, { useMemo, useState } from "react";
import "./people.css";

import logo from "../../images/logo.png";
import { Header, Progress, Card, Button } from "../../UI";

type PeopleKey = "one" | "two_three" | "more";

const OPTIONS: { key: PeopleKey; title: string; desc: string }[] = [
  { key: "one",       title: "1 pessoa",          desc: "Apenas eu preciso de atendimento" },
  { key: "two_three", title: "2 a 3 pessoas",     desc: "Somos 2 ou 3 pessoas que precisam de atendimento" },
  { key: "more",      title: "Mais de 3 pessoas", desc: "Mais de 3 pessoas precisam de atendimento médico" },
];

export default function PeoplePage() {
  const auth = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("auth") || "{}"); }
    catch { return {}; }
  }, []);

  const [selected, setSelected] = useState<PeopleKey | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) { setError("Selecione uma opção para continuar."); return; }
    localStorage.setItem("request.people", JSON.stringify({ option: selected }));
    window.location.hash = "/symptoms"; // próxima etapa quando você criar
  }

  function handleBack() {
    window.location.hash = "/location";
  }

  return (
    <div className="people-page">
      <Header
        logoSrc={logo}
        logoSize={56}
        sectionTitle="Quantidade de Pessoas"
        user={{ name: auth?.name || "Aluno Teste", ra: auth?.ra, role: auth?.role }}
        onLogout={() => { localStorage.removeItem("auth"); window.location.hash = "/login"; }}
        onEmergencyClick={() => console.log("ligar 192")}
      />

      <main className="people-main">
        <div className="people-center">
          <div className="people-progress">
            <Progress value={66} leftLabel="Progresso" rightLabel="Etapa 2 de 3" />
          </div>

          <Card className="people-card">
            {/* NOVO: barra superior com botão voltar */}
            <div className="people-topbar">
              <button type="button" className="back-link" onClick={handleBack}>
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                  <path d="M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z" fill="currentColor"/>
                </svg>
                Voltar
              </button>
            </div>

            <div className="people-head">
              <div className="people-title">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                  <path d="M12 12a5 5 0 10-5-5 5 5 0 005 5zm0 2c-4 0-8 2-8 5v3h16v-3c0-3-4-5-8-5z" fill="currentColor"/>
                </svg>
                <span>Quantas pessoas precisam de atendimento?</span>
              </div>
              <p className="people-desc">
                Esta informação é muito importante para que nossa equipe médica possa se preparar
                adequadamente e trazer os recursos necessários.
              </p>
            </div>

            <div role="radiogroup" aria-label="Quantidade de pessoas" className="opt-list">
              {OPTIONS.map(opt => {
                const active = selected === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    className={`opt-item ${active ? "is-selected" : ""}`}
                    onClick={() => { setSelected(opt.key); setError(null); }}
                  >
                    <div className="opt-left">
                      <span className="opt-icon" aria-hidden>
                        {opt.key === "one" && (
                          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 11a4 4 0 10-4-4 4 4 0 004 4zm0 2c-3.31 0-7 1.34-7 4v3h14v-3c0-2.66-3.69-4-7-4z" fill="currentColor"/></svg>
                        )}
                        {opt.key === "two_three" && (
                          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M16 11a3 3 0 10-3-3 3 3 0 003 3zM8 11a3 3 0 10-3-3 3 3 0 003 3zm8 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zM8 13c-.29 0-.62.02-.97.05C5.23 13.26 3 14.04 3 15.5V18h5v-2.5c0-.77.29-1.44.77-2.02A9.5 9.5 0 008 13z" fill="currentColor"/></svg>
                        )}
                        {opt.key === "more" && (
                          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M8 10a3 3 0 10-3-3 3 3 0 003 3zm8 0a3 3 0 10-3-3 3 3 0 003 3zM5 12c-2.21 0-5 1.12-5 3v3h8v-3c0-1.88-2.79-3-5-3zm14 0c-2.21 0-5 1.12-5 3v3h10v-3c0-1.88-2.79-3-5-3z" fill="currentColor"/></svg>
                        )}
                      </span>
                      <div className="opt-text">
                        <div className="opt-title">{opt.title}</div>
                        <div className="opt-desc">{opt.desc}</div>
                      </div>
                    </div>
                    <span className="opt-check" aria-hidden>
                      {active && (
                        <svg width="18" height="18" viewBox="0 0 24 24">
                          <path d="M20.285 6.708l-11.03 11.03-5.54-5.54 1.415-1.415 4.125 4.125 9.616-9.616z" fill="currentColor"/>
                        </svg>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {error && <div className="people-error" role="alert">{error}</div>}

            <div className="people-actions only-next">
              <Button type="submit" onClick={handleNext}>
                Próximo: Sintomas
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
