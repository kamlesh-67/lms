'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { Fragment } from 'react'

const routeNameMap: Record<string, string> = {
    shipments: 'Shipments',
    pickups: 'Pickups',
    tracking: 'Tracking',
    returns: 'Returns',
    settings: 'Settings',
    create: 'Create',
    schedule: 'Schedule',
    dashboard: 'Dashboard'
}

export function Breadcrumbs() {
    const pathname = usePathname()

    if (pathname === '/') return null

    const segments = pathname.split('/').filter(Boolean)

    return (
        <nav className="flex items-center text-sm text-muted-foreground mb-4">
            <Link href="/" className="flex items-center hover:text-foreground transition-colors">
                <Home className="h-4 w-4" />
            </Link>

            {segments.map((segment, index) => {
                const path = `/${segments.slice(0, index + 1).join('/')}`
                const isLast = index === segments.length - 1

                // Format name: check map, or capitalize, or handle ID
                let name = routeNameMap[segment] || segment

                // Simple ID heuristic: if it contains numbers and is long, treat as ID
                if (segment.length > 10 && /\d/.test(segment)) {
                    name = 'Details'
                } else {
                    // Capitalize if not in map
                    if (!routeNameMap[segment]) {
                        name = segment.charAt(0).toUpperCase() + segment.slice(1)
                    }
                }

                return (
                    <Fragment key={path}>
                        <ChevronRight className="h-4 w-4 mx-2" />
                        {isLast ? (
                            <span className="font-medium text-foreground">{name}</span>
                        ) : (
                            <Link href={path} className="hover:text-foreground transition-colors">
                                {name}
                            </Link>
                        )}
                    </Fragment>
                )
            })}
        </nav>
    )
}
