'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Package, Tags, ShoppingBag, Settings, DollarSign, FileText, ImageIcon, Star, LogOut, Menu, X, MessageSquare } from 'lucide-react'

const navLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Tags },
  { href: '/admin/banners', label: 'Banners', icon: ImageIcon },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/income', label: 'Income', icon: DollarSign },
  { href: '/admin/invoices', label: 'Invoices', icon: FileText },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checked, setChecked] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/verify')
        const data = await res.json()
        if (!data.valid) {
          router.push('/admin/login')
        } else {
          setChecked(true)
        }
      } catch {
        router.push('/admin/login')
      }
    }
    checkAuth()
  }, [router])

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {}
    router.push('/admin/login')
  }

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff8ee]">
        <div className="animate-spin h-8 w-8 border-4 border-[#d4869c] border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fff8ee]">
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 lg:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-4 h-12 border-b border-[#f5ede0]">
          <div className="flex-1 min-w-0">
            <Link href="/admin/dashboard" className="text-sm font-bold text-[#4a3730] block leading-tight truncate">
              Tiny Treasure World
            </Link>
            <p className="text-[10px] text-[#8a7a6e] uppercase tracking-wider">Admin Panel</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-[#8a7a6e] hover:text-[#4a3730]">
            <X size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="p-3 space-y-0.5 overflow-y-auto" style={{ height: 'calc(100% - 120px)' }}>
          {navLinks.map((link) => {
            const Icon = link.icon
            const active = pathname === link.href || (link.href !== '/admin/dashboard' && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  active
                    ? 'bg-[#f5ede0] text-[#d4869c] shadow-sm'
                    : 'text-[#6a5a4e] hover:bg-[#f5ede0] hover:text-[#4a3730]'
                }`}
              >
                <div className={`w-7 h-7 rounded-md flex items-center justify-center ${
                  active ? 'bg-[#d4869c] text-white shadow-sm' : 'bg-[#f0e6d8] text-[#8a7a6e]'
                }`}>
                  <Icon size={14} />
                </div>
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-[#f0e6d8] bg-[#f5ede0]/80">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium text-[#d4869c] hover:bg-[#f0d6de] transition-colors"
          >
            <div className="w-7 h-7 rounded-md bg-[#f0d6de] flex items-center justify-center">
              <LogOut size={14} />
            </div>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64 flex flex-col min-h-screen bg-[#fff8ee]">
        {/* Mobile header */}
        <header className="h-12 bg-white border-b border-[#f0e6d8] flex items-center justify-between px-3 lg:hidden sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="text-[#5a4a3e] hover:text-[#d4869c] p-1.5 -ml-1.5">
            <Menu size={20} />
          </button>
          <span className="text-xs font-semibold text-[#6a5a4e]">Admin Panel</span>
          <div className="w-7" />
        </header>

        <main className="flex-1 bg-[#fff8ee] p-4">{children}</main>
      </div>
    </div>
  )
}
