import { Navbar } from "@/components/navbar";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Nuclei } from "@/components/sections/nuclei";
import { Team } from "@/components/sections/team";
import { LegalSources } from "@/components/sections/legal-sources";
import { Advantages } from "@/components/sections/advantages";
import { ProcessFlow } from "@/components/sections/process-flow";
import { Comparison } from "@/components/sections/comparison";
import { Faq } from "@/components/sections/faq";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <Hero />
        <Services />
        <Nuclei />
        <Team />
        <LegalSources />
        <Advantages />
        <ProcessFlow />
        <Comparison />
        <Faq />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
