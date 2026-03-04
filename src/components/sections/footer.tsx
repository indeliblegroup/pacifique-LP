import { WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from "@/lib/constants";
import { Phone, Mail } from "lucide-react";

export function Footer() {
  const encodedMessage = encodeURIComponent(WHATSAPP_MESSAGE);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

  return (
    <footer id="contato" className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Column 1: Brand */}
          <div>
            <p className="font-heading text-2xl font-bold">PACIFIQUE!</p>
            <p className="mt-2 italic text-white/80">
              Nao complique, PACIFIQUE!
            </p>
            <p className="mt-2 text-sm text-white/70">
              Camara Privada de Conciliacao e Mediacao
            </p>
            <p className="mt-3 text-xs text-white/60">
              Credenciada CNJ (Res. 125/2010) | Credenciada TJPE (Res. 410/2018)
            </p>
          </div>

          {/* Column 2: Institutional */}
          <div>
            <h3 className="font-heading text-lg font-semibold">
              Informacoes Institucionais
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li>
                <span className="font-medium text-white/90">CNPJ:</span>{" "}
                65.218.388/0001-47
              </li>
              <li>
                <span className="font-medium text-white/90">Sede:</span>{" "}
                Recife/PE
              </li>
            </ul>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              <span className="cursor-default text-white/60">
                Politica de Privacidade (em breve)
              </span>
              <span className="cursor-default text-white/60">
                Termos de Uso (em breve)
              </span>
            </div>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="font-heading text-lg font-semibold">Contato</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white/80 transition-colors hover:text-white"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  <span>WhatsApp: (81) 98790-0892</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:contato@pacifique.com.br"
                  className="inline-flex items-center gap-2 text-white/80 transition-colors hover:text-white"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  <span>contato@pacifique.com.br</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-white/20 pt-8 text-center">
          <p className="text-sm text-white/70">
            &copy; 2025 PACIFIQUE! &mdash; Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}
