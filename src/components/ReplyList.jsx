import { useState } from 'react'
import { useReplies } from '../hooks/useReplies'
import { formatDate } from '../utils/formatDate'
import { Trash2, Send, Loader2, MessageSquare } from 'lucide-react'
import { Button } from './ui/Button'
import { toast } from 'sonner'
import RoleBadge from './RoleBadge'

export default function ReplyList({ noticeId, currentUserId, currentUserRole }) {
  const { replies, loading, addReply, deleteReply } = useReplies(noticeId)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim()) return
    
    setSubmitting(true)
    const { error } = await addReply(message, currentUserId)
    if (error) {
      toast.error('Failed to post reply')
    } else {
      setMessage('')
    }
    setSubmitting(false)
  }

  const handleDelete = async (id) => {
    const { error } = await deleteReply(id)
    if (error) toast.error('Failed to delete reply')
  }

  return (
    <div className="mt-4 pt-4 border-t border-border/50 flex flex-col gap-4">
      {loading ? (
        <div className="text-xs text-ink-400 animate-pulse">Loading replies...</div>
      ) : replies.length > 0 ? (
        <div className="flex flex-col gap-3">
          {replies.map(reply => {
            const isOwner = reply.user_id === currentUserId
            const isAdmin = currentUserRole === 'admin'
            const canDelete = isOwner || isAdmin

            return (
              <div key={reply.id} className="group flex gap-3 text-sm">
                <div className="shrink-0 mt-1">
                  {reply.profiles?.avatar_url ? (
                    <img src={reply.profiles.avatar_url} alt="User" className="h-7 w-7 rounded-full object-cover shadow-sm border border-white/5" />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-brand-500/10 text-brand-700 dark:text-brand-300 flex items-center justify-center text-[10px] font-bold shadow-sm border border-white/5">
                      {(reply.profiles?.full_name || '?')[0]}
                    </div>
                  )}
                </div>
                <div className="flex-1 bg-black/[0.03] dark:bg-white/[0.03] p-3 rounded-2xl rounded-tl-none border border-border/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-ink-900 text-[13px]">
                      {reply.profiles?.full_name || 'Campus Member'}
                    </span>
                    <div className="flex items-center gap-2">
                      <RoleBadge role={reply.profiles?.role} />
                      <span className="text-[10px] text-ink-400">{formatDate(reply.created_at)}</span>
                    </div>
                  </div>
                  <p className="text-ink-700 text-[13.5px] leading-relaxed whitespace-pre-wrap">{reply.message}</p>
                </div>
                {canDelete && (
                  <button 
                    onClick={() => handleDelete(reply.id)}
                    className="shrink-0 h-7 w-7 mt-1 flex items-center justify-center rounded-full text-ink-400 opacity-0 group-hover:opacity-100 hover:text-red-600 hover:bg-red-500/10 dark:hover:text-red-400 transition-all focus:opacity-100"
                    title="Delete reply"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-xs text-ink-400 text-center py-2 bg-black/[0.02] dark:bg-white/[0.02] rounded-xl border border-border/50">No replies yet. Be the first to start the discussion!</div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2 relative mt-2">
        <input 
          type="text" 
          placeholder="Write a reply..." 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 bg-black/5 dark:bg-white/5 border border-border/50 rounded-full px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 outline-none focus:ring-1 focus:ring-brand-500/50 transition-all"
        />
        <Button type="submit" variant="brand" disabled={!message.trim() || submitting} size="sm" className="rounded-full h-auto px-5 shadow-sm">
          {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
        </Button>
      </form>
    </div>
  )
}
