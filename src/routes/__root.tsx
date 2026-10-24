import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#F2FAF4] px-4 py-20">
      <div className="max-w-lg text-center">
        <p className="text-7xl font-black tracking-tight text-primary">404</p>
        <h1 className="mt-4 text-[30px] font-black leading-tight tracking-[-0.02em] text-brand-ink sm:text-[38px]">
          Cette page est introuvable
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
          Elle a peut-être été déplacée ou n'existe plus.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-primary px-[26px] font-bold text-primary-foreground hover:bg-primary/90"
          >
            Retour à l'accueil
          </Link>
          <Link
            to="/estimation"
            className="inline-flex min-h-[52px] items-center justify-center rounded-full border-2 border-brand-ink px-[26px] font-bold text-brand-ink hover:bg-brand-ink hover:text-white"
          >
            Estimer mon débarras
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-brand-ink">
          Cette page n'a pas pu s'afficher
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Un problème est survenu de notre côté. Vous pouvez réessayer ou revenir à l'accueil.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Réessayer
          </button>
          <a
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-brand-ink px-5 font-bold text-brand-ink transition-colors hover:bg-brand-ink hover:text-white"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0c3d22" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-title", content: "Débarras France" },
      { title: "Débarras France — plateforme de débarras partout en France" },
      {
        name: "description",
        content:
          "Débarras France estime votre débarras à partir de photos et vous met en relation avec des professionnels près de chez vous.",
      },
      { name: "author", content: "Débarras France" },
      {
        name: "google-site-verification",
        content: "VALvt00uQdsavwInVMJXgyDLsw2jDJi9GtjsA9qzhpQ",
      },
      { property: "og:site_name", content: "Débarras France" },
      {
        property: "og:title",
        content: "Débarras France — plateforme de débarras partout en France",
      },
      {
        property: "og:description",
        content:
          "Débarras France estime votre débarras à partir de photos et vous met en relation avec des professionnels près de chez vous.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800;900&display=swap",
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/icons/app-180.png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Débarras France",
          url: "https://debarrasfrance.fr",
          logo: "https://debarrasfrance.fr/favicon.png",
          email: "clientclearo@gmail.com",
          areaServed: { "@type": "Country", name: "France" },
          description:
            "Plateforme de débarras : estimation du volume et du prix à partir de photos, mise en relation avec des débarrasseurs vérifiés partout en France.",
          contactPoint: [
            {
              "@type": "ContactPoint",
              contactType: "customer support",
              email: "clientclearo@gmail.com",
              availableLanguage: ["French"],
            },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Débarras France",
          url: "https://debarrasfrance.fr",
          inLanguage: "fr-FR",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </main>
        <SiteFooter />
      </div>
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}
