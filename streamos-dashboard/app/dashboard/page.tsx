import { MetricCard, Card, CardHeader, Badge, CodeChip, Table, Tr, Td } from '@/components/ui'

export default function DashboardPage() {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 11, letterSpacing: 2, color: 'var(--text-muted)', fontWeight: 400 }}>OVERVIEW</h1>
        <p style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)', marginTop: 4 }}>Dashboard</p>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
        <MetricCard label="ACTIVE USERS"    value="1,284" sub="+12 today" />
        <MetricCard label="CODES ISSUED"    value="3,401" sub="841 unused" />
        <MetricCard label="ACTIVE DEVICES"  value="2,109" sub="avg 1.6 / user" />
        <MetricCard label="EXPIRING SOON"   value="47"    sub="within 7 days" color="#fbbf24" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Recent activations */}
        <Card>
          <CardHeader title="RECENT ACTIVATIONS" />
          <Table headers={['CODE', 'USER', 'STATUS']}>
            <Tr><Td><CodeChip code="X82KQ" /></Td><Td>ali_hassan</Td><Td><Badge variant="green">ACTIVE</Badge></Td></Tr>
            <Tr><Td><CodeChip code="TR44W" /></Td><Td>fatima_o</Td><Td><Badge variant="green">ACTIVE</Badge></Td></Tr>
            <Tr><Td><CodeChip code="PLM9X" /></Td><Td>—</Td><Td><Badge variant="amber">UNUSED</Badge></Td></Tr>
            <Tr><Td><CodeChip code="ZK01B" /></Td><Td>samuel_k</Td><Td><Badge variant="red">EXPIRED</Badge></Td></Tr>
          </Table>
        </Card>

        {/* Device alerts */}
        <Card>
          <CardHeader title="DEVICE ALERTS" />
          <Table headers={['DEVICE', 'USER', 'FLAG']}>
            <Tr><Td>Samsung TV #4</Td><Td>musa_99</Td><Td><Badge variant="red">LIMIT HIT</Badge></Td></Tr>
            <Tr><Td>Fire Stick A1</Td><Td>aisha_t</Td><Td><Badge variant="amber">INACTIVE 7D</Badge></Td></Tr>
            <Tr><Td>Android Box 7</Td><Td>john_d</Td><Td><Badge variant="blue">NEW</Badge></Td></Tr>
          </Table>
        </Card>
      </div>
    </div>
  )
}
