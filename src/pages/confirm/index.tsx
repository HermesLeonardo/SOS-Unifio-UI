import React, { useMemo, useState } from "react";
import "./confirm.css";

import logo from "../../images/logo.png";
import { Header, Card, Button, Progress } from "../../UI";

export default function ConfirmPage() {
  const auth = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("auth") || "{}"); }
    catch { return {}; }
  }, []);

  const req = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("request.full") || "{}"); }
    catch { return {}; }
  }, []);

  const [going, setGoing] = useState(false);

  function seedStatusDefaults() {
    // protocolo
    if (!localStorage.getItem("request.protocol")) {
      const stamp = Date.now().toString(36).toUpperCase().slice(-6);
      localStorage.setItem("request.protocol", `EMG-${stamp}`);
    }
    // início do chamado
    if (!localStorage.getItem("request.startedAt")) {
      localStorage.setItem("request.startedAt", new Date().toISOString());
    }
    // estágio inicial (usado na tela de status)
    localStorage.setItem("request.stage", "received");
  }

  function handleTrack() {
    setGoing(true);
    seedStatusDefaults();
    window.location.hash = "/status";
  }

  function handleLogout() {
    localStorage.removeItem("auth");
    window.location.hash = "/login";
  }

  return (
    <div className="conf-page">
      <Header
        logoSrc={logo}
        logoSize={56}
        sectionTitle="Solicitação de Atendimento Médico"
        user={{ name: auth?.name || "Aluno Teste", ra: auth?.ra, role: auth?.role }}
        onLogout={handleLogout}
        onEmergencyClick={() => console.log("ligar 192")}
      />

      <main className="conf-main">
        <div className="conf-center">
          {/* Barra de progresso (100%) */}
          <div className="conf-progress">
            <Progress value={100} leftLabel="Progresso da Solicitação" rightLabel="Etapa 3 de 3" />
          </div>

          <Card className="conf-card">
            <div className="conf-icon" aria-hidden>
              <svg viewBox="0 0 24 24" width="54" height="54">
                <circle cx="12" cy="12" r="11" fill="#E6FBEA" />
                <path d="M9.5 12.8l-2-2-1.4 1.4 3.4 3.4 6-6-1.4-1.4z" fill="#16A34A" />
              </svg>
            </div>

            <h1 className="conf-title">Chamado Enviado com Sucesso!</h1>
            <p className="conf-subtitle">Nossa equipe médica foi notificada e está a caminho.</p>

            <div className="conf-alert" role="status" aria-live="polite">
              <div className="conf-alert__title">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                  <path d="M12 2a10 10 0 1010 10A10.011 10.011 0 0012 2zm-1 15l-4-4 1.41-1.41L11 13.17l4.59-4.59L17 10z" fill="currentColor" />
                </svg>
                <strong>Equipe médica notificada com sucesso</strong>
              </div>
              <p className="conf-alert__desc">
                Permaneça no local informado e mantenha a calma. Nossa equipe chegará em breve para te atender.
              </p>
            </div>

            <div className="conf-actions">
              <Button
                type="button"
                onClick={handleTrack}
                disabled={going}
                loading={going}  /* se o seu <Button> suportar loading */
              >
                Acompanhar Status do Chamado
              </Button>
            </div>

            {"id" in req && req.id && (
              <p className="conf-id">
                Protocolo: <strong>{String(req.id)}</strong>
              </p>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
