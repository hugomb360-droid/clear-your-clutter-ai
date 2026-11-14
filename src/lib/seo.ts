/** Métadonnées communes aux pages de service (titre, description, données structurées). */
export function serviceHead(opts: {
  path: string;
  title: string;
  description: string;
  serviceName: string;
  breadcrumb: string;
}) {
  const canonical = `https://debarrasfrance.fr${opts.path}`;
  return {
    meta: [
      { title: opts.title },
      { name: "description", content: opts.description },
      { property: "og:title", content: opts.title },
      { property: "og:description", content: opts.description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: canonical },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonical }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: opts.serviceName,
          serviceType: opts.serviceName,
          areaServed: "France",
          provider: {
            "@type": "Organization",
            name: "Débarras France",
            url: "https://debarrasfrance.fr",
          },
          url: canonical,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Accueil",
              item: "https://debarrasfrance.fr",
            },
            { "@type": "ListItem", position: 2, name: opts.breadcrumb, item: canonical },
          ],
        }),
      },
    ],
  };
}
