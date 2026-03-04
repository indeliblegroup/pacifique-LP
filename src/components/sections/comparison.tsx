import { SectionWrapper } from "@/components/ui/section-wrapper";
import { CheckCircle, MinusCircle } from "lucide-react";

const COMPARISON_ROWS = [
  {
    criterion: "Velocidade",
    mediation: "Semanas a poucos meses",
    litigation: "Meses a anos (media de 3-5 anos no Judiciario)",
  },
  {
    criterion: "Custo",
    mediation: "Significativamente menor",
    litigation: "Custas processuais, honorarios, pericias",
  },
  {
    criterion: "Resultado",
    mediation: "Solucao construida pelas partes (ganha-ganha)",
    litigation: "Decisao imposta pelo juiz (ganha-perde)",
  },
  {
    criterion: "Validade Juridica",
    mediation: "Titulo executivo extrajudicial (Lei 13.140/2015)",
    litigation: "Sentenca judicial",
  },
];

export function Comparison() {
  return (
    <SectionWrapper id="comparativo" variant="white">
      <h2 className="text-center font-heading text-3xl font-bold text-primary">
        Mediacao vs. Litigio Tradicional
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-text-body">
        Compare as vantagens da resolucao consensual
      </p>

      {/* Desktop: side-by-side columns | Mobile: stacked cards per criterion */}
      <div className="mt-12">
        {/* Column headers - visible on lg+ */}
        <div className="hidden gap-8 lg:grid lg:grid-cols-[1fr_1fr_1fr]">
          <div className="pb-4">
            <span className="font-heading text-sm font-semibold uppercase tracking-wide text-text-body">
              Criterio
            </span>
          </div>
          <div className="rounded-t-lg bg-rose-light px-6 pb-4 pt-4">
            <span className="font-heading text-sm font-semibold uppercase tracking-wide text-primary">
              Mediacao / Conciliacao
            </span>
          </div>
          <div className="rounded-t-lg border border-b-0 border-border-subtle bg-white px-6 pb-4 pt-4">
            <span className="font-heading text-sm font-semibold uppercase tracking-wide text-text-body">
              Litigio Tradicional
            </span>
          </div>
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-4 lg:gap-0">
          {COMPARISON_ROWS.map((row, index) => {
            const isLast = index === COMPARISON_ROWS.length - 1;
            return (
              <div key={row.criterion}>
                {/* Mobile: card layout */}
                <div className="rounded-lg border border-border-subtle p-4 lg:hidden">
                  <h3 className="mb-3 font-heading text-base font-semibold text-primary">
                    {row.criterion}
                  </h3>
                  <div className="flex flex-col gap-3">
                    <div className="rounded-md bg-rose-light p-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle
                          className="mt-0.5 h-4 w-4 shrink-0 text-success"
                          aria-hidden="true"
                        />
                        <div>
                          <span className="text-xs font-medium uppercase tracking-wide text-primary">
                            Mediacao
                          </span>
                          <p className="mt-1 text-sm text-text-body">
                            {row.mediation}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-md border border-border-subtle bg-white p-3">
                      <div className="flex items-start gap-2">
                        <MinusCircle
                          className="mt-0.5 h-4 w-4 shrink-0 text-text-body/50"
                          aria-hidden="true"
                        />
                        <div>
                          <span className="text-xs font-medium uppercase tracking-wide text-text-body">
                            Litigio
                          </span>
                          <p className="mt-1 text-sm text-text-body">
                            {row.litigation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop: table-like row */}
                <div
                  className={`hidden gap-8 border-b border-border-subtle lg:grid lg:grid-cols-[1fr_1fr_1fr] ${
                    isLast ? "border-b-0" : ""
                  }`}
                >
                  <div className="flex items-center py-4">
                    <span className="font-heading text-base font-semibold text-primary">
                      {row.criterion}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-rose-light px-6 py-4">
                    <CheckCircle
                      className="h-4 w-4 shrink-0 text-success"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-text-body">
                      {row.mediation}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 border-x border-border-subtle bg-white px-6 py-4">
                    <MinusCircle
                      className="h-4 w-4 shrink-0 text-text-body/50"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-text-body">
                      {row.litigation}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
