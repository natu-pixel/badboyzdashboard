'use client'
import { useState, useEffect } from 'react'
import { RefreshCw, Plus, Copy, Trash2, Edit, Check } from 'lucide-react'
import { Badge, Button, Card, CardHeader, CodeChip, Input, Select, Table, Tr, Td } from '@/components/ui'
import { generateCode } from '@/lib/codes'

interface Code {
  id: string
  code: string
  playlist_name: string | null
  max_devices: number
  device_count: number
  is_used: boolean
}

interface Playlist {
  id: string
  name: string
}

interface Subscriber {
  id: string
  username: string
}

const STATUS_MAP = {
  active:  <Badge variant="green">ACTIVE</Badge>,
  unused:  <Badge variant="amber">UNUSED</Badge>,
  expired: <Badge variant="red">EXPIRED</Badge>,
}

export default function CodesPage() {
  const [newCode, setNewCode] = useState('— — — — —')
  const [search, setSearch] = useState('')
  const [codes, setCodes] = useState<Code[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [selectedPlaylist, setSelectedPlaylist] = useState('')
  const [maxDevices, setMaxDevices] = useState(1)
  const [selectedSubscriber, setSelectedSubscriber] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  function handleGenerate() {
    setNewCode(generateCode(5))
  }

  async function handleSaveCode() {
    if (!newCode || newCode === '— — — — —' || !selectedPlaylist) return
    setIsSubmitting(true)

    const res = await fetch('/api/codes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: newCode,
        playlist_id: selectedPlaylist,
        max_devices: maxDevices,
        subscriber_id: selectedSubscriber || null
      })
    })

    if (res.ok) {
      setSubmitSuccess(true)
      setTimeout(() => {
        setSubmitSuccess(false)
        setNewCode('— — — — —')
        setSelectedPlaylist('')
        setSelectedSubscriber('')
        fetchCodes()
      }, 1500)
    }
    setIsSubmitting(false)
  }

  async function fetchCodes() {
    const res = await fetch('/api/codes')
    const data = await res.json()
    setCodes(data.codes || [])
  }

  async function fetchPlaylists() {
    const res = await fetch('/api/playlists')
    const data = await res.json()
    setPlaylists(data.playlists || [])
  }

  async function fetchSubscribers() {
    const res = await fetch('/api/subscribers')
    const data = await res.json()
    setSubscribers(data.subscribers || [])
  }

  async function handleDelete(id: string) {
    await fetch(`/api/codes/${id}`, { method: 'DELETE' })
    fetchCodes()
  }

  useEffect(() => {
    fetchCodes()
    fetchPlaylists()
    fetchSubscribers()
  }, [])

  const filtered = codes.filter(c =>
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    (c.playlist_name || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 11, letterSpacing: 2, color: 'var(--text-muted)', fontWeight: 400 }}>MANAGE</h1>
        <p style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)', marginTop: 4 }}>Activation Codes</p>
      </div>

      {/* Generator */}
      <Card style={{ marginBottom: 16 }}>
        <CardHeader title="GENERATE NEW CODE">
          <Button variant="primary" size="sm" onClick={handleGenerate}>
            <RefreshCw size={12} /> GENERATE
          </Button>
        </CardHeader>

        {/* Code display */}
        <div style={{
          fontFamily: 'inherit', fontSize: 28, fontWeight: 700, letterSpacing: 8,
          textAlign: 'center', padding: '20px 16px',
          background: 'var(--bg-surface)', margin: '16px 16px 0',
          border: '1px dashed var(--border-bright)', borderRadius: 6,
          color: newCode === '— — — — —' ? 'var(--text-dim)' : 'var(--accent)'
        }}>
          {newCode}
        </div>

        {/* Config fields */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: 10, letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 5 }}>PLAYLIST</label>
            <Select style={{ width: '100%' }} value={selectedPlaylist} onChange={e => setSelectedPlaylist(e.target.value)}>
              <option value="">Select playlist...</option>
              {playlists.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </Select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 10, letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 5 }}>MAX DEVICES</label>
            <Select style={{ width: '100%' }} value={maxDevices} onChange={e => setMaxDevices(Number(e.target.value))}>
              <option value={1}>1 device</option>
              <option value={2}>2 devices</option>
              <option value={3}>3 devices</option>
            </Select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 10, letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 5 }}>ASSIGN USER (OPTIONAL)</label>
            <Select style={{ width: '100%' }} value={selectedSubscriber} onChange={e => setSelectedSubscriber(e.target.value)}>
              <option value="">Unassigned</option>
              {subscribers.map(s => (
                <option key={s.id} value={s.id}>{s.username}</option>
              ))}
            </Select>
          </div>
        </div>
        <div style={{ padding: '0 16px 16px', display: 'flex', gap: 8 }}>
          <Button variant="primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleSaveCode} disabled={isSubmitting || submitSuccess || !selectedPlaylist}>
            {submitSuccess ? <><Check size={12} /> Code Saved</> : <><Plus size={12} /> SAVE CODE</>}
          </Button>
          <Button variant="ghost" onClick={() => navigator.clipboard.writeText(newCode)} disabled={newCode === '— — — — —'}>
            <Copy size={12} /> COPY
          </Button>
        </div>
      </Card>

      {/* Code table */}
      <Card>
        <CardHeader title="ALL CODES">
          <Input
            placeholder="search code or playlist..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 220 }}
          />
        </CardHeader>
        <Table headers={['CODE', 'PLAYLIST', 'DEVICES', 'STATUS', 'ACTIONS']}>
          {filtered.map(row => (
            <Tr key={row.id}>
              <Td><CodeChip code={row.code} /></Td>
              <Td style={{ color: 'var(--text-muted)' }}>{row.playlist_name || '-'}</Td>
              <Td style={{ color: row.device_count >= row.max_devices ? '#f87171' : 'var(--text-muted)' }}>
                {row.device_count}/{row.max_devices}
              </Td>
              <Td>{STATUS_MAP[row.is_used ? 'active' : 'unused']}</Td>
              <Td>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Button size="sm" variant="ghost" title="Edit code"><Edit size={11} /></Button>
                  <Button size="sm" variant="danger" title="Delete code" onClick={() => handleDelete(row.id)}><Trash2 size={11} /></Button>
                </div>
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </div>
  )
}