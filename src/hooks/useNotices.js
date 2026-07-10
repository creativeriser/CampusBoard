/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../supabaseClient'

export function useNotices() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchNotices = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('notices')
      .select('*, profiles(full_name, avatar_url, role)')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Error fetching notices:", error)
    } else {
      setNotices(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchNotices()
  }, [fetchNotices])

  const addNotice = async (noticeData) => {
    const { error } = await supabase
      .from('notices')
      .insert(noticeData)
    return { error }
  }

  const deleteNotice = async (id) => {
    const { error } = await supabase.from('notices').delete().eq('id', id)
    return { error }
  }

  const updateNotice = async (id, fields) => {
    const { error } = await supabase.from('notices').update(fields).eq('id', id)
    return { error }
  }

  return { notices, setNotices, loading, addNotice, deleteNotice, updateNotice, refetch: fetchNotices }
}
