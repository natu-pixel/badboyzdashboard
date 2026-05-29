'use client'
import { useState } from 'react'
import { Send } from 'lucide-react'
import { Button, Card, CardHeader, Select, Table, Tr, Td } from '@/components/ui'

const HISTORY = [
  { message: 'Server migration complete. All streams restored.', target: 'All users', sent: '3 days ago', reach: 1284 },
  { message: 'New 4K channels added to Premium HD Pack.',        target: 'Premium HD', sent: '1 week ago', reach: 412 },
  { message: 'Scheduled maintenance May 28, 1–3 AM.',           target: 'All users',  sent: '2 weeks ago', reach: 1241 },
]

export default function AnnouncementsPage() {
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  function handleSend() {
    if (!message.trim()) return
    setSent(true)
    setTimeout(() => setSent(false), 2500)
    setMessage('')
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 11, letterSpacing: 2, color: 'var(--text-muted)', fontWeight: 400 }}>CONFIG</h1>
        <p style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)', marginTop: 4 }}>Announcements</p>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <CardHeader title="PUSH ANNOUNCEMENT" />
        <div style={{ padding: 16 }}>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="e.g. Server maintenance tonight from 2–4 AM. Streams may be interrupted."
            rows={3}
            style={{
              width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: 4, padding: '10px 12px', color: 'var(--text)',
              fontFamily: 'inherit', fontSize: 12, resize: 'vertical', outline: 'none',
              marginBottom: 12
            }}
          />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <Select>
              <option>All users</option>
              <option>Premium HD users</option>
              <option>Sports Bundle users</option>
              <option>Expiring soon</option>
            </Select>
            <Select>
              <option>⚠ Warning</option>
              <option>ℹ Info</option>
              <option>✓ Success</option>
            </Select>
            <Button
              variant="primary"
              style={{ marginLeft: 'auto' }}
              onClick={handleSend}
              disabled={!message.trim()}
            >
              {sent ? '✓ SENT!' : <><Send size={12} /> SEND TO DEVICES</>}
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="SENT HISTORY" />
        <Table headers={['MESSAGE', 'TARGET', 'SENT', 'REACH']}>
          {HISTORY.map((h, i) => (
            <Tr key={i}>
              <Td style={{ maxWidth: 320 }}>{h.message}</Td>
              <Td style={{ color: 'var(--text-muted)' }}>{h.target}</Td>
              <Td style={{ color: 'var(--text-muted)' }}>{h.sent}</Td>
              <Td style={{ color: 'var(--text-muted)' }}>{h.reach.toLocaleString()}</Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </div>
  )
}
