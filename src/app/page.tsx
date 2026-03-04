import { Navbar } from "@/components/navbar";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { SectionWrapper } from "@/components/ui/section-wrapper";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero - will be replaced in Plan 02 */}
        <SectionWrapper id="hero" variant="white">
          <h1 className="font-heading text-4xl font-bold text-primary md:text-5xl">
            PACIFIQUE!
          </h1>
          <p className="mt-4 text-lg text-text-body">
            Camara Privada de Conciliacao e Mediacao
          </p>
          <p className="mt-2 text-text-body">
            Credenciada pelo CNJ e TJPE. Nao complique, PACIFIQUE!
          </p>
        </SectionWrapper>

        {/* Sobre / O que fazemos - will be replaced in Plan 02 */}
        <SectionWrapper id="sobre" variant="lavender">
          <h2 className="font-heading text-3xl font-bold text-primary">
            O que Fazemos
          </h2>
          <p className="mt-4 text-text-body">
            Conciliacao, Mediacao e Praticas Restaurativas para a resolucao
            pacifica de conflitos.
          </p>
        </SectionWrapper>

        {/* Nucleos de Atuacao - will be replaced in Plan 02 */}
        <SectionWrapper id="nucleos" variant="white">
          <h2 className="font-heading text-3xl font-bold text-primary">
            Nucleos de Atuacao
          </h2>
          <p className="mt-4 text-text-body">
            7 nucleos especializados para atender diferentes areas do direito.
          </p>
        </SectionWrapper>

        {/* Equipe - will be replaced in Plan 02 */}
        <SectionWrapper id="equipe" variant="lavender">
          <h2 className="font-heading text-3xl font-bold text-primary">
            Quem Somos
          </h2>
          <p className="mt-4 text-text-body">
            Equipe fundadora da PACIFIQUE! com experiencia em resolucao de
            conflitos.
          </p>
        </SectionWrapper>

        {/* Fontes Normativas - will be replaced in Plan 03 */}
        <SectionWrapper id="fontes-normativas" variant="white">
          <h2 className="font-heading text-3xl font-bold text-primary">
            Fontes Normativas
          </h2>
          <p className="mt-4 text-text-body">
            Base legal que fundamenta a atuacao da PACIFIQUE!.
          </p>
        </SectionWrapper>

        {/* Vantagens - will be replaced in Plan 03 */}
        <SectionWrapper id="vantagens" variant="lavender">
          <h2 className="font-heading text-3xl font-bold text-primary">
            Vantagens do Credenciamento TJPE
          </h2>
          <p className="mt-4 text-text-body">
            Encaminhamento Judicial Direto, Credibilidade, Celeridade e Forca
            Executiva.
          </p>
        </SectionWrapper>

        {/* Como Funciona - will be replaced in Plan 03 */}
        <SectionWrapper id="como-funciona" variant="white">
          <h2 className="font-heading text-3xl font-bold text-primary">
            Como Funciona
          </h2>
          <p className="mt-4 text-text-body">
            Fase Inicial, Fase Procedimental e Resultados Possiveis.
          </p>
        </SectionWrapper>

        {/* Comparativo - will be replaced in Plan 03 */}
        <SectionWrapper id="comparativo" variant="lavender">
          <h2 className="font-heading text-3xl font-bold text-primary">
            Mediacao vs. Litigio
          </h2>
          <p className="mt-4 text-text-body">
            Compare as vantagens da mediacao frente ao processo judicial
            tradicional.
          </p>
        </SectionWrapper>

        {/* FAQ - will be replaced in Plan 04 */}
        <SectionWrapper id="faq" variant="white">
          <h2 className="font-heading text-3xl font-bold text-primary">
            Perguntas Frequentes
          </h2>
          <p className="mt-4 text-text-body">
            Tire suas duvidas sobre mediacao e conciliacao.
          </p>
        </SectionWrapper>

        {/* Contato / Footer - will be replaced in Plan 04 */}
        <SectionWrapper id="contato" variant="lavender">
          <h2 className="font-heading text-3xl font-bold text-primary">
            Contato
          </h2>
          <p className="mt-4 text-text-body">
            CNPJ: 65.218.388/0001-47 | Recife/PE
          </p>
        </SectionWrapper>
      </main>

      {/* Footer placeholder - will be replaced in Plan 04 */}
      <footer className="bg-primary py-8 text-center text-white">
        <p className="font-heading text-lg font-bold">PACIFIQUE!</p>
        <p className="mt-2 text-sm text-white/80">
          Camara Privada de Conciliacao e Mediacao | CNPJ: 65.218.388/0001-47
        </p>
        <p className="mt-1 text-sm text-white/80">
          Recife/PE | Nao complique, PACIFIQUE!
        </p>
      </footer>

      <WhatsAppFab />
    </>
  );
}
