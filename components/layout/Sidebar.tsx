'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Key, Users, Tv2, List, Megaphone, LayoutDashboard, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const NAV = [
  { label: 'OVERVIEW', items: [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  ]},
  { label: 'MANAGE', items: [
    { href: '/dashboard/codes',         icon: Key,        label: 'Activation Codes' },
    { href: '/dashboard/users',         icon: Users,      label: 'Users' },
    { href: '/dashboard/devices',       icon: Tv2,        label: 'Devices' },
  ]},
  { label: 'CONFIG', items: [
    { href: '/dashboard/announcements', icon: Megaphone,  label: 'Announcements' },
  ]},
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <aside style={{
      width: 210, minWidth: 210, background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
      height: '100vh', position: 'sticky', top: 0, overflow: 'auto'
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: 3, color: 'var(--text)' }}>BADBOYZ</div>
        <div style={{ fontSize: 9, letterSpacing: 2, color: 'var(--text-muted)', marginTop: 3 }}>ADMIN PANEL v1.0</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 0' }}>
        {NAV.map(section => (
          <div key={section.label}>
            <div style={{ fontSize: 9, letterSpacing: 2, color: 'var(--text-dim)', padding: '12px 16px 4px' }}>
              {section.label}
            </div>
            {section.items.map(item => {
              const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 16px', fontSize: 12,
                    color: active ? 'var(--text)' : 'var(--text-muted)',
                    textDecoration: 'none',
                    background: active ? 'var(--bg-card)' : 'transparent',
                    borderLeft: `2px solid ${active ? 'var(--accent)' : 'transparent'}`,
                    transition: 'all 0.1s',
                    fontWeight: active ? 500 : 400,
                  }}
                >
                  <item.icon size={14} />
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, width: '100%',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', fontSize: 12, padding: '6px 0',
            fontFamily: 'inherit'
          }}
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
