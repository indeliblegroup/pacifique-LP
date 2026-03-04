import { SectionWrapper } from "@/components/ui/section-wrapper";
import { ArrowRight, ShieldCheck, Clock, FileCheck } from "lucide-react";

const ADVANTAGES = [
  {
    icon: ArrowRight,
    title: "Encaminhamento Judicial Direto",
    description:
      "Processos judiciais podem ser encaminhados diretamente pelo tribunal para a nossa camara, garantindo fluxo continuo de demandas.",
  },
  {
    icon: ShieldCheck,
    title: "Credibilidade Institucional",
    description:
      "O credenciamento pelo TJPE atesta o cumprimento de rigorosos requisitos de qualidade, etica e transparencia.",
  },
  {
    icon: Clock,
    title: "Celeridade Processual",
    description:
      "Procedimentos concluidos em semanas, nao meses ou anos. A agilidade e uma das principais vantagens da via extrajudicial.",
  },
  {
    icon: FileCheck,
    title: "Forca Executiva",
    description:
      "O acordo homologado tem forca de titulo executivo extrajudicial (art. 20, Lei 13.140/2015), dispensando nova acao judicial.",
  },
];

export function Advantages() {
  return (
    <SectionWrapper id="vantagens" variant="white">
      <h2 className="text-center font-heading text-3xl font-bold text-primary">
        Vantagens do Credenciamento junto ao TJPE
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-text-body">
        Por que escolher uma camara credenciada pelo Tribunal de Justica?
      </p>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
        {ADVANTAGES.map((advantage) => {
          const Icon = advantage.icon;
          return (
            <div
              key={advantage.title}
              className="rounded-lg border border-border-subtle bg-white p-6"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-crimson-dark">
                <Icon
                  className="h-6 w-6 text-white"
                  aria-hidden="true"
                />
              </div>
              <h3 className="font-heading text-lg font-semibold text-primary">
                {advantage.title}
              </h3>
              <p className="mt-2 leading-relaxed text-text-body">
                {advantage.description}
              </p>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
