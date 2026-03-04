import { SectionWrapper } from "@/components/ui/section-wrapper";
import { ChevronRight, ChevronDown, CheckCircle, XCircle } from "lucide-react";

/* ── Phase Data ── */

const FASE_INICIAL = [
  {
    step: 1,
    title: "Termos e Condicoes de Uso",
    description:
      "Regras gerais, direitos e deveres, honorarios, clausula de boa-fe",
  },
  {
    step: 2,
    title: "Politica de Privacidade",
    description:
      "LGPD, confidencialidade, direitos dos titulares",
  },
  {
    step: 3,
    title: "Regulamento Interno",
    description:
      "Procedimentos, normas eticas, prazos, ouvidoria",
  },
];

const FASE_PROCEDIMENTAL = [
  {
    step: 1,
    title: "Carta Convite",
    description:
      "Convite formal a parte requerida (prazo: 30 dias para resposta)",
  },
  {
    step: 2,
    title: "Entrevistas Preliminares (Caucus)",
    description:
      "Sessoes individuais e confidenciais com cada parte",
  },
  {
    step: 3,
    title: "Instalacao da Sessao",
    description:
      "Sessao conjunta, preferencialmente remota (art. 46, Lei 13.140/2015)",
  },
];

/* ── Sub-components ── */

function StepCard({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-lg bg-rose-light p-4">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-crimson-dark text-sm font-bold text-white">
        {step}
      </span>
      <div>
        <h4 className="font-heading text-sm font-semibold text-primary">
          {title}
        </h4>
        <p className="mt-1 text-sm leading-relaxed text-text-body">
          {description}
        </p>
      </div>
    </div>
  );
}

function PhaseBlock({
  title,
  steps,
}: {
  title: string;
  steps: typeof FASE_INICIAL;
}) {
  return (
    <div className="flex-1">
      <h3 className="mb-4 font-heading text-base font-semibold text-primary">
        {title}
      </h3>
      <div className="flex flex-col gap-3">
        {steps.map((s) => (
          <StepCard key={s.step} {...s} />
        ))}
      </div>
    </div>
  );
}

function PhaseConnector() {
  return (
    <>
      {/* Desktop: horizontal arrow */}
      <div className="hidden shrink-0 items-center lg:flex">
        <div className="h-0.5 w-8 bg-gradient-to-r from-rose-medium to-primary" />
        <ChevronRight
          className="h-6 w-6 text-primary"
          aria-hidden="true"
        />
      </div>
      {/* Mobile: vertical arrow */}
      <div className="flex items-center justify-center lg:hidden">
        <div className="flex flex-col items-center">
          <div className="h-8 w-0.5 bg-gradient-to-b from-rose-medium to-primary" />
          <ChevronDown
            className="h-6 w-6 text-primary"
            aria-hidden="true"
          />
        </div>
      </div>
    </>
  );
}

/* ── Main Component ── */

export function ProcessFlow() {
  return (
    <SectionWrapper id="como-funciona" variant="lavender">
      <h2 className="text-center font-heading text-3xl font-bold text-primary">
        Como Funciona
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-text-body">
        Nosso procedimento segue as melhores praticas nacionais
      </p>

      {/* Flowchart: vertical on mobile, horizontal on desktop */}
      <div className="mt-12 flex flex-col items-stretch gap-8 lg:flex-row lg:items-start lg:gap-4">
        {/* Fase Inicial */}
        <PhaseBlock
          title="Fase Inicial — Documentos Obrigatorios"
          steps={FASE_INICIAL}
        />

        {/* Connector */}
        <PhaseConnector />

        {/* Fase Procedimental */}
        <PhaseBlock
          title="Fase Procedimental"
          steps={FASE_PROCEDIMENTAL}
        />

        {/* Connector */}
        <PhaseConnector />

        {/* Resultados Possiveis */}
        <div className="flex-1">
          <h3 className="mb-4 font-heading text-base font-semibold text-primary">
            Resultados Possiveis
          </h3>
          <div className="flex flex-col gap-3">
            {/* Acordo Homologado */}
            <div className="rounded-lg border border-success bg-success/10 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle
                  className="mt-0.5 h-5 w-5 shrink-0 text-success"
                  aria-hidden="true"
                />
                <div>
                  <h4 className="font-heading text-sm font-semibold text-primary">
                    Acordo Homologado
                  </h4>
                  <p className="mt-1 text-sm leading-relaxed text-text-body">
                    Termo de Acordo com forca de titulo executivo extrajudicial
                    (art. 20, Lei 13.140/2015)
                  </p>
                </div>
              </div>
            </div>

            {/* Termo Negativo */}
            <div className="rounded-lg border border-error bg-error/10 p-4">
              <div className="flex items-start gap-3">
                <XCircle
                  className="mt-0.5 h-5 w-5 shrink-0 text-error"
                  aria-hidden="true"
                />
                <div>
                  <h4 className="font-heading text-sm font-semibold text-primary">
                    Termo Negativo
                  </h4>
                  <p className="mt-1 text-sm leading-relaxed text-text-body">
                    Certidao de tentativa de autocomposicao (art. 334, CPC/2015)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
