import {
  Plane,
  Landmark,
  Heart,
  Users,
  Scale,
  Handshake,
  Building,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { NUCLEI_DATA } from "@/lib/constants";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Card } from "@/components/ui/card";
import { IconCircle } from "@/components/ui/icon-circle";

const ICON_MAP: Record<string, LucideIcon> = {
  Plane,
  Landmark,
  Heart,
  Users,
  Scale,
  Handshake,
  Building,
};

export function Nuclei() {
  return (
    <SectionWrapper id="nucleos" variant="lavender">
      <h2 className="text-center font-heading text-3xl font-bold text-primary">
        Nucleos de Atuacao
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-text-body">
        Atuamos em areas estrategicas para oferecer solucoes especializadas
      </p>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {NUCLEI_DATA.map((nucleus) => {
          const Icon = ICON_MAP[nucleus.icon];
          return (
            <Card key={nucleus.title} variant="nucleus">
              <div className="mb-3">
                <IconCircle>
                  {Icon ? (
                    <Icon className="h-6 w-6" />
                  ) : (
                    <span className="text-xs">{nucleus.icon}</span>
                  )}
                </IconCircle>
              </div>
              <h3 className="font-semibold text-primary text-lg">
                {nucleus.title}
              </h3>
              <p className="mt-1 text-sm text-text-body">
                {nucleus.description}
              </p>
            </Card>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
