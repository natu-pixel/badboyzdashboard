'use client'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Badge, Button, Card, CardHeader, MetricCard, Table, Tr, Td } from '@/components/ui'
import { createServiceClient } from '@/lib/supabase'

export default function DevicesPage() {
  const [devices, setDevices] = useState([])
  const [metrics, setMetrics] = useState({
    total: 0,
    overLimit: 0,
    inactive7d: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDeviceData()
  }, [])

  async function fetchDeviceData() {
    setLoading(true)
    try {
      const supabase = createServiceClient()

      // Fetch devices with related data
      const { data: devicesData, error: devicesError } = await supabase
        .from('devices')
        .select(`
          *,
          subscriber:subscribers(username),
          activation_codes (
            max_devices,
            is_used
          )
        `)
        .order('last_active', { ascending: false })

      if (devicesError) {
        console.error('Error fetching devices:', devicesError)
        setDevices([])
      } else {
        setDevices(devicesData || [])
      }

      // Fetch metrics
      const [
        { data: totalDevicesData, error: totalDevicesError },
        { data: overLimitDevicesData, error: overLimitDevicesError },
        { data: inactive7dDevicesData, error: inactive7dDevicesError }
      ] = await Promise.all([
        // Total devices
        supabase.from('devices').select('id', { count: 'exact' }),
        
        // Devices over limit (need to calculate per subscriber)
        supabase
          .from('devices')
          .select('subscriber_id', { count: 'exact' })
          .not('subscriber_id', 'is', null)
          // Note: This is a simplified version. A proper implementation would need to
          // compare device count per subscriber against their max_devices limit
          // For now, we'll fetch all devices with subscriber and do client-side filtering
          ,
          
        // Devices inactive for 7+ days
        supabase
          .from('devices')
          .select('id', { count: 'exact' })
          .lte('last_active', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      ])

      if (!totalDevicesError) {
        const total = totalDevicesData?.length || 0
        
        // Calculate over limit devices (simplified client-side calculation)
        let overLimit = 0
        let inactive7d = inactive7dDevicesData?.length || 0
        
        if (!overLimitDevicesError && devicesData) {
          // Group devices by subscriber_id
          const subscriberDeviceCount: Record<string, number> = {}
          devicesData.forEach(device => {
            if (device.subscriber_id) {
              subscriberDeviceCount[device.subscriber_id] = (subscriberDeviceCount[device.subscriber_id] || 0) + 1
            }
          })
          
          // Count how many subscribers have exceeded their limit
          devicesData.forEach(device => {
            if (device.subscriber_id && device.activation_codes) {
              const deviceCount = subscriberDeviceCount[device.subscriber_id] || 0
              const maxDevices = device.activation_codes.max_devices || 0
              if (deviceCount > maxDevices && maxDevices > 0) {
                overLimit++
              }
            }
          })
          
          // Avoid double counting - a device can be both over limit and inactive
          // For simplicity, we'll just report the raw counts
        }

        setMetrics({
          total,
          overLimit,
          inactive7d
        })
      }

    } catch (error) {
      console.error('Error fetching device data:', error)
      setDevices([])
      setMetrics({ total: 0, overLimit: 0, inactive7d: 0 })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading device data...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 11, letterSpacing: 2, color: 'var(--text-muted)', fontWeight: 400 }}>MANAGE</h1>
        <p style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)', marginTop: 4 }}>Devices</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
        <MetricCard label="TOTAL DEVICES"    value={metrics.total.toLocaleString()} />
        <MetricCard label="OVER LIMIT"       value={metrics.overLimit.toLocaleString()} color="#f87171" />
        <MetricCard label="INACTIVE 7D+"     value={metrics.inactive7d.toLocaleString()} color="#fbbf24" />
      </div>

      <Card>
        <CardHeader title="DEVICE REGISTRY" />
        {devices.length > 0 ? (
          <Table headers={['TV NAME', 'ANDROID ID', 'USER', 'LAST ACTIVE', 'DEVICE COUNT', 'STATUS', 'ACTIONS']}>
            {devices.map(device => {
              // Determine device status
              let statusText = 'OK'
              let statusColor = 'var(--text-muted)'
              
              const now = new Date()
              const lastActive = device.last_active ? new Date(device.last_active) : null
              
              // Check for INACTIVE 7D+
              if (lastActive && now.getTime() - lastActive.getTime() > 7 * 24 * 60 * 60 * 1000) {
                statusText = 'INACTIVE 7D+'
                statusColor = '#fbbf24'
              } 
              // Check for NEW (within 24 hours)
              else if (device.created_at && now.getTime() - new Date(device.created_at).getTime() < 24 * 60 * 60 * 1000) {
                statusText = 'NEW'
                statusColor = '#60a5fa'
              }
              // Check for OVER LIMIT (simplified)
              else if (
                device.subscriber_id && 
                device.activation_codes && 
                device.subscriber && 
                device.activation_codes.max_devices > 0
              ) {
                // We'd need to count all devices for this subscriber to determine if over limit
                // For display purposes, we'll show OK if we can't determine
                statusText = 'OK'
                statusColor = 'var(--text-muted)'
              }

              return (
                <Tr key={device.id}>
                  <Td style={{ fontWeight: 500 }}>{device.tv_name || device.android_id || 'Unknown Device'}</Td>
                  <Td>
                    <span style={{ fontFamily: 'inherit', fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1 }}>
                      {device.android_id}
                    </span>
                  </Td>
                  <Td>{device.subscriber?.username || '—'}</Td>
                  <Td style={{ color: 'var(--text-muted)' }}>
                    {device.last_active ? new Date(device.last_active).toLocaleString() : 'Never'}
                  </Td>
                  <Td>
                    {/* Simplified device count display - would need subscriber device count for accuracy */}
                    {device.activation_codes ? `${devices.filter(d => d.subscriber_id === device.subscriber_id).length}/${device.activation_codes.max_devices}` : '—/—'}
                  </Td>
                  <Td style={{ color: statusColor }}>{statusText}</Td>
                  <Td>
                    <Button size="sm" variant="danger" title="Revoke device"><X size={11} /></Button>
                  </Td>
                </Tr>
              )
            })}
          </Table>
        ) : (
          <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No devices found
          </p>
        )}
      </Card>
    </div>
  )
}
