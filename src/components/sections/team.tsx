import { User } from "lucide-react";
import { TEAM_DATA } from "@/lib/constants";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Card } from "@/components/ui/card";

export function Team() {
  return (
    <SectionWrapper id="equipe" variant="white">
      <h2 className="text-center font-heading text-3xl font-bold text-primary">
        Quem Somos
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-text-body">
        Equipe fundadora comprometida com a excelencia na resolucao de conflitos
      </p>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {TEAM_DATA.map((member) => (
          <Card key={member.name} variant="team">
            {/* Avatar placeholder - accepts optional image prop in future */}
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 border-border-subtle bg-bg-lavender">
              <User className="h-10 w-10 text-primary" />
            </div>
            <h3 className="mt-4 font-heading text-lg font-semibold text-primary">
              {member.name}
            </h3>
            <p className="text-sm font-medium text-crimson-dark">
              {member.role}
            </p>
            <p className="mt-2 text-sm text-text-body">{member.bio}</p>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
}
