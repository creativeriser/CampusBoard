import { useAuth } from '../context/AuthContext'
import { useNotices } from '../hooks/useNotices'
import { useRealtimeNotices } from '../hooks/useRealtimeNotices'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Inbox } from 'lucide-react'
import NoticeForm from '../components/NoticeForm'
import NoticeCard from '../components/NoticeCard'
import RoleBadge from '../components/RoleBadge'

export default function Dashboard() {
  const { user, profile } = useAuth()
  const { notices, setNotices, loading, addNotice, deleteNotice } = useNotices()

  // keeps `notices` state live-synced with DB changes from any user
  useRealtimeNotices(setNotices)

  const handleDelete = async (id) => {
    await deleteNotice(id)
    // no need to manually update state here - the realtime DELETE
    // subscription in useRealtimeNotices will remove it from state
  }

  return (
    <>
        <div className="mb-8">
          <h1 className="font-sans text-2xl md:text-3xl font-bold text-ink-900 tracking-tight">
            Notice Board
          </h1>
          <p className="text-ink-600 mt-1 text-sm font-medium">Stay updated with the latest campus announcements.</p>
        </div>

        <NoticeForm onAdd={addNotice} userId={user.id} />

        <div className="mt-8">
          {loading ? (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-white/5 bg-white/20 dark:bg-black/10 backdrop-blur-xl p-5 md:p-6 shadow-sm animate-pulse flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-black/5 dark:bg-white/5"></div>
                    <div className="flex flex-col gap-2">
                      <div className="h-3 w-24 bg-black/5 dark:bg-white/5 rounded"></div>
                      <div className="h-2 w-16 bg-black/5 dark:bg-white/5 rounded"></div>
                    </div>
                  </div>
                  <div className="pl-11 flex flex-col gap-3">
                    <div className="h-5 w-3/4 bg-black/5 dark:bg-white/5 rounded"></div>
                    <div className="h-3 w-full bg-black/5 dark:bg-white/5 rounded"></div>
                    <div className="h-3 w-5/6 bg-black/5 dark:bg-white/5 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : notices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="h-16 w-16 rounded-full bg-ink-900/5 dark:bg-white/5 flex items-center justify-center mb-5 shadow-sm border border-white/10">
                <Inbox size={28} className="text-ink-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-sans font-semibold text-ink-900 mb-1.5 tracking-tight">No notices yet</h3>
              <p className="text-ink-600 text-sm max-w-[250px]">When someone posts an announcement, it will appear here.</p>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-4"
            >
              {notices.map((notice) => (
                <NoticeCard
                  key={notice.id}
                  notice={notice}
                  currentUserId={user.id}
                  currentUserRole={profile?.role}
                  onDelete={handleDelete}
                />
              ))}
            </motion.div>
          )}
        </div>
    </>
  )
}
