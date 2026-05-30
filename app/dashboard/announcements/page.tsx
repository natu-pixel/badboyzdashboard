'use client'
import { useState, useEffect } from 'react'
import { Send } from 'lucide-react'
import { Button, Card, CardHeader, Select, Table, Tr, Td } from '@/components/ui'
import { createServiceClient } from '@/lib/supabase'

export default function AnnouncementsPage() {
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [announcements, setAnnouncements] = useState([])

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  async function fetchAnnouncements() {
    try {
      const supabase = createServiceClient()
      const { data, error } = await supabase
        .from('announcements')
        .select('id, message, target, type, sent_at, reach')
        .order('sent_at', { ascending: false })

      if (error) {
        console.error('Error fetching announcements:', error)
        setAnnouncements([])
        return
      }

      // Format data to match the expected structure
      const formatted = data.map(ann => ({
        message: ann.message,
        target: ann.target,
        sent: new Date(ann.sent_at).toLocaleDateString(undefined, { 
          year: 'numeric', month: 'short', day: 'numeric' 
        }),
        reach: ann.reach
      }))
      setAnnouncements(formatted)
    } catch (error) {
      console.error('Error fetching announcements:', error)
      setAnnouncements([])
    }
  }

  function handleSend() {
    if (!message.trim()) return
    setSent(true)
    
    fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setMessage('')
        fetchAnnouncements() // Refresh list
      }
    })
    .catch(error => {
      console.error('Error sending announcement:', error)
    })
    .finally(() => {
      setTimeout(() => setSent(false), 2500)
    })
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
            placeholder="e.g. Server maintenance tonight from 2�?"4 AM. Streams may be interrupted."
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
              <option>Info</option>
              <option>Warning</option>
              <option>Success</option>
            </Select>
            <Button
              variant="primary"
              style={{ marginLeft: 'auto' }}
              onClick={handleSend}
              disabled={!message.trim()}
            >
              {sent ? <><Check size={12} /> SENT!</> : <><Send size={12} /> SEND TO DEVICES</>}
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="SENT HISTORY" />
        <Table headers={['MESSAGE', 'TARGET', 'SENT', 'REACH']}>
          {announcements.length > 0 ? (
            announcements.map((ann, i) => (
              <Tr key={i}>
                <Td style={{ maxWidth: 320 }}>{ann.message}</Td>
                <Td style={{ color: 'var(--text-muted)' }}>{ann.target}</Td>
                <Td style={{ color: 'var(--text-muted)' }}>{ann.sent}</Td>
                <Td style={{ color: 'var(--text-muted)' }}>{ann.reach.toLocaleString()}</Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                No announcements found
              </Td>
            </Tr>
          )}
        </Table>
      </Card>
    </div>
  )
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
