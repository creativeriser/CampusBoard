import { formatDate } from '../utils/formatDate'
import { Trash2, MessageSquare, Clock } from 'lucide-react'

export default function NoticeCard({ notice, currentUserId, onDelete }) {
  const isOwner = notice.user_id === currentUserId

  return (
    <div className="group flex flex-col rounded-2xl border border-white/10 dark:border-white/5 bg-white/40 dark:bg-black/20 hover:bg-white/50 dark:hover:bg-black/30 backdrop-blur-xl p-5 md:p-6 shadow-sm transition-all hover:shadow-md relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none" />
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-display text-lg font-semibold text-ink-900 leading-tight">
            {notice.title}
          </h3>
          {notice.content && (
            <p className="mt-2 text-sm text-ink-700 whitespace-pre-wrap leading-relaxed">
              {notice.content}
            </p>
          )}
        </div>
        
        {isOwner && (
          <button 
            onClick={() => onDelete(notice.id)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-400 opacity-0 transition-all hover:bg-ember-500/10 hover:text-ember-600 focus-visible:opacity-100 group-hover:opacity-100 dark:hover:text-ember-400 outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            title="Delete Notice"
            aria-label="Delete notice"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
      
      <div className="relative z-10 mt-4 flex items-center justify-between border-t border-border/40 dark:border-white/5 pt-3">
        <div className="flex items-center gap-1.5 text-xs font-medium text-ink-500">
          <Clock size={14} className="opacity-70" />
          {formatDate(notice.created_at)}
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-ink-500 opacity-0 transition-opacity group-hover:opacity-100">
          {/* Placeholder for future features like comments/reactions */}
          <button className="flex items-center gap-1 hover:text-brand-600 transition-colors">
            <MessageSquare size={14} />
            Reply
          </button>
        </div>
      </div>
    </div>
  )
}
