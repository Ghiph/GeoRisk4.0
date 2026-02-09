"use client"

import { useState } from "react"
import { AppSidebar, type NavPage } from "@/components/app-sidebar"
import { HomeSection } from "@/components/home-section"
import { MapSection } from "@/components/map-section"
import { EducationSection } from "@/components/education-section"
import { Menu, X } from "lucide-react"

export default function Page() {
  const [activePage, setActivePage] = useState<NavPage>("beranda")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AppSidebar
          activePage={activePage}
          onPageChange={(page) => {
            setActivePage(page)
            setSidebarOpen(false)
          }}
        />
      </div>

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-card px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground lg:hidden"
            aria-label={sidebarOpen ? "Tutup menu" : "Buka menu"}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div>
            <h1 className="text-sm font-semibold text-foreground">
              Mitigasi Risiko Gempa Bumi Terintegrasi
            </h1>
            <p className="text-xs text-muted-foreground">
              Studi Kasus: Kecamatan Cisarua, Jawa Barat
            </p>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          {activePage === "beranda" && <HomeSection />}
          {activePage === "peta" && <MapSection />}
          {activePage === "edukasi" && <EducationSection />}
        </div>
      </main>
    </div>
  )
}
