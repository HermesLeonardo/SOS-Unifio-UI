import React, { useEffect, useMemo, useState } from "react";
import "./status.css";

import logo from "../../images/logo.png";
import { Header, Card, Button, Progress, Textarea } from "../../UI";

/** Estados do fluxo */
type Stage = "received" | "accepted" | "concluded";
const STAGE_PCT: Record<Stage, number> = { received: 33, accepted: 66, concluded: 100 };

/** Helpers (mock até o backend assumir) */
function ensureProtocol(): string {
  let p = localStorage.getItem("request.protocol");
  if (!p) {
    const stamp = Date.now().toString(36).toUpperCase().slice(-6);
    p = `EMG-${stamp}`;
    localStorage.setItem("request.protocol", p);
  }
  return p;
}
function ensureStartedAt(): string {
  let v = localStorage.getItem("request.startedAt");
  if (!v) {
    v = new Date().toISOString();
    localStorage.setItem("request.startedAt", v);
  }
  return v;
}
function timeOfDay(iso: string) {
  try { return new Date(iso).toLocaleTimeString("pt-BR", { hour12: false }); }
  catch { return "—"; }
}
function elapsed(fromISO: string, nowMs: number) {
  const start = new Date(fromISO).getTime();
  if (!Number.isFinite(start)) return "—";
  const ms = Math.max(0, nowMs - start);
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  if (h) return `${h}h ${m}min`;
  if (m) return `${m} minutos`;
  return `${ss} segundos`;
}

export default function StatusPage() {
  // usuário (mock)
  const auth = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("auth") || "{}"); }
    catch { return {}; }
  }, []);

  // payload salvo nas etapas anteriores
  const full = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("request.full") || "{}"); }
    catch { return {}; }
  }, []);

  // relógio / etapa
  const [stage] = useState<Stage>(() => (localStorage.getItem("request.stage") as Stage) || "received");
  const [startedAt] = useState<string>(() => ensureStartedAt());
  const [now, setNow] = useState<number>(Date.now());
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);

  const protocol = useMemo(() => ensureProtocol(), []);
  const progress = STAGE_PCT[stage];
  const elapsedStr = elapsed(startedAt, now);
  const requester = auth?.name || (auth?.ra ? `RA ${auth.ra}` : "—");

  /** Assistente – UI pronta p/ backend */
  const [chatOpen, setChatOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Array<{role:"user"|"assistant"; text:string}>>([
    { role: "assistant", text: "Olá! Sou o Assistente Médico. Posso te orientar enquanto aguarda o socorro." }
  ]);

  function toggleChat() { setChatOpen(v => !v); }
  async function sendMsg() {
    const txt = input.trim();
    if (!txt) return;
    setSending(true);
    setMessages(p => [...p, { role: "user", text: txt }]);
    setInput("");
    setTimeout(() => {
      setMessages(p => [...p, { role: "assistant", text: "Entendido. Em breve nossa equipe chegará. Se piorar, ligue 192." }]);
      setSending(false);
    }, 600);
  }

  return (
    <div className="st-page">
      <Header
        logoSrc={logo}
        logoSize={56}
        sectionTitle={`Status do Atendimento • Protocolo: ${protocol}`}
        user={{ name: auth?.name || "Aluno", ra: auth?.ra, role: auth?.role }}
        onLogout={() => { localStorage.removeItem("auth"); window.location.hash = "/login"; }}
        onEmergencyClick={() => console.log("ligar 192")}
      />

      <main className="st-main">
        {/* GRID de duas colunas */}
        <div className="st-shell">
          {/* ESQUERDA */}
          <section className="st-left">
            <Card className="st-card">
              <header className="st-card-head">
                <h2>Status Atual</h2>
                <div className="st-pills">
                  <span className="pill pill-red">EMERGÊNCIA</span>
                  <span className="pill pill-blue">
                    {stage === "received" ? "Chamado Recebido" : stage === "accepted" ? "Chamado Aceito" : "Chamado Concluído"}
                  </span>
                </div>
              </header>

              <div className="st-progress">
                <Progress value={progress} leftLabel="Progresso do Atendimento" rightLabel={`${progress}%`} />
              </div>

              <ol className="st-steps" aria-label="Etapas do chamado">
                <li className={`st-step ${stage !== "received" ? "done" : "current"}`}>
                  <span className="st-bullet" aria-hidden>1</span>
                  <div className="st-step-content">
                    <div className="st-step-title">
                      Chamado Recebido {stage !== "received" && <span className="chip">Concluído</span>}
                    </div>
                    <p className="st-step-desc">Sua solicitação foi recebida pelo sistema</p>
                  </div>
                </li>
                <li className={`st-step ${stage === "concluded" ? "done" : stage === "accepted" ? "current" : ""}`}>
                  <span className="st-bullet" aria-hidden>2</span>
                  <div className="st-step-content">
                    <div className="st-step-title">Chamado Aceito</div>
                    <p className="st-step-desc">Socorrista designado e a caminho</p>
                  </div>
                </li>
                <li className={`st-step ${stage === "concluded" ? "done" : ""}`}>
                  <span className="st-bullet" aria-hidden>3</span>
                  <div className="st-step-content">
                    <div className="st-step-title">Chamado Concluído</div>
                    <p className="st-step-desc">Atendimento finalizado com sucesso</p>
                  </div>
                </li>
              </ol>
            </Card>

            <Card className="st-card">
              <h3 className="st-block-title">Informações do Chamado</h3>
              <div className="st-info-grid">
                <div className="st-info-item"><span className="st-info-label">Prioridade:</span><span className="st-info-value"><span className="badge-critical">CRÍTICA</span></span></div>
                <div className="st-info-item"><span className="st-info-label">Hora do Chamado:</span><span className="st-info-value">{timeOfDay(startedAt)}</span></div>
                <div className="st-info-item"><span className="st-info-label">Local:</span><span className="st-info-value">{full?.location?.block || "—"}</span></div>
                <div className="st-info-item"><span className="st-info-label">Tempo Decorrido:</span><span className="st-info-value">{elapsedStr}</span></div>
                <div className="st-info-item"><span className="st-info-label">Solicitante:</span><span className="st-info-value">{requester}</span></div>
                <div className="st-info-item">
                  <span className="st-info-label">Situação:</span>
                  <span className="st-info-value">
                    {stage === "received" && "Aguardando designação de socorrista"}
                    {stage === "accepted" && "Socorrista a caminho"}
                    {stage === "concluded" && "Concluído"}
                  </span>
                </div>
              </div>

              <div className="st-mini-block">
                <div className="st-mini-title">Sintomas Relatados</div>
                <div className="st-mini-body">{full?.symptoms?.brief || "—"}</div>
              </div>

              <div className="st-mini-block">
                <div className="st-mini-title">Descrição Adicional</div>
                <div className="st-mini-body">{full?.extra || full?.location?.extraInfo || "—"}</div>
              </div>
            </Card>

            <Card className="st-card">
              <h3 className="st-block-title">Instruções Importantes</h3>
              <ul className="st-tips">
                <li>Mantenha-se no local informado até a chegada do socorrista.</li>
                <li>Deixe o telefone disponível para contato.</li>
                <li>Se os sintomas piorarem, use o Assistente Médico ou ligue 192.</li>
                <li>Você receberá notificações em tempo real sobre o andamento.</li>
              </ul>
            </Card>
          </section>

          {/* DIREITA (offset +30px) */}
          <aside className="st-right st-right--offset" aria-label="Assistente Médico">
            <Card className="st-card st-assist">
              <header className="assist-head">
                <div className="assist-icon" aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="M12 3a9 9 0 100 18 9 9 0 000-18zm1 14h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
                  </svg>
                </div>
                <div>
                  <h3>Assistente Médico</h3>
                  <p className="assist-sub">Orientações personalizadas enquanto aguarda atendimento.</p>
                </div>
              </header>

              <ul className="assist-bullets">
                <li>IA especializada em emergências</li>
                <li>Instruções de primeiros socorros</li>
                <li>Disponível 24/7</li>
              </ul>

              <Button type="button" onClick={toggleChat}>
                {chatOpen ? "Fechar Conversa" : "Iniciar Conversa"}
              </Button>

              <div className={`assist-chat ${chatOpen ? "open" : ""}`} aria-hidden={!chatOpen}>
                <div className="chat-box" role="log" aria-live="polite">
                  {messages.map((m, i) => (
                    <div key={i} className={`msg ${m.role}`}>{m.text}</div>
                  ))}
                  {sending && <div className="msg assistant">Digitando…</div>}
                </div>

                <div className="chat-input">
                  <Textarea
                    placeholder="Descreva o que sente agora…"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <Button type="button" onClick={sendMsg} disabled={!input.trim() || sending}>
                    Enviar
                  </Button>
                </div>

                <p className="chat-disclaimer">* Protótipo pronto para integração com o backend.</p>
              </div>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
