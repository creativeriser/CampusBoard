import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export function useReplies(noticeId) {
  const [replies, setReplies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!noticeId) return

    const fetchReplies = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('replies')
        .select('*, profiles(full_name, avatar_url, role)')
        .eq('notice_id', noticeId)
        .order('created_at', { ascending: true })
      
      if (!error && data) {
        setReplies(data)
      }
      setLoading(false)
    }

    fetchReplies()

    // Realtime subscription for replies on this notice
    const channel = supabase
      .channel(`public:replies:notice_id=${noticeId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'replies', filter: `notice_id=eq.${noticeId}` }, payload => {
        // Fetch the joined profile data for the new reply
        supabase
          .from('replies')
          .select('*, profiles(full_name, avatar_url, role)')
          .eq('id', payload.new.id)
          .single()
          .then(({ data }) => {
            if (data) setReplies(prev => [...prev, data])
          })
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'replies', filter: `notice_id=eq.${noticeId}` }, payload => {
        setReplies(prev => prev.filter(reply => reply.id !== payload.old.id))
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [noticeId])

  const addReply = async (message, userId) => {
    const { error } = await supabase
      .from('replies')
      .insert({ notice_id: noticeId, message, user_id: userId })
    return { error }
  }

  const deleteReply = async (id) => {
    const { error } = await supabase.from('replies').delete().eq('id', id)
    return { error }
  }

  return { replies, loading, addReply, deleteReply }
}
