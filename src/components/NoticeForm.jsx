import { useState } from 'react'
import { Button } from './ui/Button'
import { Send, Loader2, Command, Tag, AlertCircle, Pin } from 'lucide-react'
import { toast } from 'sonner'

export default function NoticeForm({ onAdd, userId }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [priority, setPriority] = useState('normal')
  const [isPinned, setIsPinned] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    setSubmitting(true)

    const { error } = await onAdd({
      title,
      content,
      user_id: userId,
      priority,
      is_pinned: isPinned,
      audience: []
    })

    if (!error) {
      setTitle('')
      setContent('')
      setPriority('normal')
      setIsPinned(false)
      setShowOptions(false)
      toast.success('Notice posted successfully')
    } else {
      toast.error(error.message || 'Failed to post notice')
    }

    setSubmitting(false)
  }

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  return (
    <div className="glass-panel rounded-2xl transition-all focus-within:ring-1 focus-within:ring-brand-500/50 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none" />
      <form onSubmit={handleSubmit} className="flex flex-col relative z-10">
        <input
          type="text"
          placeholder="What's the announcement?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          required
          className="w-full bg-transparent px-5 py-4 text-lg font-medium text-ink-900 placeholder:text-ink-400 outline-none"
        />
        <div className="h-[1px] w-full bg-border/50" />
        <textarea
          placeholder="Add more details... (optional)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          className="w-full bg-transparent px-5 py-3 text-sm text-ink-900 placeholder:text-ink-400 outline-none resize-none"
        />
        
        {showOptions && (
          <div className="px-5 py-4 bg-black/[0.02] dark:bg-white/[0.02] border-t border-border/50 flex flex-col gap-4">
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm font-medium text-ink-700 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={priority === 'high'} 
                  onChange={(e) => setPriority(e.target.checked ? 'high' : 'normal')}
                  className="rounded border-border text-brand-500 focus:ring-brand-500/30"
                />
                <AlertCircle size={14} className={priority === 'high' ? 'text-red-500' : ''} />
                High Priority
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-ink-700 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isPinned} 
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded border-border text-brand-500 focus:ring-brand-500/30"
                />
                <Pin size={14} className={isPinned ? 'text-brand-500' : ''} />
                Pin to top
              </label>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between px-5 pb-4 pt-2 border-t border-border/50">
          <button 
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className="flex items-center gap-1.5 text-xs text-ink-600 hover:text-ink-900 font-medium transition-colors"
          >
            <Tag size={14} />
            {showOptions ? 'Hide Options' : 'Settings'}
          </button>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1 text-[10px] font-medium text-ink-400 bg-ink-900/5 dark:bg-white/10 px-2 py-1 rounded-md">
              <Command size={10} /> Enter
            </div>
            <Button type="submit" variant="brand" disabled={submitting || !title.trim()} size="sm" className="rounded-full px-5 shadow-sm">
              {submitting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>Post <Send size={14} className="ml-1" /></>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}