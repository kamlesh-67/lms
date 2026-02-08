"use client"

import * as React from "react"
import { Check, Paintbrush } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const themes = [
  { name: "Navy", value: "navy", color: "bg-[#061359]", description: "Brand" },
  { name: "Orange", value: "orange", color: "bg-[#ff9400]", description: "Vibrant" },
  { name: "Green", value: "green", color: "bg-green-600", description: "Nature" },
  { name: "Cyan", value: "cyan", color: "bg-cyan-500", description: "Ocean" },
  { name: "Violet", value: "violet", color: "bg-violet-600", description: "Royal" },
  { name: "Rose", value: "rose", color: "bg-rose-600", description: "Elegant" },
  { name: "Neutral", value: "neutral", color: "bg-neutral-900", description: "Minimal" },
]

export function ThemeCustomizer() {
  const [color, setColor] = React.useState("navy")

  React.useEffect(() => {
    const body = document.body
    body.setAttribute("data-theme", color)
  }, [color])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-9 w-auto px-3 gap-2">
          <Paintbrush className="h-4 w-4" />
          <span className="hidden md:inline">Theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.value}
            onClick={() => setColor(theme.value)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className={`h-4 w-4 rounded-full ${theme.color} ring-1 ring-border`} />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{theme.name}</span>
                <span className="text-xs text-muted-foreground">{theme.description}</span>
              </div>
            </div>
            {color === theme.value && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
