import { AppSidebar } from '@/components/layout/AppSidebar'
import { Header } from '@/components/layout/Header'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:block">
        <AppSidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-muted/30">
          <Breadcrumbs />
          {children}
        </main>
      </div>
    </div>
  )
}
