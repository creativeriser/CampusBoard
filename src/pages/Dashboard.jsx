import { useAuth } from '../context/AuthContext'
import { useNotices } from '../hooks/useNotices'
import { useRealtimeNotices } from '../hooks/useRealtimeNotices'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import NoticeForm from '../components/NoticeForm'
import NoticeCard from '../components/NoticeCard'

export default function Dashboard() {
  const { user } = useAuth()
  const { notices, setNotices, loading, addNotice, deleteNotice } = useNotices()

  // keeps `notices` state live-synced with DB changes from any user
  useRealtimeNotices(setNotices)

  const handleDelete = async (id) => {
    await deleteNotice(id)
    // no need to manually update state here - the realtime DELETE
    // subscription in useRealtimeNotices will remove it from state
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-surface transition-colors duration-300 relative">
      
      {/* Global Unified Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 flex items-center justify-center lg:justify-end lg:pr-[12%]">
          <div className="h-[500px] w-[500px] rounded-full bg-brand-500/15 dark:bg-brand-500/20 blur-[120px]" />
        </div>
        
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLCAwLCAwLCAwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] dark:hidden" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA0KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] hidden dark:block" />
      </div>

      <Navbar />

      <main className="relative z-10 flex-1 w-full max-w-3xl mx-auto px-4 py-8 md:px-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink-900 tracking-tight">
            Notice Board
          </h1>
          <p className="text-ink-600 mt-1">Stay updated with the latest campus announcements.</p>
        </div>

        <NoticeForm onAdd={addNotice} userId={user.id} />

        <div className="mt-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-ink-600">
              <Loader2 className="h-8 w-8 animate-spin mb-4 text-brand-500" />
              <p>Loading notices...</p>
            </div>
          ) : notices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-14 w-14 rounded-full bg-ink-900/5 dark:bg-white/5 flex items-center justify-center mb-4 shadow-sm border border-white/10">
                <span className="text-2xl opacity-80">📝</span>
              </div>
              <h3 className="text-xl font-display font-medium text-ink-900 mb-1">No notices yet</h3>
              <p className="text-ink-500">Be the first to post an announcement!</p>
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
                  onDelete={handleDelete}
                />
              ))}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
