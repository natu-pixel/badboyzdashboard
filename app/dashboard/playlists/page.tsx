'use client'
import { useState } from 'react'
import { Edit, Trash2, Plus, Link2, Tv2, Copy, Check, RefreshCw } from 'lucide-react'
import { Badge, Button, Card, CardHeader, Table, Tr, Td, Input } from '@/components/ui'
import { generateCode } from '@/lib/codes'

type PlaylistType = 'xtream' | 'm3u'

interface Playlist {
  id: string
  name: string
  type: PlaylistType
  url: string
  is_active: boolean
}

function parseXtreamUrl(server: string, user: string, pass: string) {
  const base = server.replace(/\/$/, '')
  return {
    m3u: `${base}/get.php?username=${user}&password=${pass}&type=m3u_plus`,
    epg: `${base}/xmltv.php?username=${user}&password=${pass}`,
  }
}

function parseM3uUrl(m3uUrl: string) {
  const match = m3uUrl.match(/url-tvg="([^"]+)"/)
  return { m3u: m3uUrl, epg: match ? match[1] : '' }
}

export default function PlaylistsPage() {
  const [tab, setTab] = useState<PlaylistType>('xtream')
  const [playlists, setPlaylists] = useState<Playlist[]>([])

  // Xtream fields
  const [server, setServer] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // M3U fields
  const [m3uUrl, setM3uUrl] = useState('')
  const [epgUrl, setEpgUrl] = useState('')
  const [playlistName, setPlaylistName] = useState('')

  // Generated code
  const [generatedCode, setGeneratedCode] = useState('')
  const [copied, setCopied] = useState(false)

  // Editing
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleConvert() {
    const code = generateCode(5)
    setGeneratedCode(code)
    setCopied(false)
  }

  function handleCopy() {
    if (!generatedCode) return
    navigator.clipboard.writeText(generatedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleSavePlaylist() {
    if (!playlistName || !server && tab === 'xtream' || !m3uUrl && tab === 'm3u') return
    setIsSubmitting(true)

    const url = tab === 'xtream'
      ? `${server.replace(/\/$/, '')}/get.php?username=${username}&password=${password}&type=m3u_plus`
      : m3uUrl

    const res = await fetch('/api/playlists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: playlistName,
        type: tab,
        url
      })
    })

    if (res.ok) {
      setGeneratedCode('')
      setPlaylistName('')
      setServer('')
      setUsername('')
      setPassword('')
      setM3uUrl('')
      setEpgUrl('')
      fetchPlaylists()
    }
    setIsSubmitting(false)
  }

  async function fetchPlaylists() {
    const res = await fetch('/api/playlists')
    const data = await res.json()
    setPlaylists(data.playlists || [])
  }

  async function handleDelete(id: string) {
    await fetch(`/api/playlists/${id}`, { method: 'DELETE' })
    fetchPlaylists()
  }

  async function handleToggleActive(playlist: Playlist) {
    await fetch(`/api/playlists/${playlist.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !playlist.is_active })
    })
    fetchPlaylists()
  }

  const urls = tab === 'xtream'
    ? (server && username && password ? parseXtreamUrl(server, username, password) : null)
    : (m3uUrl ? parseM3uUrl(m3uUrl) : null)

  const canConvert = tab === 'xtream'
    ? (!!server && !!username && !!password && !!playlistName)
    : (!!m3uUrl && !!playlistName)

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 11, letterSpacing: 2, color: 'var(--text-muted)', fontWeight: 400 }}>CONFIG</h1>
        <p style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)', marginTop: 4 }}>Playlists</p>
      </div>

      {/* ── ADD PLAYLIST ── */}
      <Card style={{ marginBottom: 16 }}>
        <CardHeader title="ADD PLAYLIST" />

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 0, margin: '0 16px 16px', borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)' }}>
          {(['xtream', 'm3u'] as PlaylistType[]).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setGeneratedCode('') }}
              style={{
                flex: 1, padding: '8px 0', fontSize: 11, fontWeight: 600, letterSpacing: 1.5,
                cursor: 'pointer', border: 'none', fontFamily: 'inherit',
                background: tab === t ? 'var(--accent)' : 'var(--bg-surface)',
                color: tab === t ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.15s',
              }}
            >
              {t === 'xtream' ? <><Tv2 size={12} style={{ display: 'inline' }} /> XTREAM</> : <><Link2 size={12} style={{ display: 'inline' }} /> M3U</>}
            </button>
          ))}
        </div>

        {/* Playlist name (shared) */}
        <div style={{ padding: '0 16px 12px' }}>
          <label style={{ display: 'block', fontSize: 10, letterSpacing: 1.5, color: 'var(--text-muted)', marginBottom: 5 }}>PLAYLIST NAME</label>
          <Input
            placeholder="e.g. Premium HD Pack"
            value={playlistName}
            onChange={e => setPlaylistName(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        {tab === 'xtream' ? (
          <div style={{ padding: '0 16px 12px', display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, letterSpacing: 1.5, color: 'var(--text-muted)', marginBottom: 5 }}>SERVER ADDRESS</label>
              <Input
                placeholder="http://streamerlax.win"
                value={server}
                onChange={e => setServer(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 10, letterSpacing: 1.5, color: 'var(--text-muted)', marginBottom: 5 }}>USERNAME</label>
                <Input placeholder="Ln9UhdHs" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, letterSpacing: 1.5, color: 'var(--text-muted)', marginBottom: 5 }}>PASSWORD</label>
                <Input placeholder="69sWCgvhv" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%' }} type="password" />
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '0 16px 12px', display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, letterSpacing: 1.5, color: 'var(--text-muted)', marginBottom: 5 }}>M3U URL</label>
              <Input
                placeholder="http://provider.com/get.php?username=...&type=m3u_plus"
                value={m3uUrl}
                onChange={e => setM3uUrl(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10, letterSpacing: 1.5, color: 'var(--text-muted)', marginBottom: 5 }}>EPG / XMLTV URL (OPTIONAL)</label>
              <Input
                placeholder="http://provider.com/xmltv.php?username=..."
                value={epgUrl}
                onChange={e => setEpgUrl(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}

        {/* Preview URLs */}
        {urls && (
          <div style={{ margin: '0 16px 12px', padding: 12, background: 'var(--bg-surface)', borderRadius: 6, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 9, letterSpacing: 2, color: 'var(--text-dim)', marginBottom: 8 }}>RESOLVED URLS</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
              <span style={{ color: 'var(--accent)', marginRight: 6 }}>M3U</span>{urls.m3u}
            </div>
            {urls.epg && (
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                <span style={{ color: '#a78bfa', marginRight: 6 }}>EPG</span>{urls.epg}
              </div>
            )}
          </div>
        )}

        {/* Save button */}
        <div style={{ padding: '0 16px 16px', display: 'flex', gap: 8, alignItems: 'center' }}>
          <Button
            variant="primary"
            style={{ flex: 1, justifyContent: 'center', opacity: canConvert ? 1 : 0.4 }}
            onClick={handleSavePlaylist}
            disabled={isSubmitting || !canConvert}
          >
            <Plus size={12} /> {isSubmitting ? 'Saving...' : 'SAVE PLAYLIST'}
          </Button>
        </div>
      </Card>

      {/* Existing playlists table */}
      <Card>
        <CardHeader title="PLAYLIST ASSIGNMENT">
          <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}><Plus size={12} /> NEW PLAYLIST</Button>
        </CardHeader>
        <Table headers={['NAME', 'TYPE', 'PROVIDER URL', 'STATUS', 'ACTIONS']}>
          {playlists.map(p => (
            <Tr key={p.id}>
              <Td style={{ fontWeight: 500 }}>{p.name}</Td>
              <Td>
                <Badge variant={p.type === 'xtream' ? 'blue' : 'amber'}>
                  {p.type.toUpperCase()}
                </Badge>
              </Td>
              <Td style={{ color: 'var(--text-muted)', fontSize: 11 }}>{p.url}</Td>
              <Td><Badge variant={p.is_active ? 'green' : 'gray'}>{p.is_active ? 'ACTIVE' : 'DISABLED'}</Badge></Td>
              <Td>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Button size="sm" variant="ghost" onClick={() => handleToggleActive(p)} title={p.is_active ? 'Disable' : 'Enable'}>
                    <Edit size={11} />
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(p.id)} title="Delete">
                    <Trash2 size={11} />
                  </Button>
                </div>
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </div>
  )
}