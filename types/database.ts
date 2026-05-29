// Auto-generate these with: npx supabase gen types typescript --project-id YOUR_PROJECT_ID
// Manual types for now — replace with generated types after running schema.sql

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      activation_codes: {
        Row: {
          id: string
          code: string
          playlist_id: string | null
          subscriber_id: string | null
          max_devices: number
          expires_at: string | null
          is_used: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['activation_codes']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['activation_codes']['Insert']>
      }
      subscribers: {
        Row: {
          id: string
          username: string
          email: string | null
          status: 'active' | 'disabled' | 'expired'
          notes: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['subscribers']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['subscribers']['Insert']>
      }
      devices: {
        Row: {
          id: string
          android_id: string
          tv_name: string | null
          subscriber_id: string | null
          activation_code: string | null
          last_active: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['devices']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['devices']['Insert']>
      }
      playlists: {
        Row: {
          id: string
          name: string
          type: 'xtream' | 'm3u'
          url: string
          provider: string | null
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['playlists']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['playlists']['Insert']>
      }
      announcements: {
        Row: {
          id: string
          message: string
          type: 'info' | 'warning' | 'success'
          target: string
          sent_at: string
          reach: number
        }
        Insert: Omit<Database['public']['Tables']['announcements']['Row'], 'id' | 'sent_at'>
        Update: Partial<Database['public']['Tables']['announcements']['Insert']>
      }
    }
    Views: {
      codes_view: {
        Row: {
          id: string
          code: string
          max_devices: number
          expires_at: string | null
          is_used: boolean
          created_at: string
          playlist_name: string | null
          playlist_type: string | null
          username: string | null
          email: string | null
          subscriber_status: string | null
          device_count: number
        }
      }
    }
  }
}
