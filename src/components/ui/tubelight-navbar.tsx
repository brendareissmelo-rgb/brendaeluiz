"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Link, useNavigate, useRouterState } from "@tanstack/react-router"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface NavItem {
  name: string
  url: string
  icon: LucideIcon
  highlighted?: boolean
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

/**
 * Barra de navegação em pílula. No celular fica fixa no rodapé (ao alcance do polegar),
 * com ícone + rótulo; em telas maiores vai para o topo.
 */
export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0]?.name ?? "")
  const navigate = useNavigate()
  const path = useRouterState({ select: (state) => state.location.pathname })
  const hash = useRouterState({ select: (state) => state.location.hash })

  useEffect(() => {
    const active = items.find((item) => {
      if (item.url.startsWith("#")) {
        return path === "/" && hash === item.url.slice(1)
      }
      return path === item.url
    })
    if (active) {
      setActiveTab(active.name)
    }
  }, [path, hash, items])

  const handleClick = (item: NavItem) => (e: React.MouseEvent) => {
    setActiveTab(item.name)
    if (item.url.startsWith("#")) {
      e.preventDefault()
      if (path !== "/") {
        void navigate({ to: "/", hash: item.url.slice(1) })
        return
      }
      const element = document.getElementById(item.url.slice(1))
      element?.scrollIntoView({ behavior: "smooth", block: "start" })
      return
    }
    // "Início" sempre leva ao topo do site, mesmo se a pessoa já estiver na home
    if (item.url === "/") {
      e.preventDefault()
      if (path !== "/") {
        void navigate({ to: "/" }).then(() => window.scrollTo({ top: 0 }))
      } else {
        if (hash) {
          void navigate({ to: "/" })
        }
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    }
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="flex w-full items-stretch gap-1 rounded-full border border-white/60 bg-card/85 p-1.5 shadow-[0_18px_40px_-16px_rgba(58,40,32,0.45)] backdrop-blur-xl sm:w-auto">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <Link
              key={item.name}
              to={item.url.startsWith("#") ? "/" : item.url}
              hash={item.url.startsWith("#") ? item.url.slice(1) : undefined}
              onClick={handleClick(item)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-full px-3 py-2 text-[10.5px] font-medium tracking-wide transition-colors sm:flex-none sm:flex-row sm:gap-2 sm:px-5 sm:text-sm",
                isActive
                  ? "text-primary-foreground"
                  : item.highlighted
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="tubelight-active"
                  className="absolute inset-0 -z-0 rounded-full bg-primary shadow-[0_8px_18px_-8px_var(--color-primary)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.55 }}
                />
              )}
              <Icon className="relative h-[18px] w-[18px] sm:h-4 sm:w-4" strokeWidth={1.7} />
              <span className="relative leading-none">{item.name}</span>
              {item.highlighted && !isActive && (
                <span className="absolute right-[22%] top-1.5 h-1.5 w-1.5 rounded-full bg-primary sm:right-2 sm:top-2" />
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
