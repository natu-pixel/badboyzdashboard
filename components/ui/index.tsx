'use client'
import React, { useEffect } from 'react'

// --- Badge ---
type BadgeVariant = 'green' | 'red' | 'amber' | 'blue' | 'gray'

const BADGE_STYLES: Record<BadgeVariant, React.CSSProperties> = {
  green: { background: '#0d2a14', color: '#4ade80', border: '1px solid #166534' },
  red:   { background: '#2a0a0a', color: '#f87171', border: '1px solid #7f1d1d' },
  amber: { background: '#2a1a00', color: '#fbbf24', border: '1px solid #78350f' },
  blue:  { background: '#0a1a3a', color: '#60a5fa', border: '1px solid #1e3a8a' },
  gray:  { background: '#1a1a2a', color: '#94a3b8', border: '1px solid #334155' },
}

export function Badge({ variant, children }: { variant: BadgeVariant; children: React.ReactNode }) {
  return (
    <span style={{
      ...BADGE_STYLES[variant],
      fontSize: 10, fontWeight: 500, letterSpacing: 1,
      padding: '2px 8px', borderRadius: 20, display: 'inline-block'
    }}>
      {children}
    </span>
  )
}

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
}

export function Button({ variant = 'ghost', size = 'md', children, style, ...props }: ButtonProps) {
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    fontFamily: 'inherit', fontWeight: 500, cursor: 'pointer',
    letterSpacing: 0.5, transition: 'opacity 0.1s',
    borderRadius: 4,
  }
  const variants: Record<string, React.CSSProperties> = {
    primary: { background: 'var(--accent)', color: '#fff', border: 'none', fontSize: size === 'sm' ? 11 : 12, padding: size === 'sm' ? '5px 10px' : '8px 14px' },
    ghost:   { background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)', fontSize: size === 'sm' ? 11 : 12, padding: size === 'sm' ? '4px 8px' : '7px 12px' },
    danger:  { background: '#2a0a0a', color: '#f87171', border: '1px solid #7f1d1d', fontSize: size === 'sm' ? 11 : 12, padding: size === 'sm' ? '4px 8px' : '7px 12px' },
  }
  return (
    <button style={{ ...base, ...variants[variant], ...style }} {...props}>
      {children}
    </button>
  )
}

// --- Card ---
export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 8, overflow: 'hidden', ...style
    }}>
      {children}
    </div>
  )
}

export function CardHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 16px', borderBottom: '1px solid var(--border)',
      background: 'var(--bg-surface)'
    }}>
      <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: 1.5, color: 'var(--text)' }}>
        {title}
      </span>
      <div style={{ display: 'flex', gap: 8 }}>{children}</div>
    </div>
  )
}

// --- Code Chip ---
export function CodeChip({ code }: { code: string }) {
  return (
    <span style={{
      fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
      letterSpacing: 3, background: 'var(--bg-surface)',
      padding: '3px 8px', borderRadius: 4,
      border: '1px solid var(--border)', color: 'var(--text)'
    }}>
      {code}
    </span>
  )
}

// --- Metric Card ---
export function MetricCard({ label, value, sub, color }: {
  label: string; value: string | number; sub?: string; color?: string
}) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 8, padding: '16px'
    }}>
      <div style={{ fontSize: 9, letterSpacing: 2, color: 'var(--text-muted)', marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 24, fontWeight: 600, color: color || 'var(--text)' }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

// --- Input ---
export function Input({ style, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 4, padding: '7px 10px', color: 'var(--text)',
        fontFamily: 'inherit', fontSize: 12, outline: 'none',
        ...style
      }}
      {...props}
    />
  )
}

// --- Select ---
export function Select({ style, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 4, padding: '7px 10px', color: 'var(--text)',
        fontFamily: 'inherit', fontSize: 12, outline: 'none', cursor: 'pointer',
        ...style
      }}
      {...props}
    >
      {children}
    </select>
  )
}

// --- Table ---
export function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {headers.map(h => (
              <th key={h} style={{
                fontSize: 9, letterSpacing: 1.5, color: 'var(--text-muted)',
                padding: '10px 16px', textAlign: 'left',
                borderBottom: '1px solid var(--border)', fontWeight: 500,
                background: 'var(--bg-surface)'
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export function Tr({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr style={{ borderBottom: '1px solid var(--border)' }} {...props}>
      {children}
    </tr>
  )
}

export function Td({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <td style={{ padding: '10px 16px', color: 'var(--text)', fontSize: 12, ...style }}>
      {children}
    </td>
  )
}

// --- Modal ---
export function Modal({ open, onClose, title, children }: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.7)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 8, width: '90%', maxWidth: 500, maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <div style={{
          padding: '12px 16px', borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: 1.5, color: 'var(--text)' }}>
            {title}
          </span>
          <button onClick={onClose} style={{
            background: 'transparent', border: 'none', color: 'var(--text-muted)',
            cursor: 'pointer', fontSize: 18, padding: 0, lineHeight: 1
          }}>×</button>
        </div>
        <div style={{ padding: 16 }}>{children}</div>
      </div>
    </div>
  )
}
