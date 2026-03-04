import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section id="inicio" className="bg-white pb-16 pt-24 md:pb-24 md:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text content */}
          <div>
            <h1 className="font-heading font-bold text-primary">
              <span className="block text-2xl sm:text-3xl lg:text-4xl">
                Nao complique,
              </span>
              <span className="mt-2 block text-5xl sm:text-6xl lg:text-7xl">
                PACIFIQUE!
              </span>
            </h1>

            <p className="mt-6 text-lg text-text-body sm:text-xl">
              Camara Privada de Conciliacao e Mediacao
            </p>

            <p className="mt-3 max-w-lg text-text-body">
              Resolucao pacifica de conflitos com excelencia, seguranca juridica
              e celeridade.
            </p>

            {/* Credential badges */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Badge variant="outline">Credenciada CNJ - Res. 125/2010</Badge>
              <Badge variant="outline">Credenciada TJPE - Res. 410/2018</Badge>
            </div>

            <p className="mt-4 text-sm text-text-body">Sediada em Recife/PE</p>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#sobre"
                className="inline-block rounded-lg border border-primary px-6 py-3 text-center font-medium text-primary transition-colors hover:bg-primary hover:text-white"
              >
                Conheca nossos servicos
              </a>
              <a
                href="#contato"
                className="inline-block rounded-lg border border-primary px-6 py-3 text-center font-medium text-primary transition-colors hover:bg-primary hover:text-white"
              >
                Fale conosco
              </a>
            </div>
          </div>

          {/* Illustration placeholder */}
          <div className="flex items-center justify-center">
            <div className="flex h-64 w-full items-center justify-center rounded-lg border-2 border-dashed border-border-subtle text-text-body sm:h-80 lg:h-96">
              <span className="text-lg">Ilustracao</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
