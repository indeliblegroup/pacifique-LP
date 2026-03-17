import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { Team } from "@/components/sections/team";
import { Footer } from "@/components/sections/footer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nossa Equipe - PACIFIQUE!",
  description:
    "Conheça a equipe fundadora da PACIFIQUE! - Câmara Privada de Conciliação e Mediação em Recife/PE.",
};

export default function EquipePage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Breadcrumb / Back button */}
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-primary transition-colors hover:text-crimson-dark"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para página inicial
          </Link>
        </div>

        <Team />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
