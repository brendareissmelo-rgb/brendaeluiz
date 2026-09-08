import { Link } from "@tanstack/react-router";
import { Gift, Home, Shirt, Users } from "lucide-react";

import logo from "@/assets/logo-casal.png.asset.json";
import { NavBar } from "@/components/ui/tubelight-navbar";

const navItems = [
  { name: "Início", url: "/", icon: Home },
  { name: "Dresscode", url: "/dresscode", icon: Shirt },
  { name: "Mesa", url: "/mesa-dos-convidados", icon: Users },
  { name: "Presente", url: "#presente", icon: Gift, highlighted: true },
];

export function SiteNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-3 py-2 sm:sticky sm:top-0">
      <div className="mx-auto flex max-w-5xl items-center justify-center">
        <NavBar items={navItems} />
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/30 pb-16 sm:pb-0">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-5 py-10 text-center">
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          Obrigado por fazer parte deste momento tão especial das nossas vidas. A presença de vocês
          é o que torna esse dia inesquecível.
        </p>
        <img src={logo.url} alt="Brenda e Luiz" className="h-10 w-auto opacity-90" />
        <Link
          to="/login"
          className="mt-2 rounded-md border border-border/60 px-3 py-1.5 text-[12px] tracking-wide text-muted-foreground transition hover:border-primary/50 hover:text-primary"
        >
          Login
        </Link>
      </div>
    </footer>
  );
}
