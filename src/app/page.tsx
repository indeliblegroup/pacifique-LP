import { Navbar } from "@/components/navbar";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Nuclei } from "@/components/sections/nuclei";
import { Team } from "@/components/sections/team";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero section - Plan 02 */}
        <Hero />

        {/* O que fazemos / Services - Plan 02 */}
        <Services />

        {/* Nucleos de Atuacao - Plan 02 */}
        <Nuclei />

        {/* Quem Somos / Team - Plan 02 */}
        <Team />

        {/* Fontes Normativas - will be replaced in Plan 03 */}
        <SectionWrapper id="fontes-normativas" variant="lavender">
          <h2 className="font-heading text-3xl font-bold text-primary">
            Fontes Normativas
          </h2>
          <p className="mt-4 text-text-body">
            Base legal que fundamenta a atuacao da PACIFIQUE!.
          </p>
        </SectionWrapper>

        {/* Vantagens - will be replaced in Plan 03 */}
        <SectionWrapper id="vantagens" variant="white">
          <h2 className="font-heading text-3xl font-bold text-primary">
            Vantagens do Credenciamento TJPE
          </h2>
          <p className="mt-4 text-text-body">
            Encaminhamento Judicial Direto, Credibilidade, Celeridade e Forca
            Executiva.
          </p>
        </SectionWrapper>

        {/* Como Funciona - will be replaced in Plan 03 */}
        <SectionWrapper id="como-funciona" variant="lavender">
          <h2 className="font-heading text-3xl font-bold text-primary">
            Como Funciona
          </h2>
          <p className="mt-4 text-text-body">
            Fase Inicial, Fase Procedimental e Resultados Possiveis.
          </p>
        </SectionWrapper>

        {/* Comparativo - will be replaced in Plan 03 */}
        <SectionWrapper id="comparativo" variant="white">
          <h2 className="font-heading text-3xl font-bold text-primary">
            Mediacao vs. Litigio
          </h2>
          <p className="mt-4 text-text-body">
            Compare as vantagens da mediacao frente ao processo judicial
            tradicional.
          </p>
        </SectionWrapper>

        {/* FAQ - will be replaced in Plan 04 */}
        <SectionWrapper id="faq" variant="lavender">
          <h2 className="font-heading text-3xl font-bold text-primary">
            Perguntas Frequentes
          </h2>
          <p className="mt-4 text-text-body">
            Tire suas duvidas sobre mediacao e conciliacao.
          </p>
        </SectionWrapper>

        {/* Contato / Footer - will be replaced in Plan 04 */}
        <SectionWrapper id="contato" variant="white">
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
