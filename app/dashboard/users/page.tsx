'use client'
import { useState } from 'react'
import { CalendarPlus, Lock, Trash2, Plus } from 'lucide-react'
import { Badge, Button, Card, CardHeader, CodeChip, Input, Table, Tr, Td } from '@/components/ui'

const MOCK_USERS = [
  { username: 'ali_hassan',  email: 'ali@mail.com',    code: 'X82KQ', plan: 'Premium HD',   expires: '2026-08-01', devices: '1/2', status: 'active'   as const },
  { username: 'fatima_o',    email: 'fatima@mail.com', code: 'TR44W', plan: 'Sports Bundle',expires: '2026-07-15', devices: '2/2', status: 'active'   as const },
  { username: 'samuel_k',    email: 'sam@mail.com',    code: 'ZK01B', plan: 'Basic',         expires: '2026-04-01', devices: '1/1', status: 'expired'  as const },
  { username: 'musa_99',     email: 'musa@mail.com',   code: 'MW22Z', plan: 'Premium HD',   expires: '2026-10-12', devices: '3/2', status: 'overlimit' as const },
]

const STATUS_MAP = {
  active:    <Badge variant="green">ACTIVE</Badge>,
  expired:   <Badge variant="red">EXPIRED</Badge>,
  disabled:  <Badge variant="gray">DISABLED</Badge>,
  overlimit: <Badge variant="red">OVER LIMIT</Badge>,
}

export default function UsersPage() {
  const [search, setSearch] = useState('')

  const filtered = MOCK_USERS.filter(u =>
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
          <Button variant="primary" size="sm"><Plus size={12} /> ADD USER</Button>
        </CardHeader>

        <Table headers={['USERNAME', 'CODE', 'PLAN', 'EXPIRES', 'DEVICES', 'STATUS', 'ACTIONS']}>
          {filtered.map(u => (
            <Tr key={u.username}>
              <Td>
                <div style={{ fontWeight: 500 }}>{u.username}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{u.email}</div>
              </Td>
              <Td><CodeChip code={u.code} /></Td>
              <Td style={{ color: 'var(--text-muted)' }}>{u.plan}</Td>
              <Td style={{ color: 'var(--text-muted)' }}>{u.expires}</Td>
              <Td style={{ color: u.devices.split('/')[0] > u.devices.split('/')[1] ? '#f87171' : 'var(--text-muted)' }}>
                {u.devices}
              </Td>
              <Td>{STATUS_MAP[u.status]}</Td>
              <Td>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Button size="sm" variant="ghost" title="Extend subscription"><CalendarPlus size={11} /></Button>
                  <Button size="sm" variant="ghost" title="Disable access"><Lock size={11} /></Button>
                  <Button size="sm" variant="danger" title="Delete user"><Trash2 size={11} /></Button>
                </div>
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </div>
  )
}
