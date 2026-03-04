import { Navbar } from "@/components/navbar";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Nuclei } from "@/components/sections/nuclei";
import { Team } from "@/components/sections/team";
import { LegalSources } from "@/components/sections/legal-sources";
import { Advantages } from "@/components/sections/advantages";
import { ProcessFlow } from "@/components/sections/process-flow";
import { Comparison } from "@/components/sections/comparison";

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

        {/* Fontes Normativas - Plan 03 */}
        <LegalSources />

        {/* Vantagens do Credenciamento TJPE - Plan 03 */}
        <Advantages />

        {/* Como Funciona (Process Flowchart) - Plan 03 */}
        <ProcessFlow />

        {/* Comparativo Mediacao vs Litigio - Plan 03 */}
        <Comparison />

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
