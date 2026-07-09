import { useState } from 'react'
import { Button } from './ui/Button'
import { Send, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function NoticeForm({ onAdd, userId }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    setSubmitting(true)

    const { error } = await onAdd(title, content, userId)

    if (!error) {
      setTitle('')
      setContent('')
      toast.success('Notice posted successfully')
    } else {
      toast.error(error.message || 'Failed to post notice')
    }

    setSubmitting(false)
  }

  return (
    <div className="rounded-2xl border border-white/10 dark:border-white/5 bg-white/40 dark:bg-black/20 backdrop-blur-xl shadow-sm transition-colors overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none" />
      <form onSubmit={handleSubmit} className="flex flex-col relative z-10">
        <input
          type="text"
          placeholder="What's the announcement?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full bg-transparent px-5 py-4 text-lg font-medium text-ink-900 placeholder:text-ink-400 dark:placeholder:text-ink-600 outline-none"
        />
        <div className="h-[1px] w-full bg-border/40 dark:bg-white/5" />
        <textarea
          placeholder="Add more details... (optional)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={2}
          className="w-full bg-transparent px-5 py-3 text-sm text-ink-900 placeholder:text-ink-400 dark:placeholder:text-ink-600 outline-none resize-none"
        />
        <div className="flex items-center justify-between px-5 pb-4 pt-2">
          <p className="text-xs text-ink-400 font-medium">Posts are visible to everyone</p>
          <Button type="submit" disabled={submitting || !title.trim()} size="sm" className="rounded-full px-5 shadow-sm">
            {submitting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <>Post <Send size={14} className="ml-1" /></>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}