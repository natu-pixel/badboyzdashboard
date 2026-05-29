'use client'
import { X } from 'lucide-react'
import { Badge, Button, Card, CardHeader, MetricCard, Table, Tr, Td } from '@/components/ui'

const MOCK_DEVICES = [
  { name: 'Samsung 65"',   androidId: 'a1b2c3d4e5f6', user: 'ali_hassan', lastActive: '2 hrs ago',  count: '1/2', status: 'ok'       as const },
  { name: 'Fire Stick A1', androidId: 'f6e5d4c3b2a1', user: 'aisha_t',    lastActive: '8 days ago', count: '1/2', status: 'inactive' as const },
  { name: 'Hisense 4K',    androidId: '9988776655aa', user: 'musa_99',    lastActive: '1 hr ago',   count: '3/2', status: 'overlimit' as const },
  { name: 'Android Box 7', androidId: '1122334455bb', user: 'john_d',     lastActive: '5 mins ago', count: '1/1', status: 'new'      as const },
]

const STATUS_MAP = {
  ok:        <Badge variant="green">OK</Badge>,
  inactive:  <Badge variant="amber">INACTIVE 7D+</Badge>,
  overlimit: <Badge variant="red">OVER LIMIT</Badge>,
  new:       <Badge variant="blue">NEW</Badge>,
}

export default function DevicesPage() {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 11, letterSpacing: 2, color: 'var(--text-muted)', fontWeight: 400 }}>MANAGE</h1>
        <p style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)', marginTop: 4 }}>Devices</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
        <MetricCard label="TOTAL DEVICES"    value="2,109" />
        <MetricCard label="OVER LIMIT"       value="14"    color="#f87171" />
        <MetricCard label="INACTIVE 7D+"     value="83"    color="#fbbf24" />
      </div>

      <Card>
        <CardHeader title="DEVICE REGISTRY" />
        <Table headers={['TV NAME', 'ANDROID ID', 'USER', 'LAST ACTIVE', 'DEVICE COUNT', 'STATUS', 'ACTIONS']}>
          {MOCK_DEVICES.map(d => (
            <Tr key={d.androidId}>
              <Td style={{ fontWeight: 500 }}>{d.name}</Td>
              <Td>
                <span style={{ fontFamily: 'inherit', fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1 }}>
                  {d.androidId}
                </span>
              </Td>
              <Td>{d.user}</Td>
              <Td style={{ color: 'var(--text-muted)' }}>{d.lastActive}</Td>
              <Td>
                <span style={{ color: d.status === 'overlimit' ? '#f87171' : 'var(--text-muted)' }}>
                  {d.count}
                </span>
              </Td>
              <Td>{STATUS_MAP[d.status]}</Td>
              <Td>
                <Button size="sm" variant="danger" title="Revoke device"><X size={11} /></Button>
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </div>
  )
}
