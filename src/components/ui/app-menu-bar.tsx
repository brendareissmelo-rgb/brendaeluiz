import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Gift, Home, Shirt, Users } from "lucide-react";

import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";

const triggerClass =
  "h-9 cursor-pointer gap-1.5 px-2 text-xs font-normal text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[state=open]:bg-accent sm:px-3 sm:text-sm";

export default function AppMenuBar() {
  const navigate = useNavigate();
  const path = useRouterState({ select: (state) => state.location.pathname });

  const goHome = () => {
    if (path === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    navigate({ to: "/" });
  };

  const goPresent = () => {
    if (path !== "/") {
      navigate({ to: "/", hash: "presente" });
      return;
    }
    document.getElementById("presente")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Menubar className="h-11 w-fit max-w-full gap-0 overflow-hidden rounded-md border-border/70 bg-card/95 p-1 shadow-sm backdrop-blur sm:gap-1">
      <MenubarMenu>
        <MenubarTrigger className={triggerClass} onClick={goHome} aria-label="Início">
          <Home className="h-4 w-4" />
          <span className="sr-only">Início</span>
        </MenubarTrigger>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger asChild className={triggerClass}>
          <Link to="/dresscode">
            <Shirt className="h-4 w-4" />
            Dresscode
          </Link>
        </MenubarTrigger>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger asChild className={triggerClass}>
          <Link to="/mesa-dos-convidados">
            <Users className="h-4 w-4" />
            Mesa
          </Link>
        </MenubarTrigger>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger
          className={`${triggerClass} font-medium text-primary drop-shadow-[0_0_10px_var(--color-primary)] hover:text-primary`}
          onClick={goPresent}
        >
          <Gift className="h-4 w-4" />
          Presente
        </MenubarTrigger>
      </MenubarMenu>
    </Menubar>
  );
}