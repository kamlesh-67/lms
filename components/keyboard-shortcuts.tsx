"use client"

import * as React from "react"
import { Command } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface Shortcut {
    keys: string[]
    description: string
    category: string
}

const shortcuts: Shortcut[] = [
    // Navigation
    { keys: ["⌘/Ctrl", "K"], description: "Open command palette", category: "Navigation" },
    { keys: ["G", "D"], description: "Go to Dashboard", category: "Navigation" },
    { keys: ["G", "S"], description: "Go to Shipments", category: "Navigation" },
    { keys: ["G", "P"], description: "Go to Pickups", category: "Navigation" },
    { keys: ["G", "T"], description: "Go to Tracking", category: "Navigation" },
    { keys: ["G", "R"], description: "Go to Returns", category: "Navigation" },
    { keys: ["G", "O"], description: "Go to Documents", category: "Navigation" },
    { keys: ["G", ","], description: "Go to Settings", category: "Navigation" },

    // Actions
    { keys: ["C"], description: "Create new shipment", category: "Actions" },
    { keys: ["N"], description: "New pickup request", category: "Actions" },
    { keys: ["E"], description: "Export data", category: "Actions" },
    { keys: ["/"], description: "Focus search", category: "Actions" },

    // UI
    { keys: ["⌘/Ctrl", "/"], description: "Toggle keyboard shortcuts", category: "UI" },
    { keys: ["⌘/Ctrl", "B"], description: "Toggle sidebar", category: "UI" },
    { keys: ["⌘/Ctrl", "\\"], description: "Toggle theme", category: "UI" },
    { keys: ["Esc"], description: "Close dialog/modal", category: "UI" },
]

interface KeyboardShortcutsProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function KeyboardShortcuts({ open, onOpenChange }: KeyboardShortcutsProps) {
    const categories = Array.from(new Set(shortcuts.map(s => s.category)))

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                        <Command className="h-6 w-6 text-primary" />
                        Keyboard Shortcuts
                    </DialogTitle>
                    <DialogDescription>
                        Use these keyboard shortcuts to navigate and perform actions quickly
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    {categories.map(category => (
                        <div key={category}>
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                {category}
                            </h3>
                            <div className="space-y-2">
                                {shortcuts
                                    .filter(s => s.category === category)
                                    .map((shortcut, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-accent transition-colors"
                                        >
                                            <span className="text-sm">{shortcut.description}</span>
                                            <div className="flex items-center gap-1">
                                                {shortcut.keys.map((key, i) => (
                                                    <React.Fragment key={i}>
                                                        <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded border bg-muted px-2 font-mono text-xs font-medium text-muted-foreground">
                                                            {key}
                                                        </kbd>
                                                        {i < shortcut.keys.length - 1 && (
                                                            <span className="text-xs text-muted-foreground">+</span>
                                                        )}
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                        <strong>Tip:</strong> Press <kbd className="inline-flex h-5 items-center rounded border bg-background px-1.5 font-mono text-[10px]">⌘/Ctrl</kbd> + <kbd className="inline-flex h-5 items-center rounded border bg-background px-1.5 font-mono text-[10px]">/</kbd> anytime to view this help
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
