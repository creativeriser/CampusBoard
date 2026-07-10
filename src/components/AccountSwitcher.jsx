import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { User, LogOut, Plus, Check, Loader2, Settings } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import RoleBadge from './RoleBadge'
import { toast } from 'sonner'

export default function AccountSwitcher() {
  const { user, profile, savedAccounts, switchAccount, signOutAll } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isSwitching, setIsSwitching] = useState(null)
  const popoverRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  if (!user) return null

  // Current account object for display
  const currentAccount = {
    id: user.id,
    full_name: profile?.full_name || user.email?.split('@')[0] || 'Member',
    email: user.email,
    avatar_url: profile?.avatar_url,
    role: profile?.role || 'member'
  }

  // Other accounts
  const otherAccounts = savedAccounts.filter(acc => acc.id !== user.id)

  const handleSwitch = async (targetId) => {
    setIsSwitching(targetId)
    const { error } = await switchAccount(targetId)
    setIsSwitching(null)
    if (error) {
      toast.error('Session expired. Please log in again.')
    } else {
      setIsOpen(false)
      toast.success('Account switched')
    }
  }

  const handleSignOutAll = async () => {
    await signOutAll()
    navigate('/login')
  }

  return (
    <div className="relative" ref={popoverRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-ink-900/5 dark:hover:bg-white/10 outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-surface overflow-hidden border border-border/50"
        title="Accounts"
      >
        {currentAccount.avatar_url ? (
          <img src={currentAccount.avatar_url} alt="Profile" className="h-full w-full object-cover" />
        ) : (
          <User size={18} className="text-ink-700" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-white/10 dark:border-white/5 bg-white/70 dark:bg-black/40 backdrop-blur-2xl shadow-xl overflow-hidden z-50 origin-top-right"
          >
            {/* Active Account */}
            <div className="p-4 bg-white/50 dark:bg-white/5 flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 overflow-hidden mb-3">
                {currentAccount.avatar_url ? (
                  <img src={currentAccount.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xl font-bold uppercase">{currentAccount.full_name?.charAt(0)}</span>
                )}
              </div>
              <div className="flex items-center justify-center gap-1.5 w-full mb-1">
                <span className="truncate text-sm font-bold text-ink-900">{currentAccount.full_name}</span>
                <Check size={14} className="text-brand-500 shrink-0" />
              </div>
              <span className="truncate text-xs text-ink-500 w-full mb-3">{currentAccount.email}</span>
              <RoleBadge role={currentAccount.role} />
              
              <Link 
                to="/profile" 
                onClick={() => setIsOpen(false)}
                className="mt-4 flex items-center justify-center gap-2 w-full rounded-lg border border-border/50 bg-white/50 dark:bg-black/20 py-2 text-xs font-medium text-ink-700 hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-colors"
              >
                <Settings size={14} /> Manage Profile
              </Link>
            </div>

            {/* Other Accounts */}
            {otherAccounts.length > 0 && (
              <div className="border-t border-border/40 dark:border-white/5 py-1">
                {otherAccounts.map(acc => (
                  <button
                    key={acc.id}
                    onClick={() => handleSwitch(acc.id)}
                    disabled={isSwitching !== null}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors text-left"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-900/5 dark:bg-white/10 text-ink-700 overflow-hidden">
                      {acc.avatar_url ? (
                        <img src={acc.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold uppercase">{acc.full_name?.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="truncate text-sm font-medium text-ink-900">{acc.full_name}</span>
                      <span className="truncate text-xs text-ink-500">{acc.email}</span>
                    </div>
                    {isSwitching === acc.id && <Loader2 size={14} className="animate-spin text-ink-500 shrink-0" />}
                  </button>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="border-t border-border/40 dark:border-white/5 p-2 flex flex-col gap-1">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] hover:text-ink-900 transition-colors"
              >
                <Plus size={16} /> Add another account
              </Link>
              <button
                onClick={handleSignOutAll}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={16} /> Sign out of all accounts
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
