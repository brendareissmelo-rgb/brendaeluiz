import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="paper flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="eyebrow text-primary">Ops</div>
        <h1 className="mt-2 font-script text-7xl text-foreground">Perdido?</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Essa página não existe — mas a festa continua.
        </p>
        <div className="mt-7">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voltar ao convite
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(error);
  const router = useRouter();
  return (
    <div className="paper flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl">Algo deu errado</h1>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}

const DESCRIPTION = "Convite digital do casamento de Brenda & Luiz — 12 de dezembro de 2026, em Belém.";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#f8f2ea" },
      { title: "Brenda & Luiz - Casamento" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "Brenda & Luiz - Casamento" },
      { name: "twitter:title", content: "Brenda & Luiz - Casamento" },
      { property: "og:description", content: DESCRIPTION },
      { name: "twitter:description", content: DESCRIPTION },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9b94064d-395f-4797-8d42-61c4091a088e/id-preview-90efb1c8--9f6e9a05-518a-45d3-9fe7-daddcbef3f33.lovable.app-1779193929553.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9b94064d-395f-4797-8d42-61c4091a088e/id-preview-90efb1c8--9f6e9a05-518a-45d3-9fe7-daddcbef3f33.lovable.app-1779193929553.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..600&family=Jost:wght@300;400;500;600;700&family=Pinyon+Script&family=Manrope:wght@400;500;600;700;800&display=swap",
      },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
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
      <AuthProvider>
        <Outlet />
        <Toaster richColors position="top-center" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
