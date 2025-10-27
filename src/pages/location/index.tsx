/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useEffect, useMemo, useState } from "react";
import "./location.css";

import logo from "../../images/logo.png";
import { Header, Progress, Card, Select, Textarea, Button } from "../../UI";

// Fallback local enquanto o backend não está plugado
const FALLBACK_BLOCKS = ["Bloco A", "Bloco B", "Bloco C", "Biblioteca", "Quadras", "Refeitório"];

export default function LocationPage() {
  // Auth (carrega do login salvo)
  const auth = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("auth") || "{}"); }
    catch { return {}; }
  }, []);

  // Estado dos campos
  const [block, setBlock] = useState<string>("");
  const [extraInfo, setExtraInfo] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [blocks, setBlocks] = useState<string[]>(FALLBACK_BLOCKS);
  const [loadingBlocks, setLoadingBlocks] = useState(false);

  // >>> Progresso: 1 de 3
  const STEPS = 3;
  const STEP = 1;
  const progress = Math.round((STEP / STEPS) * 100); // 33%

  // >>> Pronto para backend: busca os blocos do servidor
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingBlocks(true);
        // const resp = await fetch("/api/blocks");
        // if (!resp.ok) throw new Error("Falha ao carregar blocos");
        // const data: string[] = await resp.json();
        // if (mounted && Array.isArray(data) && data.length) setBlocks(data);
      } catch {
        // mantém FALLBACK_BLOCKS
      } finally {
        mounted && setLoadingBlocks(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    // TODO: aqui você pode validar se "block" é obrigatório
    // Persiste o que precisar para a próxima etapa (opcional)
    localStorage.setItem("request.location", JSON.stringify({ block, extraInfo }));
    // Vai para Etapa 2: Quantidade de Pessoas
    window.location.hash = "/people";
  }

  function handleLogout() {
    localStorage.removeItem("auth");
    window.location.hash = "/login";
  }

  return (
    <div className="loc-page">
      <Header
        logoSrc={logo}
        logoSize={56}
        sectionTitle="Informar Localização"
        user={{ name: auth?.name || "Aluno Teste", ra: auth?.ra, role: auth?.role }}
        onLogout={handleLogout}
        onEmergencyClick={() => console.log("ligar 192")}
      />

      <main className="loc-main">
        <div className="loc-center">
          {/* Progresso do mesmo tamanho do card */}
          <div className="loc-progress">
            <Progress
              value={progress}
              leftLabel="Progresso"
              rightLabel={`Etapa ${STEP} de ${STEPS}`}
            />
          </div>

          <Card className="loc-card">
            <div className="loc-card__header">
              <div className="loc-card__title">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                  <path d="M12 2C8.1 2 5 5.1 5 9c0 5.3 7 13 7 13s7-7.7 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5 14.5 7.6 14.5 9 13.4 11.5 12 11.5z" fill="currentColor"/>
                </svg>
                <span>Onde você está?</span>
              </div>
              <p className="loc-card__desc">
                Selecione o bloco e informe sua localização específica para que possamos enviar ajuda rapidamente
              </p>
            </div>

            {/* Submit do formulário leva para /#/people */}
            <form onSubmit={handleNext} className="loc-form" noValidate>
              {/* Bloco */}
              <div className="loc-field">
                <label className="loc-label">
                  <span className="loc-label__icon" aria-hidden>
                    <svg width="18" height="18" viewBox="0 0 24 24"><path d="M3 11l9-9 9 9v9a2 2 0 01-2 2h-4v-7H9v7H5a2 2 0 01-2-2v-9z" fill="currentColor"/></svg>
                  </span>
                  <span>Selecione o bloco</span>
                </label>

                <Select<string>
                  value={block}
                  onChange={setBlock}
                  options={[
                    { value: "", label: loadingBlocks ? "Carregando blocos..." : "Escolha o bloco onde você está" },
                    ...blocks.map(b => ({ value: b, label: b })),
                  ]}
                  ariaLabel="Selecione o bloco"
                />
              </div>

              {/* Informações adicionais */}
              <div className="loc-field">
                <label className="loc-label">
                  <span className="loc-label__icon" aria-hidden>
                    <svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor"/></svg>
                  </span>
                  <span>Informações adicionais sobre sua localização</span>
                </label>
                <Textarea
                  placeholder="Ex: Sala 205, 2º andar, próximo à escada principal..."
                  value={extraInfo}
                  onChange={(e) => setExtraInfo(e.target.value)}
                  aria-label="Informações adicionais sobre sua localização"
                />
                <p className="loc-help">
                  Seja específico para facilitar a localização: número da sala, andar, pontos de referência próximos
                </p>
              </div>

              <div className="loc-actions">
                <Button type="submit">Próximo: Pessoas</Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
