import { Mail, CheckCircle, GraduationCap, FileCheck } from "lucide-react";
import { RECRUITMENT_EMAIL } from "@/lib/constants";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Card } from "@/components/ui/card";
import { IconCircle } from "@/components/ui/icon-circle";

export function JoinTeam() {
  const mailtoLink = `mailto:${RECRUITMENT_EMAIL}?subject=Candidatura - Mediador/Conciliador PACIFIQUE!&body=Prezados,%0D%0A%0D%0AGostaria de me candidatar para integrar o corpo de mediadores/conciliadores da PACIFIQUE!.%0D%0A%0D%0ASegue meu currículo em anexo.%0D%0A%0D%0AAtenciosamente,`;

  const requirements = [
    {
      icon: GraduationCap,
      title: "Formacao Academica",
      description:
        "Graduacao em curso superior reconhecido pelo MEC (conciliacao: a partir do 3º periodo; mediacao: formado ha pelo menos 2 anos)",
    },
    {
      icon: FileCheck,
      title: "Certificacao Obrigatoria",
      description:
        "Curso de formacao em mediacao ou conciliacao por instituicao credenciada, conforme Resolucao CNJ n. 125/2010",
    },
    {
      icon: CheckCircle,
      title: "Requisitos Pessoais",
      description:
        "Capacidade civil plena, idoneidade moral, compromisso com a confidencialidade e com os principios da mediacao",
    },
  ];

  const benefits = [
    "Integracao a uma camara credenciada pelo CNJ e TJPE",
    "Atuacao em diversas areas tematicas (consumidor, familia, saude, empresarial)",
    "Desenvolvimento profissional continuo em resolucao de conflitos",
    "Participacao em uma rede de profissionais qualificados",
  ];

  return (
    <SectionWrapper id="seja-mediador" variant="lavender">
      <div className="text-center">
        <h2 className="font-heading text-3xl font-bold text-primary">
          Seja um Mediador/Conciliador PACIFIQUE!
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-text-body">
          Junte-se a nossa equipe de profissionais dedicados a resolucao
          pacifica de conflitos. Estamos sempre em busca de mediadores e
          conciliadores qualificados para ampliar nosso corpo tecnico.
        </p>
      </div>

      {/* Requisitos */}
      <div className="mt-12">
        <h3 className="mb-8 text-center font-heading text-2xl font-semibold text-primary">
          Requisitos para Integracao
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {requirements.map((req) => (
            <Card key={req.title} variant="nucleus">
              <IconCircle icon={req.icon} />
              <h4 className="mt-4 font-heading text-lg font-semibold text-primary">
                {req.title}
              </h4>
              <p className="mt-2 text-sm text-text-body">{req.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Beneficios */}
      <div className="mt-12">
        <h3 className="mb-6 text-center font-heading text-2xl font-semibold text-primary">
          Por Que Fazer Parte da PACIFIQUE!
        </h3>
        <div className="mx-auto max-w-2xl">
          <ul className="space-y-3">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                <span className="text-text-body">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <p className="mb-6 text-text-body">
          Preencha os requisitos acima? Envie seu curriculo para nossa
          equipe de selecao.
        </p>
        <a
          href={mailtoLink}
          className="inline-flex items-center gap-2 rounded-md border-2 border-primary bg-transparent px-8 py-3 font-medium text-primary transition-all hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <Mail className="h-5 w-5" />
          Enviar Curriculo
        </a>
        <p className="mt-4 text-sm text-text-body">
          Email: <span className="font-medium">{RECRUITMENT_EMAIL}</span>
        </p>
      </div>
    </SectionWrapper>
  );
}
