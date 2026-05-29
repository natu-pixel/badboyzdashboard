'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard/codes')
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)'
    }}>
      <div style={{
        width: 360, border: '1px solid var(--border)', borderRadius: 8,
        background: 'var(--bg-card)', padding: '32px'
      }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: 3, color: 'var(--text)', marginBottom: 4 }}>
            BADBOYZ
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 2 }}>ADMIN PANEL</div>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 10, letterSpacing: 1.5, color: 'var(--text-muted)', marginBottom: 6 }}>
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border)',
                borderRadius: 4, padding: '8px 12px', color: 'var(--text)', fontFamily: 'inherit',
                fontSize: 13, outline: 'none'
              }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 10, letterSpacing: 1.5, color: 'var(--text-muted)', marginBottom: 6 }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border)',
                borderRadius: 4, padding: '8px 12px', color: 'var(--text)', fontFamily: 'inherit',
                fontSize: 13, outline: 'none'
              }}
            />
          </div>

          {error && (
            <div style={{ marginBottom: 14, padding: '8px 12px', background: '#2a0a0a', border: '1px solid #5a1a1a', borderRadius: 4, color: '#ff6b6b', fontSize: 12 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '10px', background: 'var(--accent)', border: 'none',
              borderRadius: 4, color: '#fff', fontFamily: 'inherit', fontSize: 13,
              fontWeight: 500, letterSpacing: 1, cursor: 'pointer', opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>
      </div>
    </div>
  )
}
