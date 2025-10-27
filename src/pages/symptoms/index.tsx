import React, { useMemo, useRef, useState } from "react";
import "./symptoms.css";

import logo from "../../images/logo.png";
import { Header, Progress, Card, Button, Textarea } from "../../UI";

type CatKey = "respiratory" | "neuro" | "digestive" | "trauma" | "other";

const CATEGORIES: { key: CatKey; title: string; desc: string; color: string; placeholder: string }[] = [
  {
    key: "respiratory",
    title: "Problemas Respiratórios e Cardíacos",
    desc: "Dor no peito, falta de ar, palpitações",
    color: "cat--red",
    placeholder: "Ex.: dor no peito, dificuldade para respirar, palpitações",
  },
  {
    key: "neuro",
    title: "Problemas Neurológicos",
    desc: "Dor de cabeça intensa, convulsão, tontura",
    color: "cat--purple",
    placeholder: "Ex.: dor de cabeça, convulsão, perda de força",
  },
  {
    key: "digestive",
    title: "Problemas Digestivos",
    desc: "Náusea, vômitos, dor abdominal",
    color: "cat--orange",
    placeholder: "Ex.: vômitos, dor abdominal, diarreia",
  },
  {
    key: "trauma",
    title: "Lesões e Traumas",
    desc: "Queda, corte, sangramento",
    color: "cat--yellow",
    placeholder: "Ex.: corte no braço, sangramento, torção de tornozelo",
  },
  {
    key: "other",
    title: "Outros Sintomas",
    desc: "Febre, alergia, mal-estar geral",
    color: "cat--green",
    placeholder: "Ex.: febre alta, reação alérgica, mal-estar",
  },
];

export default function SymptomsPage() {
  // usuário autenticado (mock até integrar backend)
  const auth = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("auth") || "{}");
    } catch {
      return {};
    }
  }, []);

  const [selected, setSelected] = useState<CatKey | null>(null);
  const [brief, setBrief] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false); // <- novo

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const STEPS = 3;
  const STEP = 3;
  const progress = Math.round((STEP / STEPS) * 100); // 100%

  function handleSelect(key: CatKey) {
    setSelected(key);
    setError(null);
    // rola para o final, onde está a caixa obrigatória
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }

  function handleBack() {
    window.location.hash = "/people";
  }

  async function handleSubmit() {
    if (!selected) {
      setError("Escolha uma categoria de sintomas.");
      return;
    }
    if (!brief.trim()) {
      setError("Descreva brevemente o principal sintoma.");
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Salva tudo localmente (troque por chamada de API quando integrar)
      const payload = {
        location: JSON.parse(localStorage.getItem("request.location") || "{}"),
        people: JSON.parse(localStorage.getItem("request.people") || "{}"),
        symptoms: { category: selected, brief: brief.trim() },
      };
      localStorage.setItem("request.full", JSON.stringify(payload));

      // navega para a tela de confirmação
      window.location.hash = "/confirm";
    } finally {
      setSubmitting(false);
    }
  }

  const current = CATEGORIES.find((c) => c.key === selected);
  const currentPlaceholder = current?.placeholder || "Ex.: dor de cabeça, vômitos, febre alta";

  return (
    <div className="symp-page">
      <Header
        logoSrc={logo}
        logoSize={56}
        sectionTitle="Descrever Sintomas"
        user={{ name: auth?.name || "Aluno Teste", ra: auth?.ra, role: auth?.role }}
        onLogout={() => {
          localStorage.removeItem("auth");
          window.location.hash = "/login";
        }}
        onEmergencyClick={() => console.log("ligar 192")}
      />

      <main className="symp-main">
        <div className="symp-center">
          <div className="symp-progress">
            <Progress value={progress} leftLabel="Progresso da Solicitação" rightLabel={`Etapa ${STEP} de ${STEPS}`} />
          </div>

          <Card className="symp-card">
            {/* topo com voltar */}
            <div className="symp-topbar">
              <button type="button" className="back-link" onClick={handleBack}>
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                  <path d="M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z" fill="currentColor" />
                </svg>
                Voltar
              </button>
            </div>

            <div className="symp-head">
              <div className="symp-title">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                  <path d="M20 8a8 8 0 11-7-7v2a6 6 0 106 6h2z" fill="currentColor" />
                </svg>
                <span>Como você está se sentindo?</span>
              </div>
              <p className="symp-desc">Selecione uma categoria abaixo e descreva rapidamente seu principal sintoma.</p>
            </div>

            {/* CATEGORIAS (apenas blocos coloridos) */}
            <div className="cat-grid">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  className={`cat-btn ${cat.color} ${selected === cat.key ? "is-selected" : ""}`}
                  onClick={() => handleSelect(cat.key)}
                  aria-pressed={selected === cat.key}
                >
                  <div className="cat-title">{cat.title}</div>
                  <div className="cat-desc">{cat.desc}</div>
                </button>
              ))}
            </div>

            {/* Caixa de texto obrigatória */}
            <div ref={bottomRef} className="symp-bottom">
              <label className="symp-label">
                Descreva brevemente o principal sintoma <span className="req">*</span>
              </label>
              <Textarea
                placeholder={currentPlaceholder}
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                aria-label="Descrever brevemente o sintoma"
              />
              <p className="hint">Exemplos: “dor de cabeça”, “vômitos”, “falta de ar”.</p>

              {error && (
                <div className="symp-error" role="alert">
                  {error}
                </div>
              )}

              <div className="symp-actions">
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting || !selected || !brief.trim()}
                  loading={submitting}
                >
                  Enviar Solicitação
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
