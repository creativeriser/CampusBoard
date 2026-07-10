import { useState, useEffect } from 'react'
import { formatDate } from '../utils/formatDate'
import { Trash2, MessageSquare, Clock, Pin, AlertCircle } from 'lucide-react'
import ReplyList from './ReplyList'
import RoleBadge from './RoleBadge'
import { Badge } from './ui/Badge'
import { supabase } from '../supabaseClient'

export default function NoticeCard({ notice, currentUserId, currentUserRole, onDelete }) {
  const [showReplies, setShowReplies] = useState(false)
  const [replyCount, setReplyCount] = useState(0)
  const isOwner = notice.user_id === currentUserId
  const isAdmin = currentUserRole === 'admin'
  const canDelete = isOwner || isAdmin

  // Fetch initial reply count for the permanent button display
  useEffect(() => {
    async function fetchReplyCount() {
      const { count } = await supabase
        .from('replies')
        .select('*', { count: 'exact', head: true })
        .eq('notice_id', notice.id)
      
      if (count !== null) {
        setReplyCount(count)
      }
    }
    fetchReplyCount()
  }, [notice.id])

  // Listen for realtime reply updates to keep count accurate
  useEffect(() => {
    const channel = supabase.channel(`notice-${notice.id}-replies-count`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'replies', filter: `notice_id=eq.${notice.id}` },
        () => setReplyCount(prev => prev + 1)
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'replies', filter: `notice_id=eq.${notice.id}` },
        () => setReplyCount(prev => Math.max(0, prev - 1))
      )
      .subscribe()
      
    return () => {
      supabase.removeChannel(channel)
    }
  }, [notice.id])

  return (
    <div className={`glass-panel group flex flex-col rounded-2xl hover:bg-white/50 dark:hover:bg-black/30 p-5 md:p-6 transition-all hover:shadow-md relative overflow-hidden ${notice.is_pinned ? 'ring-1 ring-brand-500/30' : ''}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none" />
      
      {/* Header: Author & Actions */}
      <div className="relative z-10 flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {notice.profiles?.avatar_url ? (
            <img 
              src={notice.profiles.avatar_url} 
              alt={notice.profiles.full_name || 'User'} 
              className="h-8 w-8 rounded-full object-cover border border-white/10 bg-surface shadow-sm" 
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-brand-500/10 text-brand-700 dark:text-brand-300 flex items-center justify-center text-xs font-bold uppercase shrink-0 shadow-sm">
              {(notice.profiles?.full_name || '?')[0]}
            </div>
          )}
          <div className="flex flex-col justify-center">
            <span className="text-[14px] font-bold text-ink-900 leading-tight">
              {notice.profiles?.full_name || 'Campus Member'}
            </span>
            <span className="text-[11px] font-medium text-ink-400 mt-0.5 flex items-center gap-1">
              <Clock size={10} />
              {formatDate(notice.created_at)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <RoleBadge role={notice.profiles?.role} />
          {canDelete && (
            <button 
              onClick={() => onDelete(notice.id)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-400 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-600 focus-visible:opacity-100 group-hover:opacity-100 dark:hover:text-red-400 outline-none focus-visible:ring-2 focus-visible:ring-brand-500 -mr-2"
              title="Delete Notice"
              aria-label="Delete notice"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Body: Content */}
      <div className="relative z-10 pl-11">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {notice.is_pinned && (
            <Badge variant="brand" icon={Pin}>Pinned</Badge>
          )}
          {notice.priority === 'high' && (
            <Badge variant="red" icon={AlertCircle}>High Priority</Badge>
          )}
          {notice.audience?.length > 0 && !notice.audience.includes('Everyone') && notice.audience.map(tag => (
            <Badge key={tag} variant="default">{tag}</Badge>
          ))}
        </div>

        <h3 className="font-sans text-[17px] font-bold text-ink-900 leading-tight">
          {notice.title}
        </h3>
        {notice.content && (
          <p className="mt-2 text-sm text-ink-700 whitespace-pre-wrap leading-relaxed">
            {notice.content}
          </p>
        )}
        
        {/* Footer: Actions (Permanently Visible) */}
        <div className="mt-4 flex items-center gap-4 text-xs font-medium text-ink-600 transition-opacity">
          <button 
            onClick={() => setShowReplies(!showReplies)}
            className={`flex items-center gap-1.5 transition-colors list-item-hover p-1.5 -ml-1.5 rounded-lg ${showReplies ? 'text-brand-600 dark:text-brand-400' : 'hover:text-brand-600 dark:hover:text-brand-400'}`}
          >
            <MessageSquare size={14} />
            {replyCount > 0 ? (
              <span>{replyCount} {replyCount === 1 ? 'Reply' : 'Replies'}</span>
            ) : (
              <span>Reply</span>
            )}
          </button>
        </div>

        {showReplies && (
          <ReplyList 
            noticeId={notice.id} 
            currentUserId={currentUserId} 
            currentUserRole={currentUserRole} 
          />
        )}
      </div>
    </div>
  )
}
