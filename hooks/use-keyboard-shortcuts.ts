"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface UseKeyboardShortcutsOptions {
    onToggleShortcutsHelp?: () => void
    onToggleSidebar?: () => void
    onToggleTheme?: () => void
}

export function useKeyboardShortcuts(options: UseKeyboardShortcutsOptions = {}) {
    const router = useRouter()

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
            const modKey = isMac ? e.metaKey : e.ctrlKey

            // Command palette: Cmd/Ctrl + K
            if (modKey && e.key === 'k') {
                e.preventDefault()
                // Command menu is already handled by CommandMenu component
                return
            }

            // Keyboard shortcuts help: Cmd/Ctrl + /
            if (modKey && e.key === '/') {
                e.preventDefault()
                options.onToggleShortcutsHelp?.()
                return
            }

            // Toggle sidebar: Cmd/Ctrl + B
            if (modKey && e.key === 'b') {
                e.preventDefault()
                options.onToggleSidebar?.()
                return
            }

            // Toggle theme: Cmd/Ctrl + \
            if (modKey && e.key === '\\') {
                e.preventDefault()
                options.onToggleTheme?.()
                return
            }

            // Navigation shortcuts with 'g' prefix
            if (e.key === 'g' && !modKey && !e.shiftKey && !e.altKey) {
                const target = e.target as HTMLElement
                // Don't trigger if user is typing in an input
                if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
                    return
                }

                // Set a flag to listen for the next key
                const handleNextKey = (nextE: KeyboardEvent) => {
                    nextE.preventDefault()

                    switch (nextE.key.toLowerCase()) {
                        case 'd':
                            router.push('/')
                            break
                        case 's':
                            router.push('/shipments')
                            break
                        case 'p':
                            router.push('/pickups')
                            break
                        case 't':
                            router.push('/tracking')
                            break
                        case 'r':
                            router.push('/returns')
                            break
                        case 'o':
                            router.push('/documents')
                            break
                        case ',':
                            router.push('/settings')
                            break
                        case 'a':
                            router.push('/admin/audit')
                            break
                        case 'h':
                            router.push('/admin/api-history')
                            break
                    }

                    document.removeEventListener('keydown', handleNextKey)
                }

                document.addEventListener('keydown', handleNextKey, { once: true })

                // Remove listener after 2 seconds if no second key pressed
                setTimeout(() => {
                    document.removeEventListener('keydown', handleNextKey)
                }, 2000)
            }

            // Single key shortcuts (when not in input)
            const target = e.target as HTMLElement
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
                return
            }

            // Focus search: /
            if (e.key === '/' && !modKey && !e.shiftKey && !e.altKey) {
                e.preventDefault()
                // Focus the command menu search
                const searchButton = document.querySelector('[data-command-trigger]') as HTMLElement
                searchButton?.click()
                return
            }

            // Create new shipment: C
            if (e.key === 'c' && !modKey && !e.shiftKey && !e.altKey) {
                e.preventDefault()
                router.push('/shipments/create')
                return
            }

            // New pickup: N
            if (e.key === 'n' && !modKey && !e.shiftKey && !e.altKey) {
                e.preventDefault()
                router.push('/pickups/create')
                return
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [router, options])
}
