"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Link, useRouterState } from "@tanstack/react-router"
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

export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0]?.name ?? "")
  const [isMobile, setIsMobile] = useState(false)
  const path = useRouterState({ select: (state) => state.location.pathname })
  const hash = useRouterState({ select: (state) => state.location.hash })

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

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
        return
      }
      const element = document.getElementById(item.url.slice(1))
      element?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        className,
      )}
    >
      <div className="flex items-center gap-1 rounded-full border border-border/40 bg-card/60 p-1.5 shadow-sm backdrop-blur-md sm:gap-2 sm:p-2">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <Link
              key={item.name}
              to={item.url.startsWith("#") ? "/" : item.url}
              hash={item.url.startsWith("#") ? item.url.slice(1) : undefined}
              onClick={handleClick(item)}
              className={cn(
                "relative flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm",
                item.highlighted
                  ? "text-primary drop-shadow-[0_0_10px_var(--color-primary)] hover:text-primary"
                  : "text-muted-foreground hover:text-foreground",
                isActive && !item.highlighted && "text-foreground",
              )}
            >
              <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {!isMobile && <span>{item.name}</span>}
              {isActive && (
                <motion.div
                  layoutId="tubelight-active"
                  className={cn(
                    "absolute inset-0 -z-10 rounded-full bg-background",
                    item.highlighted && "shadow-[0_0_16px_-2px_var(--color-primary)]",
                  )}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

