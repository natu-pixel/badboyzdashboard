'use client'
import { useState } from 'react'
import { RefreshCw, Plus, Copy, Trash2, Edit } from 'lucide-react'
import { Badge, Button, Card, CardHeader, CodeChip, Input, Select, Table, Tr, Td } from '@/components/ui'
import { generateCode } from '@/lib/codes'

const MOCK_CODES = [
  { code: 'X82KQ', playlist: 'Premium HD', devices: '1/2', expires: '2026-08-01', status: 'active' as const },
  { code: 'TR44W', playlist: 'Sports Bundle', devices: '2/2', expires: '2026-07-15', status: 'active' as const },
  { code: 'PLM9X', playlist: 'Basic M3U',    devices: '0/1', expires: '2026-09-30', status: 'unused' as const },
  { code: 'ZK01B', playlist: 'Premium HD',   devices: '1/1', expires: '2026-04-01', status: 'expired' as const },
]

const STATUS_MAP = {
  active:  <Badge variant="green">ACTIVE</Badge>,
  unused:  <Badge variant="amber">UNUSED</Badge>,
  expired: <Badge variant="red">EXPIRED</Badge>,
}

export default function CodesPage() {
  const [newCode, setNewCode] = useState('— — — — —')
  const [search, setSearch] = useState('')

  function handleGenerate() {
    setNewCode(generateCode(5))
  }

  const filtered = MOCK_CODES.filter(c =>
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.playlist.toLowerCase().includes(search.toLowerCase())
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
            <Select style={{ width: '100%' }}>
              <option>Premium HD Pack</option>
              <option>Sports Bundle</option>
              <option>Basic M3U</option>
            </Select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 10, letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 5 }}>MAX DEVICES</label>
            <Select style={{ width: '100%' }}>
              <option>1 device</option>
              <option>2 devices</option>
              <option>3 devices</option>
            </Select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 10, letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 5 }}>EXPIRY DATE</label>
            <Input type="date" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 10, letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 5 }}>ASSIGN USER (OPTIONAL)</label>
            <Input type="text" placeholder="username or email" style={{ width: '100%' }} />
          </div>
        </div>
        <div style={{ padding: '0 16px 16px', display: 'flex', gap: 8 }}>
          <Button variant="primary" style={{ flex: 1, justifyContent: 'center' }}>
            <Plus size={12} /> SAVE CODE
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
        <Table headers={['CODE', 'PLAYLIST', 'DEVICES', 'EXPIRES', 'STATUS', 'ACTIONS']}>
          {filtered.map(row => (
            <Tr key={row.code}>
              <Td><CodeChip code={row.code} /></Td>
              <Td>{row.playlist}</Td>
              <Td style={{ color: row.devices.startsWith(row.devices.split('/')[1]) ? 'var(--text)' : 'var(--text-muted)' }}>
                {row.devices}
              </Td>
              <Td style={{ color: 'var(--text-muted)' }}>{row.expires}</Td>
              <Td>{STATUS_MAP[row.status]}</Td>
              <Td>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Button size="sm" variant="ghost"><Edit size={11} /></Button>
                  <Button size="sm" variant="danger"><Trash2 size={11} /></Button>
                </div>
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </div>
  )
}
