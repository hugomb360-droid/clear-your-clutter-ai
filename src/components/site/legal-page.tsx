import type { ReactNode } from "react";
import { Breadcrumb, wrap } from "@/components/site/page-kit";

export type LegalSection = { id: string; title: string; body: ReactNode };

/**
 * Gabarit des textes légaux : sommaire collant à gauche, texte à droite,
 * typographie de lecture longue. Les contenus sont passés en sections.
 */
export function LegalPage({
  crumb,
  title,
  updated,
  intro,
  sections,
}: {
  crumb: string;
  title: string;
  updated: string;
  intro?: ReactNode;
  sections: LegalSection[];
}) {
  return (
    <main>
      <section className="border-b border-border pb-8 pt-6">
        <div className={wrap}>
          <Breadcrumb items={[{ label: crumb }]} />
          <h1 className="mt-6 text-[32px] font-black leading-[1.05] tracking-[-0.03em] text-brand-ink sm:text-[44px]">
            {title}
          </h1>
          <p className="mt-3 text-[15px] text-muted-foreground">Dernière mise à jour : {updated}</p>
          {intro && (
            <div className="mt-5 max-w-[70ch] text-[17px] leading-relaxed text-[#34433A]">
              {intro}
            </div>
          )}
        </div>
      </section>

      <div className={`${wrap} grid gap-10 py-12 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16`}>
        <nav aria-label="Sommaire" className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm font-bold text-muted-foreground">Sommaire</p>
          <ol className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 lg:flex-col lg:gap-0">
            {sections.map((section, index) => (
              <li
                key={section.id}
                className="lg:border-l-2 lg:border-border lg:py-1.5 lg:pl-4 lg:hover:border-primary"
              >
                <a
                  href={`#${section.id}`}
                  className="text-[14px] font-semibold text-brand-ink hover:text-primary"
                >
                  <span className="mr-1.5 text-primary tabular-nums">{index + 1}.</span>
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="legal max-w-[72ch]">
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-24 border-t border-border py-8 first:border-t-0 first:pt-0"
            >
              <h2 className="text-[22px] font-extrabold tracking-[-0.01em] text-brand-ink sm:text-[26px]">
                <span className="mr-2 text-primary tabular-nums">{index + 1}.</span>
                {section.title}
              </h2>
              <div className="mt-4 flex flex-col gap-3.5 text-[16px] leading-relaxed text-[#34433A] [&_a]:font-semibold [&_a]:text-primary [&_a]:underline [&_h3]:mt-2 [&_h3]:text-[17px] [&_h3]:font-extrabold [&_h3]:text-brand-ink [&_li]:mt-1 [&_strong]:text-brand-ink [&_ul]:list-disc [&_ul]:pl-5">
                {section.body}
              </div>
            </section>
          ))}
        </article>
      </div>
    </main>
  );
}

/** Coordonnées de l'éditeur, partagées par les trois textes légaux. */
export const EDITOR = {
  name: "Monsallut Barranger",
  form: "entreprise individuelle (micro-entreprise)",
  siren: "105 524 110",
  address: "27 rue Marcel Pointeau, 16000 Angoulême, France",
  phone: "06 09 95 79 15",
  phoneHref: "tel:+33609957915",
  email: "clientclearo@gmail.com",
  site: "https://debarrasfrance.fr",
  brand: "Débarras France",
};
