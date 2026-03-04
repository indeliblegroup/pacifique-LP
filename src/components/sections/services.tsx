import { Handshake, Scale, Heart } from "lucide-react";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Card } from "@/components/ui/card";
import { IconCircle } from "@/components/ui/icon-circle";

const SERVICES = [
  {
    title: "Conciliacao",
    description:
      "Procedimento onde um conciliador facilita o dialogo entre as partes, sugerindo solucoes para o conflito de forma agil e informal.",
    icon: Handshake,
  },
  {
    title: "Mediacao",
    description:
      "Processo onde um mediador neutro auxilia as partes a construirem, elas mesmas, a solucao para o conflito, preservando relacionamentos.",
    icon: Scale,
  },
  {
    title: "Praticas Restaurativas",
    description:
      "Abordagem que busca a reparacao do dano e a restauracao das relacoes, envolvendo todas as partes afetadas pelo conflito.",
    icon: Heart,
  },
] as const;

export function Services() {
  return (
    <SectionWrapper id="sobre" variant="white">
      <h2 className="text-center font-heading text-3xl font-bold text-primary">
        O que fazemos
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-text-body">
        A PACIFIQUE! oferece metodos consensuais de resolucao de conflitos,
        promovendo o dialogo e a construcao conjunta de solucoes com seguranca
        juridica.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        {SERVICES.map((service) => {
          const Icon = service.icon;
          return (
            <Card key={service.title} variant="default">
              <div className="mb-4">
                <IconCircle>
                  <Icon className="h-6 w-6" />
                </IconCircle>
              </div>
              <h3 className="font-heading text-xl font-semibold text-primary">
                {service.title}
              </h3>
              <p className="mt-2 text-text-body">{service.description}</p>
            </Card>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
