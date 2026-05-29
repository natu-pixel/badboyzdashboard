'use client'
import { Edit, Trash2, Plus } from 'lucide-react'
import { Badge, Button, Card, CardHeader, Table, Tr, Td } from '@/components/ui'

const MOCK_PLAYLISTS = [
  { name: 'Premium HD Pack',  type: 'xtream' as const, provider: 'Provider A', codes: 412, active: true },
  { name: 'Sports Bundle',    type: 'xtream' as const, provider: 'Provider B', codes: 287, active: true },
  { name: 'Basic M3U',        type: 'm3u'    as const, provider: 'Self-hosted', codes: 145, active: true },
]

export default function PlaylistsPage() {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 11, letterSpacing: 2, color: 'var(--text-muted)', fontWeight: 400 }}>CONFIG</h1>
        <p style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)', marginTop: 4 }}>Playlists</p>
      </div>

      <Card>
        <CardHeader title="PLAYLIST ASSIGNMENT">
          <Button variant="primary" size="sm"><Plus size={12} /> NEW PLAYLIST</Button>
        </CardHeader>
        <Table headers={['NAME', 'TYPE', 'PROVIDER URL', 'ASSIGNED CODES', 'STATUS', 'ACTIONS']}>
          {MOCK_PLAYLISTS.map(p => (
            <Tr key={p.name}>
              <Td style={{ fontWeight: 500 }}>{p.name}</Td>
              <Td>
                <Badge variant={p.type === 'xtream' ? 'blue' : 'amber'}>
                  {p.type.toUpperCase()}
                </Badge>
              </Td>
              <Td style={{ color: 'var(--text-muted)' }}>{p.provider}</Td>
              <Td style={{ color: 'var(--text-muted)' }}>{p.codes}</Td>
              <Td><Badge variant="green">ACTIVE</Badge></Td>
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
