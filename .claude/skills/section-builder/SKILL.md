---
name: section-builder
description: Cria nova secao da landing page seguindo as convencoes do projeto (SectionWrapper, dados em src/lib/constants.ts, alternancia bg-white/bg-lavender, IconCircle, lucide icons como string). Use quando o usuario pedir "adicionar secao", "criar nova secao", ou "novo bloco da landing".
---

# Section Builder — Nova Secao da Landing

## Quando usar

- Adicionar uma nova secao a `src/app/page.tsx`.
- Criar componente em `src/components/sections/<kebab-case>.tsx`.
- Mover conteudo hard-coded para `src/lib/constants.ts`.

## Convencoes obrigatorias

1. **Arquivo:** `src/components/sections/<nome-kebab>.tsx`. PascalCase para o componente.
2. **Wrapper:** envolver em `<SectionWrapper>` (gerencia padding, max-width, alternancia de fundo).
3. **Dados:** mover qualquer texto/lista para `src/lib/constants.ts` como `<NOME>_DATA` com type exportado.
4. **Lucide icons:** passar como string (`"Users"`) e resolver dinamicamente:
   ```tsx
   import * as Icons from "lucide-react";
   const Icon = Icons[iconName as keyof typeof Icons] as Icons.LucideIcon;
   ```
5. **ID de ancora:** se a secao for navegavel, adicionar `id="<slug>"` no `<section>` e entrada em `NAV_ITEMS`.
6. **Alternancia de fundo:** usar `variant="white"` ou `variant="lavender"` em `<SectionWrapper>` mantendo padrao zebra.
7. **Heading:** `<h2 className="font-heading text-primary">`. Body em `<p className="text-text-body">`.
8. **Cards de nucleo:** usar `<IconCircle>` com fundo `crimson-dark` para icones em destaque.

## Template basico

```tsx
// src/components/sections/<nome>.tsx
import * as Icons from "lucide-react";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { IconCircle } from "@/components/ui/icon-circle";
import { <NOME>_DATA } from "@/lib/constants";

export function <Nome>() {
  return (
    <SectionWrapper id="<slug>" variant="white">
      <h2 className="font-heading text-3xl md:text-4xl text-primary text-center mb-4">
        <Titulo>
      </h2>
      <p className="text-text-body text-center max-w-2xl mx-auto mb-12">
        <Subtitulo>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {<NOME>_DATA.map((item) => {
          const Icon = Icons[item.icon as keyof typeof Icons] as Icons.LucideIcon;
          return (
            <article key={item.title} className="rounded-xl border border-border-subtle bg-white p-6">
              <IconCircle>
                <Icon className="w-6 h-6" />
              </IconCircle>
              <h3 className="font-heading text-xl text-primary mt-4 mb-2">
                {item.title}
              </h3>
              <p className="text-text-body">{item.description}</p>
            </article>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
```

## Fluxo de implementacao

1. **Definir dados** — adicionar interface + array em `src/lib/constants.ts`.
2. **Criar componente** — em `src/components/sections/<nome>.tsx`.
3. **Importar em `src/app/page.tsx`** — colocar na ordem correta respeitando alternancia de fundo.
4. **Atualizar navbar** (se navegavel) — adicionar entrada em `NAV_ITEMS`.
5. **Lint** — `pnpm lint`.
6. **Testar visualmente** — `pnpm dev` e verificar mobile (coluna unica) + desktop (grid).

## Checklist de revisao

- [ ] Texto hard-coded movido para `constants.ts`.
- [ ] Tipos exportados.
- [ ] Mobile-first (coluna unica em base, expande em `md:` / `lg:`).
- [ ] Heading hierarquico correto (`<h2>` na secao, `<h3>` em cards).
- [ ] Icones lucide passados como string.
- [ ] Cores via tokens Tailwind (`text-primary`, `bg-lavender`, etc.) — nao hex literal.
- [ ] Alternancia de fundo respeita zebra com a secao anterior.
- [ ] `id` no `<section>` se navegavel.
