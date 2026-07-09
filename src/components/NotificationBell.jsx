import { useState, useRef, useEffect } from 'react'
import { useNotifications } from '../hooks/useNotifications'
import { formatDate } from '../utils/formatDate'
import { Bell } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function NotificationBell({ userId }) {
  const { notifications, unreadCount, markAllRead } = useNotifications(userId)
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)

  const toggleOpen = () => {
    setOpen((prev) => !prev)
    if (!open && unreadCount > 0) markAllRead()
  }

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={wrapperRef}>
      <button 
        onClick={toggleOpen}
        className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-ink-900/5 dark:hover:bg-white/10 outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${open ? 'bg-ink-900/5 dark:bg-white/10 text-ink-900' : 'text-ink-700 hover:text-ink-900'}`}
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-surface dark:ring-surface animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-[calc(100%+8px)] w-[320px] origin-top-right rounded-xl border border-border/60 bg-surface/80 p-2 shadow-lg backdrop-blur-xl z-50 overflow-hidden"
          >
            <div className="mb-2 px-3 pt-2 pb-1">
              <h3 className="font-medium text-ink-900 text-sm">Notifications</h3>
            </div>
            
            <div className="max-h-[360px] overflow-y-auto rounded-lg custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-ink-600">
                  You're all caught up!
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {notifications.map((n) => (
                    <div key={n.id} className="flex flex-col gap-1 rounded-md px-3 py-2.5 transition-colors hover:bg-ink-900/5 dark:hover:bg-white/5">
                      <p className="text-sm text-ink-900 leading-snug">{n.message}</p>
                      <small className="text-[11px] font-medium text-ink-600">{formatDate(n.created_at)}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
