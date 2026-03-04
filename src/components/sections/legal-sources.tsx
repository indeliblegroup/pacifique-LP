import { SectionWrapper } from "@/components/ui/section-wrapper";
import { BookOpen, Landmark, Scale, Gavel } from "lucide-react";

const LEGAL_SOURCES = [
  {
    icon: BookOpen,
    citation: "Resolucao n. 125/2010 do CNJ",
    title: "Politica Judiciaria Nacional",
    description:
      "Politica de tratamento adequado dos conflitos de interesses no ambito do Poder Judiciario.",
  },
  {
    icon: Landmark,
    citation: "Resolucao n. 410/2018 do TJPE",
    title: "Credenciamento em Pernambuco",
    description:
      "Credenciamento e fiscalizacao de camaras privadas de conciliacao e mediacao no Estado de Pernambuco.",
  },
  {
    icon: Scale,
    citation: "Lei n. 13.140/2015",
    title: "Lei de Mediacao",
    description:
      "Dispoe sobre a mediacao entre particulares como meio de solucao de controversias e sobre a autocomposicao de conflitos.",
  },
  {
    icon: Gavel,
    citation: "CPC/2015 (Lei n. 13.105/2015), art. 3, par. 2 e 3",
    title: "Principio da Autocomposicao",
    description:
      "O Estado promovera, sempre que possivel, a solucao consensual dos conflitos.",
  },
];

export function LegalSources() {
  return (
    <SectionWrapper id="fontes-normativas" variant="lavender">
      <h2 className="text-center font-heading text-3xl font-bold text-primary">
        Fontes Normativas
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-text-body">
        Nossa atuacao e fundamentada em solido arcabouco juridico
      </p>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {LEGAL_SOURCES.map((source) => {
          const Icon = source.icon;
          return (
            <div
              key={source.citation}
              className="rounded-lg bg-accent-deep p-6 text-accent-deep-text"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <Icon className="h-6 w-6 text-white/80" aria-hidden="true" />
              </div>
              <p className="text-sm font-medium text-white/70">
                {source.citation}
              </p>
              <h3 className="mt-2 font-heading text-lg font-semibold">
                {source.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                {source.description}
              </p>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
