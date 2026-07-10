import { useEffect } from 'react'
import { supabase } from '../supabaseClient'

// Subscribes to INSERT/UPDATE/DELETE on the notices table and
// keeps the parent's notices state array in sync live.
export function useRealtimeNotices(setNotices) {
  useEffect(() => {
    const channel = supabase
      .channel('notices-feed')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notices' },
        async (payload) => {
          // Real-time payloads only contain the raw table row.
          // We must fetch the joined profile data to maintain UI consistency.
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, avatar_url, email')
            .eq('id', payload.new.user_id)
            .single()

          const newNotice = {
            ...payload.new,
            profiles: profileData || null
          }

          setNotices((prev) => [newNotice, ...prev])
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'notices' },
        (payload) => {
          setNotices((prev) => prev.filter((n) => n.id !== payload.old.id))
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'notices' },
        (payload) => {
          setNotices((prev) =>
            prev.map((n) => (n.id === payload.new.id ? payload.new : n))
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [setNotices])
}
