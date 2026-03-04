// ──────────────────────────────────────────────────────────────
// Shared data constants for PACIFIQUE! landing page
// ──────────────────────────────────────────────────────────────

// --- Type Definitions ---

export interface NavItem {
  label: string;
  href: string;
}

export interface NucleusItem {
  title: string;
  description: string;
  icon: string; // lucide-react icon name
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

// --- WhatsApp ---

export const WHATSAPP_NUMBER = "5581987900892";
export const WHATSAPP_MESSAGE =
  "Ola! Gostaria de saber mais sobre os servicos da PACIFIQUE!";

// --- Navigation ---

export const NAV_ITEMS: NavItem[] = [
  { label: "Sobre", href: "#sobre" },
  { label: "Nucleos", href: "#nucleos" },
  { label: "Equipe", href: "#equipe" },
  { label: "Fontes Normativas", href: "#fontes-normativas" },
  { label: "Vantagens", href: "#vantagens" },
  { label: "Como Funciona", href: "#como-funciona" },
  { label: "Comparativo", href: "#comparativo" },
  { label: "FAQ", href: "#faq" },
  { label: "Contato", href: "#contato" },
];

// --- Section IDs ---

export const SECTION_IDS = {
  sobre: "sobre",
  nucleos: "nucleos",
  equipe: "equipe",
  fontesNormativas: "fontes-normativas",
  vantagens: "vantagens",
  comoFunciona: "como-funciona",
  comparativo: "comparativo",
  faq: "faq",
  contato: "contato",
} as const;

// --- Nucleos de Atuacao ---

export const NUCLEI_DATA: NucleusItem[] = [
  {
    title: "Consumidor Aereo",
    description:
      "Cancelamentos, atrasos, extravio de bagagem, overbooking e reembolsos aereos.",
    icon: "Plane",
  },
  {
    title: "Consumidor Bancario",
    description:
      "Renegociacao de dividas, cobrancas indevidas e revisao de tarifas bancarias.",
    icon: "Landmark",
  },
  {
    title: "Direito de Saude",
    description:
      "Negativas de cobertura, reembolsos medicos e acesso a medicamentos.",
    icon: "Heart",
  },
  {
    title: "Direito de Familia",
    description:
      "Divorcios consensuais, guarda compartilhada, alimentos e regulamentacao de visitas.",
    icon: "Users",
  },
  {
    title: "Direito de Sucessoes",
    description:
      "Inventarios extrajudiciais, partilha amigavel e mediacao entre herdeiros.",
    icon: "Scale",
  },
  {
    title: "Praticas Restaurativas",
    description:
      "Conflitos penais transigiveis, comunitarios e escolares com foco na restauracao.",
    icon: "Handshake",
  },
  {
    title: "Demandas Empresariais Estrategicas",
    description:
      "Conflitos societarios, inadimplementos contratuais e processos de insolvencia.",
    icon: "Building",
  },
];

// --- Equipe Fundadora ---

export const TEAM_DATA: TeamMember[] = [
  {
    name: "Carlos Henrique Borges de Melo",
    role: "Advogado / Diretor Presidente",
    bio: "Advogado com experiencia em mediacao e conciliacao, liderando a PACIFIQUE! na missao de promover a resolucao pacifica de conflitos.",
  },
  {
    name: "Amanda Ledo",
    role: "Advogada / Conciliadora Responsavel",
    bio: "Advogada e conciliadora com dedicacao a solucao consensual de disputas, garantindo excelencia no atendimento.",
  },
  {
    name: "Rui Manuel Costa",
    role: "Diretor de Operacoes",
    bio: "Responsavel pela gestao operacional da camara, assegurando eficiencia e celeridade nos procedimentos.",
  },
  {
    name: "Icaro Sampaio",
    role: "Diretor de Tecnologia",
    bio: "Responsavel pela infraestrutura tecnologica e inovacao nos processos digitais da PACIFIQUE!.",
  },
];

// --- FAQ ---

export const FAQ_DATA: FaqItem[] = [
  {
    question: "O que e mediacao e como ela funciona?",
    answer:
      "A mediacao e um metodo de resolucao de conflitos em que um terceiro imparcial (mediador) facilita o dialogo entre as partes para que elas encontrem, juntas, uma solucao mutuamente satisfatoria. O processo e voluntario, confidencial e mais rapido que a via judicial.",
  },
  {
    question: "Qual a diferenca entre mediacao e conciliacao?",
    answer:
      "Na conciliacao, o conciliador pode sugerir solucoes para o conflito. Na mediacao, o mediador facilita a comunicacao para que as proprias partes construam o acordo. Ambos os metodos sao validos e reconhecidos pela legislacao brasileira.",
  },
  {
    question: "A PACIFIQUE! e credenciada junto a quais orgaos?",
    answer:
      "A PACIFIQUE! e uma Camara Privada de Conciliacao e Mediacao credenciada nos termos da Resolucao n. 125/2010 do CNJ e da Resolucao n. 410/2018 do TJPE, garantindo seguranca juridica e conformidade com as normas vigentes.",
  },
  {
    question: "O acordo firmado em mediacao tem validade juridica?",
    answer:
      "Sim. O Termo de Acordo firmado em mediacao tem forca de titulo executivo extrajudicial, conforme o art. 20 da Lei n. 13.140/2015 (Lei de Mediacao). Se homologado judicialmente, torna-se titulo executivo judicial.",
  },
  {
    question: "Quais tipos de conflitos podem ser mediados?",
    answer:
      "A PACIFIQUE! atua em diversas areas: conflitos de consumo (aereo e bancario), saude, familia, sucessoes, praticas restaurativas e demandas empresariais estrategicas. Em geral, conflitos que envolvam direitos disponiveis ou transacionaveis podem ser mediados.",
  },
  {
    question: "Quanto tempo leva o processo de mediacao?",
    answer:
      "O processo costuma ser significativamente mais rapido que a via judicial. Dependendo da complexidade do caso, a mediacao pode ser concluida em poucas semanas, enquanto processos judiciais podem levar anos.",
  },
  {
    question: "Como inicio o procedimento na PACIFIQUE!?",
    answer:
      "Voce pode entrar em contato pelo WhatsApp ou pelo formulario de contato em nosso site. Apos o contato inicial, enviaremos uma Carta Convite a outra parte e, havendo aceite, agendaremos as sessoes de mediacao ou conciliacao.",
  },
  {
    question: "O procedimento e sigiloso?",
    answer:
      "Sim. A confidencialidade e um dos principios fundamentais da mediacao, previsto na Lei n. 13.140/2015. Todas as informacoes compartilhadas durante as sessoes sao sigilosas e nao podem ser utilizadas em eventual processo judicial.",
  },
];
