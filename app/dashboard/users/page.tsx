'use client'
import { useState } from 'react'
import { CalendarPlus, Lock, Trash2, Plus, Tv2, Link2, Check } from 'lucide-react'
import { Badge, Button, Card, CardHeader, CodeChip, Input, Select, Table, Tr, Td, Modal } from '@/components/ui'

type PlaylistType = 'xtream' | 'm3u'

interface User {
  id: string
  username: string
  email: string
  playlist_type: PlaylistType | null
  max_devices: number
  expires_at: string | null
  status: 'active' | 'expired' | 'disabled'
  device_count: number
}

const STATUS_MAP = {
  active:    <Badge variant="green">ACTIVE</Badge>,
  expired:   <Badge variant="red">EXPIRED</Badge>,
  disabled:  <Badge variant="gray">DISABLED</Badge>,
}

export default function UsersPage() {
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Form fields
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [maxDevices, setMaxDevices] = useState(1)
  const [playlistType, setPlaylistType] = useState<PlaylistType>('xtream')

  // Xtream fields
  const [xtreamServer, setXtreamServer] = useState('')
  const [xtreamUser, setXtreamUser] = useState('')
  const [xtreamPass, setXtreamPass] = useState('')

  // M3U fields
  const [m3uUrl, setM3uUrl] = useState('')
  const [epgUrl, setEpgUrl] = useState('')

  function resetForm() {
    setUsername('')
    setEmail('')
    setMaxDevices(1)
    setPlaylistType('xtream')
    setXtreamServer('')
    setXtreamUser('')
    setXtreamPass('')
    setM3uUrl('')
    setEpgUrl('')
  }

  async function handleAddUser() {
    if (!username || !email || (!xtreamServer && playlistType === 'xtream') || (!m3uUrl && playlistType === 'm3u')) return
    setIsSubmitting(true)

    const playlistUrl = playlistType === 'xtream'
      ? `${xtreamServer.replace(/\/$/, '')}/get.php?username=${xtreamUser}&password=${xtreamPass}&type=m3u_plus`
      : m3uUrl

    const generatedCode = Math.random().toString(36).substring(2, 7).toUpperCase()

    const res = await fetch('/api/subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        email,
        playlist_type: playlistType,
        playlist_url: playlistUrl,
        max_devices: maxDevices
      })
    })

    if (res.ok) {
      setSubmitSuccess(true)
      setTimeout(() => {
        setSubmitSuccess(false)
        setShowAddModal(false)
        resetForm()
        fetchUsers()
      }, 1500)
    }
    setIsSubmitting(false)
  }

  async function fetchUsers() {
    const res = await fetch('/api/subscribers')
    const data = await res.json()
    setUsers(data.subscribers || [])
  }

  async function handleDelete(id: string) {
    await fetch(`/api/subscribers/${id}`, { method: 'DELETE' })
    fetchUsers()
  }

  async function handleToggleStatus(user: User) {
    await fetch(`/api/subscribers/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: user.status === 'active' ? 'disabled' : 'active' })
    })
    fetchUsers()
  }

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 11, letterSpacing: 2, color: 'var(--text-muted)', fontWeight: 400 }}>MANAGE</h1>
        <p style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)', marginTop: 4 }}>Users</p>
      </div>

      <Card>
        <CardHeader title="SUBSCRIBERS">
          <Input
            placeholder="search username or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 220 }}
          />
          <Button variant="primary" size="sm" onClick={() => { resetForm(); setShowAddModal(true) }}>
            <Plus size={12} /> ADD USER
          </Button>
        </CardHeader>

        <Table headers={['USERNAME', 'PLAYLIST', 'MAX DEVICES', 'DEVICES', 'STATUS', 'ACTIONS']}>
          {filtered.map(u => (
            <Tr key={u.id}>
              <Td>
                <div style={{ fontWeight: 500 }}>{u.username}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{u.email}</div>
              </Td>
              <Td style={{ color: 'var(--text-muted)' }}>
                {u.playlist_type ? u.playlist_type.toUpperCase() : '-'}
              </Td>
              <Td style={{ color: 'var(--text-muted)' }}>{u.max_devices}</Td>
              <Td style={{ color: u.device_count >= u.max_devices ? '#f87171' : 'var(--text-muted)' }}>
                {u.device_count}/{u.max_devices}
              </Td>
              <Td>{STATUS_MAP[u.status]}</Td>
              <Td>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Button size="sm" variant="ghost" onClick={() => handleToggleStatus(u)} title={u.status === 'active' ? 'Disable access' : 'Enable access'}>
                    <Lock size={11} />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => { setEditingUser(u); setShowEditModal(true) }} title="Edit user">
                    <CalendarPlus size={11} />
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(u.id)} title="Delete user">
                    <Trash2 size={11} />
                  </Button>
                </div>
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>

      {/* Add User Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="ADD NEW USER">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 10, letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 4 }}>USERNAME</label>
            <Input value={username} onChange={e => setUsername(e.target.value)} placeholder="username" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 10, letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 4 }}>EMAIL</label>
            <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" type="email" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 10, letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 4 }}>MAX DEVICES</label>
            <Select value={maxDevices} onChange={e => setMaxDevices(Number(e.target.value))}>
              <option value={1}>1 device</option>
              <option value={2}>2 devices</option>
              <option value={3}>3 devices</option>
            </Select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 10, letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 4 }}>PLAYLIST TYPE</label>
            <div style={{ display: 'flex', gap: 0, borderRadius: 4, overflow: 'hidden', border: '1px solid var(--border)' }}>
              {(['xtream', 'm3u'] as PlaylistType[]).map(t => (
                <button
                  key={t}
                  onClick={() => setPlaylistType(t)}
                  style={{
                    flex: 1, padding: '8px', fontSize: 11, fontWeight: 600,
                    background: playlistType === t ? 'var(--accent)' : 'var(--bg-surface)',
                    color: playlistType === t ? '#fff' : 'var(--text-muted)',
                    border: 'none', cursor: 'pointer'
                  }}
                >
                  {t === 'xtream' ? <><Tv2 size={12} style={{ display: 'inline' }} /> XTREAM</> : <><Link2 size={12} style={{ display: 'inline' }} /> M3U</>}
                </button>
              ))}
            </div>
          </div>

          {playlistType === 'xtream' ? (
            <>
              <div>
                <label style={{ display: 'block', fontSize: 10, letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 4 }}>SERVER</label>
                <Input value={xtreamServer} onChange={e => setXtreamServer(e.target.value)} placeholder="http://provider.com" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 10, letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 4 }}>USERNAME</label>
                  <Input value={xtreamUser} onChange={e => setXtreamUser(e.target.value)} placeholder="Xtream user" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 10, letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 4 }}>PASSWORD</label>
                  <Input value={xtreamPass} onChange={e => setXtreamPass(e.target.value)} placeholder="Xtream pass" type="password" />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label style={{ display: 'block', fontSize: 10, letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 4 }}>M3U URL</label>
                <Input value={m3uUrl} onChange={e => setM3uUrl(e.target.value)} placeholder="http://..." />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 4 }}>EPG URL (OPTIONAL)</label>
                <Input value={epgUrl} onChange={e => setEpgUrl(e.target.value)} placeholder="http://..." />
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <Button variant="ghost" onClick={() => setShowAddModal(false)} style={{ flex: 1 }}>Cancel</Button>
            <Button variant="primary" onClick={handleAddUser} style={{ flex: 1 }} disabled={isSubmitting || submitSuccess}>
              {submitSuccess ? <><Check size={12} /> User Created</> : <><Plus size={12} /> Add User</>}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}